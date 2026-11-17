import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  FileSearch,
  Globe,
  Link2,
  Search,
  Trash2,
  Zap,
} from 'lucide-react';
import type { PhoneNumberRecord, WebHarvestSummary } from '../shared/types.ts';
import { copyTextToClipboard } from '../utils/clipboard.ts';
import { PaginationBar } from './PaginationBar.tsx';

interface WebHarvesterPanelProps {
  onNewRecordsHarvested: () => void;
  onOpenContactFinder: (e164: string) => void;
}

const HARVESTER_PAGE_SIZE = 500;

const QUICK_WEB_LOCATIONS = [
  { label: 'California USA', postalCode: '', countryCode: 'US', city: '', state: 'CA' },
  { label: 'Texas USA', postalCode: '', countryCode: 'US', city: '', state: 'TX' },
  { label: 'New York USA', postalCode: '', countryCode: 'US', city: '', state: 'NY' },
  { label: 'Florida USA', postalCode: '', countryCode: 'US', city: '', state: 'FL' },
  { label: 'Illinois USA', postalCode: '', countryCode: 'US', city: '', state: 'IL' },
  { label: 'Pennsylvania USA', postalCode: '', countryCode: 'US', city: '', state: 'PA' },
  { label: 'Canada', postalCode: '', countryCode: 'CA', city: '', state: '' },
  { label: 'United Kingdom', postalCode: '', countryCode: 'GB', city: '', state: '' },
  { label: 'Germany', postalCode: '', countryCode: 'DE', city: '', state: '' },
  { label: 'Australia', postalCode: '', countryCode: 'AU', city: '', state: '' },
];

export const WebHarvesterPanel: React.FC<WebHarvesterPanelProps> = ({
  onNewRecordsHarvested,
  onOpenContactFinder,
}) => {
  const [mode, setMode] = useState<'directory' | 'url'>('directory');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('CA');
  const [postalCode, setPostalCode] = useState('');
  const [countryCode, setCountryCode] = useState('US');

  const [targetUrl, setTargetUrl] = useState('');
  const [urlCountry, setUrlCountry] = useState('US');

  const [isLoading, setIsLoading] = useState(false);
  const [isTurboRunning, setIsTurboRunning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastSummary, setLastSummary] = useState<WebHarvestSummary | null>(null);
  const [harvestedRecords, setHarvestedRecords] = useState<PhoneNumberRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPage, setCopiedPage] = useState(false);

  const mergeSessionHarvest = (summary: WebHarvestSummary) => {
    setLastSummary(summary);
    setHarvestedRecords((prev) => {
      const map = new Map<string, PhoneNumberRecord>();
      for (const r of summary.matchedRecords) {
        map.set(r.e164, r);
      }
      for (const r of prev) {
        if (!map.has(r.e164)) {
          map.set(r.e164, r);
        }
      }
      return Array.from(map.values());
    });
    setCurrentPage(1);
  };

  const executeTurboUsaWave = async () => {
    setIsTurboRunning(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/web-turbo-usa', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not complete USA Web Harvest Wave.');
      } else {
        mergeSessionHarvest(data as WebHarvestSummary);
        onNewRecordsHarvested();
      }
    } catch {
      setErrorMsg('Network error running USA Web Harvest Wave.');
    } finally {
      setIsTurboRunning(false);
    }
  };

  const executeDirectoryFetch = async (override?: {
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    countryCode?: string;
  }) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/web-discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: override ? override.firstName : firstName,
          lastName: override ? override.lastName : lastName,
          city: override ? override.city : city,
          state: override ? override.state : stateCode,
          postalCode: override ? override.postalCode : postalCode,
          countryCode: override ? override.countryCode : countryCode,
          limit: 200,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not fetch numbers from public registries.');
      } else {
        mergeSessionHarvest(data as WebHarvestSummary);
        onNewRecordsHarvested();
      }
    } catch {
      setErrorMsg('Network error connecting to live public registry.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeUrlCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/crawl-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl.trim(),
          defaultCountry: urlCountry,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not scan that website.');
      } else {
        mergeSessionHarvest(data as WebHarvestSummary);
        onNewRecordsHarvested();
      }
    } catch {
      setErrorMsg('Could not reach website URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * HARVESTER_PAGE_SIZE;
    return harvestedRecords.slice(start, start + HARVESTER_PAGE_SIZE);
  }, [harvestedRecords, currentPage]);

  const handleCopyOne = async (rec: PhoneNumberRecord) => {
    const ok = await copyTextToClipboard(rec.e164);
    if (ok) {
      setCopiedId(rec.id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === rec.id ? null : prev));
      }, 1500);
    }
  };

  const handleCopyCurrentPage = async () => {
    if (paginatedRecords.length === 0) return;
    const text = paginatedRecords.map((r) => r.e164).join('\n');
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedPage(true);
      setTimeout(() => setCopiedPage(false), 1800);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Live Public Registry Harvester Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h1 className="text-lg font-semibold text-slate-900">
              Live Web &amp; Worldwide Phone Harvester
            </h1>
            <p className="text-xs text-slate-600">
              Pull additional live phone numbers and individual owner names from public directories and websites into your worldwide directory. Results are paginated at 500 per page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={executeTurboUsaWave}
              disabled={isTurboRunning}
              className="h-10 px-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {isTurboRunning
                  ? 'Harvesting USA Wave...'
                  : 'USA Multi-State Fetch (+1,000+)'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Targeted Public Registry Search or Webpage Scanner
          </h2>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('directory')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'directory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Search People &amp; States
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'url'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scan Any Website URL
            </button>
          </div>
        </div>

        {mode === 'directory' ? (
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500 mr-1">
                Quick Locations:
              </span>
              {QUICK_WEB_LOCATIONS.map((loc) => (
                <button
                  key={loc.label}
                  type="button"
                  onClick={() => {
                    setFirstName('');
                    setLastName('');
                    setCity(loc.city);
                    setStateCode(loc.state);
                    setPostalCode(loc.postalCode);
                    setCountryCode(loc.countryCode);
                    executeDirectoryFetch({
                      firstName: '',
                      lastName: '',
                      city: loc.city,
                      state: loc.state,
                      postalCode: loc.postalCode,
                      countryCode: loc.countryCode,
                    });
                  }}
                  className="px-2.5 py-1 text-xs text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeDirectoryFetch();
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-end pt-1"
            >
              <div className="space-y-1">
                <label htmlFor="web-first" className="block text-xs font-medium text-slate-700">
                  First Name
                </label>
                <input
                  id="web-first"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Michael"
                  className="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-last" className="block text-xs font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  id="web-last"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Smith"
                  className="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-state" className="block text-xs font-medium text-slate-700">
                  US State (2-Letter)
                </label>
                <input
                  id="web-state"
                  type="text"
                  maxLength={2}
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                  placeholder="CA, TX, NY..."
                  className="w-full h-9 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-city" className="block text-xs font-medium text-slate-700">
                  City
                </label>
                <input
                  id="web-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Houston"
                  className="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-zip" className="block text-xs font-medium text-slate-700">
                  Zip Code
                </label>
                <input
                  id="web-zip"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 90210"
                  className="w-full h-9 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-country" className="block text-xs font-medium text-slate-700">
                  Country
                </label>
                <select
                  id="web-country"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full h-9 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="IN">India</option>
                  <option value="JP">Japan</option>
                  <option value="AU">Australia</option>
                  <option value="MX">Mexico</option>
                  <option value="BR">Brazil</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-9 px-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                <Search className="w-3.5 h-3.5" />
                {isLoading ? 'Fetching...' : 'Get Numbers'}
              </button>
            </form>
          </div>
        ) : (
          <form
            onSubmit={executeUrlCrawl}
            className="bg-white border border-slate-200 rounded-lg p-5 space-y-4"
          >
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-64 space-y-1">
                <label htmlFor="crawl-url-input" className="block text-xs font-medium text-slate-700">
                  Public Website Address (URL)
                </label>
                <input
                  id="crawl-url-input"
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://www.whitehouse.gov/contact/ or any public contact/directory page"
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="w-44 space-y-1">
                <label htmlFor="crawl-country" className="block text-xs font-medium text-slate-700">
                  Default Country
                </label>
                <select
                  id="crawl-country"
                  value={urlCountry}
                  onChange={(e) => setUrlCountry(e.target.value)}
                  className="w-full h-10 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="US">United States (+1)</option>
                  <option value="GB">United Kingdom (+44)</option>
                  <option value="CA">Canada (+1)</option>
                  <option value="DE">Germany (+49)</option>
                  <option value="FR">France (+33)</option>
                  <option value="AU">Australia (+61)</option>
                  <option value="IN">India (+91)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-10 px-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
              >
                <Link2 className="w-3.5 h-3.5" />
                {isLoading ? 'Scanning Page...' : 'Scan Webpage'}
              </button>
            </div>
          </form>
        )}

        {errorMsg && (
          <div className="p-4 bg-white border border-red-200 rounded-lg text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {(lastSummary || harvestedRecords.length > 0) && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-700">
                <Globe className="w-3.5 h-3.5 text-sky-700 inline mr-1.5 -mt-0.5" />
                {lastSummary && (
                  <>
                    Latest wave fetched{' '}
                    <span className="font-semibold text-slate-900">
                      {lastSummary.fetchedCount.toLocaleString()}
                    </span>{' '}
                    numbers ({lastSummary.newlyAddedCount.toLocaleString()} newly added in{' '}
                    {lastSummary.durationMs} ms) ·{' '}
                  </>
                )}
                Session total:{' '}
                <span className="font-semibold text-slate-900">
                  {harvestedRecords.length.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {paginatedRecords.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCopyCurrentPage}
                    className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                    title="Copy only the phone numbers shown on the current page"
                  >
                    {copiedPage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800">
                          Copied Page ({paginatedRecords.length.toLocaleString()})!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-sky-700" />
                        <span>Copy Page ({paginatedRecords.length.toLocaleString()})</span>
                      </>
                    )}
                  </button>
                )}

                {harvestedRecords.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setHarvestedRecords([]);
                      setLastSummary(null);
                      setCurrentPage(1);
                    }}
                    className="h-8 px-2.5 inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                    title="Clear session list (numbers remain saved in your Directory)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear View</span>
                  </button>
                )}
              </div>
            </div>

            {harvestedRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No public phone numbers matched that exact web query. Click USA Multi-State Fetch above or choose another state.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto max-h-[520px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Phone Number Owner</th>
                        <th className="py-2.5 px-4 font-semibold">Phone Number</th>
                        <th className="py-2.5 px-4 font-semibold">Carrier &amp; Type</th>
                        <th className="py-2.5 px-4 font-semibold">Location</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Public Info</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRecords.map((rec) => {
                        const isCopied = copiedId === rec.id;
                        return (
                          <tr key={rec.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 font-semibold text-slate-900">
                              {rec.ownerName}
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopyOne(rec)}
                                  className="font-mono tabular-nums font-medium text-slate-900 hover:text-sky-700 cursor-pointer"
                                >
                                  {rec.internationalFormat}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyOne(rec)}
                                  className={`h-7 px-2.5 inline-flex items-center gap-1 text-[11px] font-medium rounded border transition-colors whitespace-nowrap cursor-pointer ${
                                    isCopied
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-700" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      Copy
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-slate-700">
                              {rec.carrierGroup} · {rec.lineType}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {[rec.city, rec.regionCode, rec.postalCode, rec.countryName]
                                .filter(Boolean)
                                .join(' · ')}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => onOpenContactFinder(rec.e164)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors cursor-pointer"
                              >
                                <FileSearch className="w-3 h-3" />
                                <span>Report</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <PaginationBar
                  totalItems={harvestedRecords.length}
                  pageSize={HARVESTER_PAGE_SIZE}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  itemLabel="harvested numbers"
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
