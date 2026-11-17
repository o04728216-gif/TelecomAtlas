import express from 'express';
import fs from 'fs';
import path from 'path';
import type { LineType, WebHarvestSummary } from './src/shared/types.ts';
import { parseAndClassifyPhoneNumber } from './src/server/prefixEngine.ts';
import { registryStore } from './src/server/registryStore.ts';
import type { QueryFilterInput } from './src/server/registryStore.ts';
import { lookupPublicContactByPhone } from './src/server/contactFinderService.ts';
import {
  crawlPublicWebpageForPhones,
  fetchLiveWebIndividualOwners,
} from './src/server/webHarvester.ts';

const PORT = 3000;

function extractFilterInputFromQuery(query: express.Request['query']): QueryFilterInput {
  const continent = typeof query.continent === 'string' ? query.continent : undefined;
  const country = typeof query.country === 'string' ? query.country : undefined;
  const region = typeof query.region === 'string' ? query.region : undefined;

  const zipCodesRaw = typeof query.zipCodes === 'string' ? query.zipCodes : '';
  const zipCodes = zipCodesRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const carriersRaw = typeof query.carriers === 'string' ? query.carriers : '';
  const carriers = carriersRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const lineTypesRaw = typeof query.lineTypes === 'string' ? query.lineTypes : '';
  const allowedTypes = new Set<LineType>(['MOBILE', 'LANDLINE', 'VOIP', 'TOLL_FREE']);
  const lineTypes = lineTypesRaw
    .split(',')
    .map((s) => s.trim().toUpperCase() as LineType)
    .filter((t) => allowedTypes.has(t));

  const prefix = typeof query.prefix === 'string' ? query.prefix : undefined;
  const search = typeof query.search === 'string' ? query.search : undefined;
  const onlyLiveWeb = query.onlyLiveWeb === 'true';
  const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : 500;
  const offset = typeof query.offset === 'string' ? parseInt(query.offset, 10) : 0;

  return {
    continent,
    country,
    region,
    zipCodes,
    carriers,
    lineTypes,
    prefix,
    search,
    onlyLiveWeb,
    limit: Number.isNaN(limit) ? 500 : limit,
    offset: Number.isNaN(offset) ? 0 : offset,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  registryStore.ensureInitialized();

  // 1. Hierarchical Facets & Real Verified Counts
  app.get('/api/facets', (req, res) => {
    try {
      const continent = typeof req.query.continent === 'string' ? req.query.continent : undefined;
      const country = typeof req.query.country === 'string' ? req.query.country : undefined;
      const region = typeof req.query.region === 'string' ? req.query.region : undefined;
      const summary = registryStore.getFacets({ continent, country, region });
      res.json(summary);
    } catch (error) {
      console.error('Error computing facets:', error);
      res.status(500).json({ error: 'Failed to load directory filters.' });
    }
  });

  // 2. Real Existing Phone Directory Paginated Search (Default 500 per page)
  app.get('/api/numbers', (req, res) => {
    try {
      const filterInput = extractFilterInputFromQuery(req.query);
      const result = registryStore.queryNumbers(filterInput);
      res.json(result);
    } catch (error) {
      console.error('Error querying numbers:', error);
      res.status(500).json({ error: 'Failed to search phone directory.' });
    }
  });

  // 3. Dedicated Contact Finder — Reverse Phone Public Dossier Lookup
  app.post('/api/contact-finder/phone', async (req, res) => {
    try {
      const { phoneNumber, defaultCountry } = req.body as {
        phoneNumber?: string;
        defaultCountry?: string;
      };
      if (!phoneNumber || !phoneNumber.trim()) {
        return res.status(400).json({ error: 'Please enter a phone number to look up.' });
      }
      const report = await lookupPublicContactByPhone(
        phoneNumber.trim(),
        defaultCountry || undefined
      );
      return res.json(report);
    } catch (error) {
      console.error('Error in /api/contact-finder/phone:', error);
      return res.status(500).json({ error: 'Failed to retrieve public contact report.' });
    }
  });

  // 4. Dedicated Contact Finder — People / Name & Location Search (Merges live registry + local index)
  app.post('/api/contact-finder/people', async (req, res) => {
    const startMs = performance.now();
    try {
      const { firstName, lastName, city, state, postalCode, countryCode } = req.body as {
        firstName?: string;
        lastName?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        countryCode?: string;
      };

      const liveRecords = await fetchLiveWebIndividualOwners({
        firstName: firstName?.trim() || undefined,
        lastName: lastName?.trim() || undefined,
        city: city?.trim() || undefined,
        state: state?.trim() || undefined,
        postalCode: postalCode?.trim() || undefined,
        countryCode: countryCode?.trim() || 'US',
        limit: 200,
      });

      if (liveRecords.length > 0) {
        registryStore.mergeHarvestedWebRecords(liveRecords);
      }

      const searchTerms = [firstName, lastName, city].map((s) => s?.trim()).filter(Boolean).join(' ');
      const localQuery = registryStore.queryNumbers({
        country: countryCode?.trim() || undefined,
        region: state?.trim() ? `${countryCode?.trim() || 'US'}-${state.trim().toUpperCase()}` : undefined,
        zipCodes: postalCode?.trim() ? [postalCode.trim()] : [],
        search: searchTerms || undefined,
        limit: 1000,
        offset: 0,
      });

      // Combine live + local without duplicates
      const combinedMap = new Map<string, typeof liveRecords[number]>();
      for (const r of liveRecords) combinedMap.set(r.e164, r);
      for (const r of localQuery.items) {
        if (!combinedMap.has(r.e164)) combinedMap.set(r.e164, r);
      }

      return res.json({
        items: Array.from(combinedMap.values()),
        durationMs: Math.round(performance.now() - startMs),
      });
    } catch (error) {
      console.error('Error in /api/contact-finder/people:', error);
      return res.status(500).json({ error: 'Failed to search public contact records.' });
    }
  });

  // 5. Real Verified Numbers Export (.txt or .csv)
  app.get('/api/stream-export', async (req, res) => {
    try {
      const filterInput = extractFilterInputFromQuery(req.query);
      const countRaw = typeof req.query.count === 'string' ? parseInt(req.query.count, 10) : 50000;
      const count = Number.isNaN(countRaw) ? 50000 : countRaw;
      const format = req.query.format === 'csv' ? 'csv' : 'txt';
      await registryStore.streamExportNumbers(filterInput, count, format, res);
    } catch (error) {
      console.error('Error exporting real numbers:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to export phone numbers.' });
      }
    }
  });

  // 6. Live E.164 & Batch Existence Parser
  app.post('/api/parse', (req, res) => {
    try {
      const { phoneNumber, phoneNumbers, defaultCountry } = req.body as {
        phoneNumber?: string;
        phoneNumbers?: string[];
        defaultCountry?: string;
      };

      const ownerResolver = (e164: string) => registryStore.lookupOwnerByE164(e164);

      if (Array.isArray(phoneNumbers)) {
        const results = phoneNumbers
          .slice(0, 500)
          .map((num) => parseAndClassifyPhoneNumber(String(num), defaultCountry, ownerResolver));
        return res.json({ results });
      }

      if (typeof phoneNumber === 'string') {
        const result = parseAndClassifyPhoneNumber(phoneNumber, defaultCountry, ownerResolver);
        return res.json(result);
      }

      return res.status(400).json({ error: 'Please enter a phone number.' });
    } catch (error) {
      console.error('Error parsing phone number:', error);
      res.status(500).json({ error: 'Failed to check phone number.' });
    }
  });

  // 7. Live Web Individual Owner Discovery
  app.post('/api/web-discover', async (req, res) => {
    const startMs = performance.now();
    try {
      const {
        queryText,
        firstName,
        lastName,
        city,
        state,
        postalCode,
        countryCode,
        limit,
      } = req.body as {
        queryText?: string;
        firstName?: string;
        lastName?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        countryCode?: string;
        limit?: number;
      };

      let resolvedFirst = firstName?.trim();
      let resolvedLast = lastName?.trim();
      let resolvedZip = postalCode?.trim();
      let resolvedCity = city?.trim();
      let resolvedState = state?.trim();

      if (queryText && queryText.trim()) {
        const q = queryText.trim();
        if (/^\d{5}$/.test(q)) {
          resolvedZip = q;
        } else if (/^[A-Za-z]{2}$/.test(q)) {
          resolvedState = q.toUpperCase();
        } else {
          const parts = q.split(/\s+/).filter(Boolean);
          if (parts.length >= 2) {
            resolvedFirst = parts[0];
            resolvedLast = parts.slice(1).join(' ');
          } else if (parts.length === 1) {
            resolvedLast = parts[0];
          }
        }
      }

      let records = await fetchLiveWebIndividualOwners({
        firstName: resolvedFirst,
        lastName: resolvedLast,
        city: resolvedCity,
        state: resolvedState,
        postalCode: resolvedZip,
        countryCode: countryCode?.trim() || undefined,
        limit: limit ?? 200,
      });

      if (records.length === 0 && queryText && !resolvedCity && resolvedLast && !resolvedFirst) {
        records = await fetchLiveWebIndividualOwners({
          city: resolvedLast,
          countryCode: countryCode?.trim() || undefined,
          limit: limit ?? 200,
        });
      }

      const newlyAddedCount = registryStore.mergeHarvestedWebRecords(records);
      const summary: WebHarvestSummary = {
        source: 'Live Public Contact Registry',
        fetchedCount: records.length,
        newlyAddedCount,
        matchedRecords: records,
        durationMs: Math.round(performance.now() - startMs),
      };

      res.json(summary);
    } catch (error) {
      console.error('Error in /api/web-discover:', error);
      res.status(500).json({ error: 'Could not reach live web directory right now.' });
    }
  });

  // 8. Multi-State Real USA Harvester Wave
  app.post('/api/web-turbo-usa', async (_req, res) => {
    const startMs = performance.now();
    try {
      const wave = await registryStore.runNextUsaTurboWebWave();
      const summary: WebHarvestSummary = {
        source: 'USA Multi-State Public Registry Harvester',
        fetchedCount: wave.fetchedCount,
        newlyAddedCount: wave.newlyAddedCount,
        matchedRecords: wave.matchedRecords,
        durationMs: Math.round(performance.now() - startMs),
      };
      res.json(summary);
    } catch (error) {
      console.error('Error in /api/web-turbo-usa:', error);
      res.status(500).json({ error: 'Failed to run USA live web wave.' });
    }
  });

  // 9. Direct Public Webpage URL Crawler
  app.post('/api/crawl-url', async (req, res) => {
    const startMs = performance.now();
    try {
      const { url, defaultCountry } = req.body as {
        url?: string;
        defaultCountry?: string;
      };
      if (!url || !url.trim()) {
        return res.status(400).json({ error: 'Please enter a website URL to scan.' });
      }

      const records = await crawlPublicWebpageForPhones(url.trim(), defaultCountry || 'US');
      const newlyAddedCount = registryStore.mergeHarvestedWebRecords(records);

      const summary: WebHarvestSummary = {
        source: url.trim(),
        fetchedCount: records.length,
        newlyAddedCount,
        matchedRecords: records,
        durationMs: Math.round(performance.now() - startMs),
      };
      res.json(summary);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to scan webpage.';
      res.status(400).json({ error: msg });
    }
  });

  // 10. Bulk Add / Import Numbers
  app.post('/api/ingest', (req, res) => {
    try {
      const { rawText, sourceLabel, defaultCountry } = req.body as {
        rawText?: string;
        sourceLabel?: string;
        defaultCountry?: string;
      };

      if (!rawText || typeof rawText !== 'string') {
        return res.status(400).json({ error: 'Paste one or more phone numbers (one per line).' });
      }

      const lines = rawText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => /\d{6,}/.test(line));

      if (lines.length === 0) {
        return res.status(400).json({ error: 'No valid phone numbers found in text.' });
      }

      const job = registryStore.enqueueBatchIngestion(
        lines,
        sourceLabel || 'Imported Phone List',
        defaultCountry || undefined
      );
      res.status(202).json(job);
    } catch (error) {
      console.error('Error enqueueing import:', error);
      res.status(500).json({ error: 'Failed to import phone numbers.' });
    }
  });

  app.get('/api/ingest/jobs', (_req, res) => {
    res.json({ jobs: registryStore.getJobs() });
  });

  app.get('/api/architecture/artifacts', (_req, res) => {
    try {
      const schemaPath = path.resolve(process.cwd(), 'schema/postgresql_postgis_schema.sql');
      const enginePath = path.resolve(process.cwd(), 'src/server/prefixEngine.ts');
      const schemaSql = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf-8') : '';
      const engineCode = fs.existsSync(enginePath) ? fs.readFileSync(enginePath, 'utf-8') : '';
      res.json({ schemaSql, engineCode });
    } catch {
      res.status(500).json({ error: 'Failed to read schema files.' });
    }
  });

  const distPath = path.resolve(process.cwd(), 'dist');
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(distPath);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TelecomAtlas server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
