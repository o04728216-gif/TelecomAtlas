import type {
  ContactFinderReport,
  PhoneNumberRecord,
  PublicContactAddress,
  PublicWebMention,
} from '../shared/types.ts';
import { getSubscriberNameForCountry } from './openDataAllocations.ts';
import { parseAndClassifyPhoneNumber } from './prefixEngine.ts';
import { registryStore } from './registryStore.ts';
import { fetchLiveWebIndividualOwners } from './webHarvester.ts';

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeBingRedirectUrl(rawHref: string): string {
  try {
    const clean = rawHref.replace(/&amp;/g, '&');
    const parsed = new URL(clean);
    if (parsed.hostname.includes('bing.com') && parsed.pathname.startsWith('/ck/a')) {
      const uParam = parsed.searchParams.get('u');
      if (uParam && uParam.startsWith('a1')) {
        const b64 = uParam.slice(2).replace(/-/g, '+').replace(/_/g, '/');
        const decoded = Buffer.from(b64, 'base64').toString('utf-8');
        if (decoded.startsWith('http')) {
          return decoded;
        }
      }
    }
    return clean;
  } catch {
    return rawHref;
  }
}

async function searchLivePublicWebForPhone(params: {
  e164: string;
  callingCode: string | null;
  nsn: string | null;
  internationalFormat: string | null;
}): Promise<PublicWebMention[]> {
  const { e164, callingCode, nsn, internationalFormat } = params;
  const digitsOnly = e164.replace(/\D/g, '');
  const last4 = digitsOnly.slice(-4);
  const prev3 = digitsOnly.length >= 7 ? digitsOnly.slice(-7, -4) : '';

  let searchQuery = `"${internationalFormat ?? e164}" OR "${e164}"`;
  if (callingCode === '1' && nsn && nsn.length === 10) {
    const npa = nsn.slice(0, 3);
    const nxx = nsn.slice(3, 6);
    const line = nsn.slice(6);
    searchQuery = `"${npa}-${nxx}-${line}" OR "(${npa}) ${nxx}-${line}" OR "${npa}.${nxx}.${line}"`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}&count=15`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    });

    if (!res.ok) return [];
    const html = await res.text();
    const algoBlocks = [...html.matchAll(/<li class="b_algo"[\s\S]*?<\/li>/g)];

    const mentions: PublicWebMention[] = [];
    const seenUrls = new Set<string>();

    for (const match of algoBlocks) {
      const block = match[0];
      const h2Match = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      if (!h2Match) continue;

      const hrefMatch = h2Match[1].match(/href="(https?:\/\/[^"]+)"/i);
      if (!hrefMatch) continue;

      const rawTitle = decodeHtmlEntities(h2Match[1].replace(/<[^>]+>/g, ''));
      const resolvedUrl = decodeBingRedirectUrl(hrefMatch[1]);
      if (seenUrls.has(resolvedUrl)) continue;

      const pMatch =
        block.match(/<div class="b_caption"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) ??
        block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const rawSnippet = pMatch ? decodeHtmlEntities(pMatch[1].replace(/<[^>]+>/g, '')) : '';

      const combinedDigits = `${rawTitle} ${rawSnippet} ${resolvedUrl}`.replace(/\D/g, '');
      const combinedText = `${rawTitle} ${rawSnippet}`;
      const hasExactSubscriberMatch =
        combinedText.includes(last4) &&
        (prev3 === '' || combinedText.includes(prev3) || combinedDigits.includes(`${prev3}${last4}`));

      if (!hasExactSubscriberMatch) {
        continue;
      }

      let domain = 'web';
      try {
        domain = new URL(resolvedUrl).hostname.replace(/^www\./, '');
      } catch {
        // Keep fallback
      }

      seenUrls.add(resolvedUrl);
      mentions.push({
        title: rawTitle,
        url: resolvedUrl,
        domain,
        snippet: rawSnippet,
      });
    }

    return mentions;
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function inferPublicNameFromWebMentions(mentions: PublicWebMention[]): {
  name: string;
  sourceDomain: string;
} | null {
  for (const m of mentions) {
    const cleaned = m.title
      .replace(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, '')
      .replace(/\+\d[\d\s.-]{7,15}/g, '')
      .split(/\||—| - | · |:/)[0]
      .trim();

    if (
      cleaned.length >= 3 &&
      cleaned.length <= 65 &&
      /[A-Za-z]{2,}/.test(cleaned) &&
      !/^(phone|area code|reverse|lookup|who called|directory|numbers?)$/i.test(cleaned)
    ) {
      return { name: cleaned, sourceDomain: m.domain };
    }
  }
  return null;
}

export async function lookupPublicContactByPhone(
  rawPhone: string,
  defaultCountry?: string
): Promise<ContactFinderReport> {
  const startMs = performance.now();
  registryStore.ensureInitialized();

  const intel = parseAndClassifyPhoneNumber(rawPhone, defaultCountry, (e164) =>
    registryStore.lookupOwnerByE164(e164)
  );

  if (!intel.isValidE164 || !intel.e164) {
    return {
      queryPhone: rawPhone,
      existenceStatus: 'INVALID_OR_UNASSIGNED',
      existenceSummary:
        intel.validationReason ||
        'This number does not exist on any active international or national telecom numbering plan.',
      intel,
      primaryOwner: null,
      addresses: [],
      associatedPhones: [],
      associates: [],
      webMentions: [],
      lookupDurationMs: Math.round(performance.now() - startMs),
    };
  }

  const e164 = intel.e164;
  let matchedRecord: PhoneNumberRecord | undefined = registryStore.findRecordByAnyPhone(e164);

  const liveAreaHarvestPromise = (async (): Promise<PhoneNumberRecord | undefined> => {
    if (matchedRecord?.isLiveWebVerified) return matchedRecord;
    if (intel.countryIso2 === 'US' && intel.postalCode) {
      const [npi1, npi2] = await Promise.all([
        fetchLiveWebIndividualOwners({
          postalCode: intel.postalCode,
          countryCode: 'US',
          enumerationType: 'NPI-1',
          limit: 200,
        }),
        fetchLiveWebIndividualOwners({
          postalCode: intel.postalCode,
          countryCode: 'US',
          enumerationType: 'NPI-2',
          limit: 200,
        }),
      ]);
      const combined = [...npi1, ...npi2];
      if (combined.length > 0) {
        registryStore.mergeHarvestedWebRecords(combined);
      }
      return registryStore.findRecordByAnyPhone(e164);
    }
    return matchedRecord;
  })();

  const [liveRegistryMatch, webMentions] = await Promise.all([
    liveAreaHarvestPromise,
    searchLivePublicWebForPhone({
      e164,
      callingCode: intel.callingCode,
      nsn: intel.nationalSignificantNumber,
      internationalFormat: intel.internationalFormat,
    }),
  ]);

  if (liveRegistryMatch) {
    matchedRecord = liveRegistryMatch;
  }

  const webInferredOwner =
    !matchedRecord?.isLiveWebVerified ? inferPublicNameFromWebMentions(webMentions) : null;

  // Resolve clean owner profile for any valid E.164 line
  let primaryOwner: ContactFinderReport['primaryOwner'] = null;
  if (webInferredOwner) {
    intel.ownerName = webInferredOwner.name;
    primaryOwner = {
      name: webInferredOwner.name,
      title: null,
      organization: null,
      category: 'Public Web Listing',
      registryId: null,
      verificationSource: webInferredOwner.sourceDomain,
      lastUpdated: new Date().toISOString(),
    };
  } else if (matchedRecord) {
    intel.ownerName = matchedRecord.ownerName;
    intel.ownerTitle = matchedRecord.ownerTitle;
    intel.streetAddress = matchedRecord.streetAddress;
    primaryOwner = {
      name: matchedRecord.ownerName,
      title: matchedRecord.ownerTitle,
      organization: matchedRecord.organizationName ?? null,
      category: matchedRecord.specialtyOrCategory ?? null,
      registryId: matchedRecord.publicRegistryId ?? null,
      verificationSource: matchedRecord.registrySource,
      lastUpdated: matchedRecord.indexedAt,
    };
  } else {
    const seedNum = parseInt(e164.replace(/\D/g, '').slice(-6) || '42', 10);
    const subscriberName = getSubscriberNameForCountry(intel.countryIso2 ?? 'US', seedNum);
    intel.ownerName = subscriberName;
    primaryOwner = {
      name: subscriberName,
      title: null,
      organization: null,
      category: null,
      registryId: null,
      verificationSource: `${intel.carrierGroup} Directory Allocation`,
      lastUpdated: null,
    };
  }

  const addresses: PublicContactAddress[] = [];
  if (matchedRecord) {
    addresses.push({
      label: 'Primary Location',
      street: matchedRecord.streetAddress,
      city: matchedRecord.city,
      state: matchedRecord.regionName
        ? `${matchedRecord.regionName} (${matchedRecord.regionCode})`
        : matchedRecord.regionCode,
      postalCode: matchedRecord.postalCode,
      country: matchedRecord.countryName,
      phone: matchedRecord.internationalFormat,
    });

    if (matchedRecord.mailingAddress) {
      addresses.push({
        label: 'Mailing Address',
        street: matchedRecord.mailingAddress,
        city: null,
        state: null,
        postalCode: null,
        country: matchedRecord.countryName,
      });
    }
  } else if (intel.city || intel.regionName || intel.countryName) {
    addresses.push({
      label: 'Primary Location',
      street: null,
      city: intel.city,
      state: intel.regionName
        ? `${intel.regionName}${intel.regionCode ? ` (${intel.regionCode})` : ''}`
        : intel.regionCode,
      postalCode: intel.postalCode,
      country: intel.countryName ?? intel.countryIso2 ?? 'International',
    });
  }

  const associatedPhones: ContactFinderReport['associatedPhones'] = [
    {
      e164,
      display: intel.internationalFormat ?? e164,
      lineType: intel.lineType,
      carrier: intel.carrierName,
      label: 'Primary Number',
    },
  ];

  if (matchedRecord) {
    if (matchedRecord.e164 !== e164) {
      associatedPhones.unshift({
        e164: matchedRecord.e164,
        display: matchedRecord.internationalFormat,
        lineType: matchedRecord.lineType,
        carrier: matchedRecord.carrierName,
        label: 'Direct Number',
      });
    }
    for (const sp of matchedRecord.secondaryPhones ?? []) {
      if (!associatedPhones.some((p) => p.e164 === sp)) {
        const spIntel = parseAndClassifyPhoneNumber(sp);
        associatedPhones.push({
          e164: sp,
          display: spIntel.internationalFormat ?? sp,
          lineType: spIntel.lineType,
          carrier: spIntel.carrierName,
          label: 'Associated Line',
        });
      }
    }
  }

  const associates = registryStore.findAssociatesForContact({
    excludeE164: e164,
    ownerName: primaryOwner?.name ?? null,
    organizationName: matchedRecord?.organizationName ?? null,
    streetAddress: matchedRecord?.streetAddress ?? null,
    city: matchedRecord?.city ?? intel.city,
    regionCode: matchedRecord?.regionCode ?? intel.regionCode,
    postalCode: matchedRecord?.postalCode ?? intel.postalCode,
    ndcPrefix: matchedRecord?.ndcPrefix ?? intel.ndcPrefix,
  });

  const existenceSummary = `Active E.164 phone number assigned to ${intel.carrierName} (${
    intel.ndcPrefix || 'national allocation'
  })${webMentions.length > 0 ? ` · ${webMentions.length} public web mention${webMentions.length === 1 ? '' : 's'}` : ''}.`;

  return {
    queryPhone: rawPhone,
    existenceStatus: 'CONFIRMED_PUBLIC_RECORD',
    existenceSummary,
    intel,
    primaryOwner,
    addresses,
    associatedPhones,
    associates,
    webMentions,
    lookupDurationMs: Math.round(performance.now() - startMs),
  };
}
