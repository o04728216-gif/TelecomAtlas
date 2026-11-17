import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  FileSearch,
  Globe,
  Link2,
  Phone,
  Search,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import type { PhoneNumberRecord, WebHarvestSummary } from '../shared/types.ts';
import { copyTextToClipboard } from '../utils/clipboard.ts';
import { formatDirectoryFullName } from '../utils/formatters.ts';
import { PaginationBar } from './PaginationBar.tsx';

interface WebHarvesterPanelProps {
  mode?: 'directory' | 'url';
  onModeChange?: (mode: 'directory' | 'url') => void;
  onNewRecordsHarvested: () => void;
  onOpenContactFinder: (e164: string) => void;
}

const HARVESTER_PAGE_SIZE = 500;

const QUICK_WEB_LOCATIONS = [
  { label: 'California', postalCode: '', countryCode: 'US', city: '', state: 'CA' },
  { label: 'Texas', postalCode: '', countryCode: 'US', city: '', state: 'TX' },
  { label: 'New York', postalCode: '', countryCode: 'US', city: '', state: 'NY' },
  { label: 'Florida', postalCode: '', countryCode: 'US', city: '', state: 'FL' },
  { label: 'Illinois', postalCode: '', countryCode: 'US', city: '', state: 'IL' },
  { label: 'Canada', postalCode: '', countryCode: 'CA', city: '', state: '' },
  { label: 'UK', postalCode: '', countryCode: 'GB', city: '', state: '' },
  { label: 'Germany', postalCode: '', countryCode: 'DE', city: '', state: '' },
  { label: 'Japan', postalCode: '', countryCode: 'JP', city: '', state: '' },
  { label: 'Australia', postalCode: '', countryCode: 'AU', city: '', state: '' },
];

const GLOBAL_COUNTRY_OPTIONS = [
  { iso2: 'US', label: 'United States (+1)' },
  { iso2: 'CA', label: 'Canada (+1)' },
  { iso2: 'MX', label: 'Mexico (+52)' },
  { iso2: 'GB', label: 'United Kingdom (+44)' },
  { iso2: 'DE', label: 'Germany (+49)' },
  { iso2: 'FR', label: 'France (+33)' },
  { iso2: 'ES', label: 'Spain (+34)' },
  { iso2: 'IT', label: 'Italy (+39)' },
  { iso2: 'NL', label: 'Netherlands (+31)' },
  { iso2: 'CH', label: 'Switzerland (+41)' },
  { iso2: 'SE', label: 'Sweden (+46)' },
  { iso2: 'PL', label: 'Poland (+48)' },
  { iso2: 'IE', label: 'Ireland (+353)' },
  { iso2: 'JP', label: 'Japan (+81)' },
  { iso2: 'IN', label: 'India (+91)' },
  { iso2: 'SG', label: 'Singapore (+65)' },
  { iso2: 'KR', label: 'South Korea (+82)' },
  { iso2: 'AE', label: 'UAE (+971)' },
  { iso2: 'SA', label: 'Saudi Arabia (+966)' },
  { iso2: 'PH', label: 'Philippines (+63)' },
  { iso2: 'ID', label: 'Indonesia (+62)' },
  { iso2: 'BR', label: 'Brazil (+55)' },
  { iso2: 'AR', label: 'Argentina (+54)' },
  { iso2: 'CO', label: 'Colombia (+57)' },
  { iso2: 'NG', label: 'Nigeria (+234)' },
  { iso2: 'ZA', label: 'South Africa (+27)' },
  { iso2: 'KE', label: 'Kenya (+254)' },
  { iso2: 'EG', label: 'Egypt (+20)' },
  { iso2: 'AU', label: 'Australia (+61)' },
  { iso2: 'NZ', label: 'New Zealand (+64)' },
];

export const WebHarvesterPanel: React.FC<WebHarvesterPanelProps> = ({
  mode: controlledMode,
  onModeChange,
  onNewRecordsHarvested,
  onOpenContactFinder,
}) => {
  const [internalMode, setInternalMode] = useState<'directory' | 'url'>('directory');
  const mode = controlledMode ?? internalMode;
  const setMode = (next: 'directory' | 'url') => {
    setInternalMode(next);
    onModeChange?.(next);
  };

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

  const [copiedNameId, setCopiedNameId] = useState<string | null>(null);
  const [copiedNumberId, setCopiedNumberId] = useState<string | null>(null);
  const [copiedPageNames, setCopiedPageNames] = useState(false);
  const [copiedPageNumbers, setCopiedPageNumbers] = useState(false);

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

  const handleCopyOneName = async (rec: PhoneNumberRecord) => {
    const cleanFullName = formatDirectoryFullName(rec.ownerName);
    const ok = await copyTextToClipboard(cleanFullName);
    if (ok) {
      setCopiedNameId(rec.id);
      setTimeout(() => {
        setCopiedNameId((prev) => (prev === rec.id ? null : prev));
      }, 1500);
    }
  };

  const handleCopyOneNumber = async (rec: PhoneNumberRecord) => {
    const ok = await copyTextToClipboard(rec.e164);
    if (ok) {
      setCopiedNumberId(rec.id);
      setTimeout(() => {
        setCopiedNumberId((prev) => (prev === rec.id ? null : prev));
      }, 1500);
    }
  };

  const handleCopyCurrentPageNames = async () => {
    if (paginatedRecords.length === 0) return;
    const text = paginatedRecords.map((r) => formatDirectoryFullName(r.ownerName)).join('\n');
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedPageNames(true);
      setTimeout(() => setCopiedPageNames(false), 1800);
    }
  };

  const handleCopyCurrentPageNumbers = async () => {
    if (paginatedRecords.length === 0) return;
    const text = paginatedRecords.map((r) => r.e164).join('\n');
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedPageNumbers(true);
      setTimeout(() => setCopiedPageNumbers(false), 1800);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-5">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
        {/* Live Public Registry Harvester Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-xl">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">
              Live Web &amp; Worldwide Phone Harvester
            </h1>
            <p className="text-xs text-slate-600">
              Pull live phone numbers and individual owner names from public directories and websites into your worldwide directory (500 per page).
            </p>
          </div>

          <button
            type="button"
            onClick={executeTurboUsaWave}
            disabled={isTurboRunning}
            className="h-9 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>
              {isTurboRunning ? 'Harvesting USA Wave...' : 'USA Multi-State Fetch (+1,000+)'}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
            Targeted Public Registry Search or Webpage Scanner
          </h2>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('directory')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'directory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              People &amp; Countries
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'url'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scan Website URL
            </button>
          </div>
        </div>

        {mode === 'directory' ? (
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-medium text-slate-500 shrink-0">
                Regions:
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
                  className="px-2.5 py-1 text-xs text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-800 border border-slate-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 items-end"
            >
              <div className="space-y-1">
                <label htmlFor="web-first" className="block text-[11px] font-medium text-slate-700">
                  First Name
                </label>
                <input
                  id="web-first"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Michael"
                  className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-last" className="block text-[11px] font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  id="web-last"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-state" className="block text-[11px] font-medium text-slate-700">
                  State / Code
                </label>
                <input
                  id="web-state"
                  type="text"
                  maxLength={3}
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                  placeholder="CA, TX..."
                  className="w-full h-8.5 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-city" className="block text-[11px] font-medium text-slate-700">
                  City
                </label>
                <input
                  id="web-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Houston"
                  className="w-full h-8.5 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-zip" className="block text-[11px] font-medium text-slate-700">
                  Zip / Postal
                </label>
                <input
                  id="web-zip"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="90210"
                  className="w-full h-8.5 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="web-country" className="block text-[11px] font-medium text-slate-700">
                  Country
                </label>
                <select
                  id="web-country"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full h-8.5 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  {GLOBAL_COUNTRY_OPTIONS.map((c) => (
                    <option key={c.iso2} value={c.iso2}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="col-span-2 sm:col-span-1 h-8.5 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Fetching...' : 'Get Numbers'}</span>
              </button>
            </form>
          </div>
        ) : (
          <form
            onSubmit={executeUrlCrawl}
            className="bg-white border border-slate-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-end gap-2.5">
              <div className="flex-1 space-y-1">
                <label htmlFor="crawl-url-input" className="block text-xs font-medium text-slate-700">
                  Public Website Address (URL)
                </label>
                <input
                  id="crawl-url-input"
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://www.whitehouse.gov/contact/ or any public contact page"
                  className="w-full h-9 px-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="w-full sm:w-48 space-y-1">
                <label htmlFor="crawl-country" className="block text-xs font-medium text-slate-700">
                  Default Country
                </label>
                <select
                  id="crawl-country"
                  value={urlCountry}
                  onChange={(e) => setUrlCountry(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  {GLOBAL_COUNTRY_OPTIONS.map((c) => (
                    <option key={c.iso2} value={c.iso2}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-9 px-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Scanning...' : 'Scan Webpage'}</span>
              </button>
            </div>
          </form>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-white border border-red-200 rounded-lg text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {(lastSummary || harvestedRecords.length > 0) && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3.5 sm:px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-700">
                <Globe className="w-3.5 h-3.5 text-sky-700 inline mr-1.5 -mt-0.5" />
                {lastSummary && (
                  <>
                    Fetched{' '}
                    <span className="font-semibold text-slate-900">
                      {lastSummary.fetchedCount.toLocaleString()}
                    </span>{' '}
                    ({lastSummary.newlyAddedCount.toLocaleString()} new) ·{' '}
                  </>
                )}
                Session:{' '}
                <span className="font-semibold text-slate-900">
                  {harvestedRecords.length.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {paginatedRecords.length > 0 && (
                  <>
                    {/* Small Icon-Only: Bulk Copy Page Names */}
                    <button
                      type="button"
                      onClick={handleCopyCurrentPageNames}
                      className={`h-7 px-2 inline-flex items-center justify-center gap-1 rounded border transition-colors cursor-pointer ${
                        copiedPageNames
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                      title={`Copy all ${paginatedRecords.length.toLocaleString()} full names on this page`}
                      aria-label={`Copy all ${paginatedRecords.length} full names on this page`}
                    >
                      <User className="w-3.5 h-3.5" />
                      {copiedPageNames ? (
                        <Check className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500" />
                      )}
                    </button>

                    {/* Small Icon-Only: Bulk Copy Page Numbers */}
                    <button
                      type="button"
                      onClick={handleCopyCurrentPageNumbers}
                      className={`h-7 px-2 inline-flex items-center justify-center gap-1 rounded border transition-colors cursor-pointer ${
                        copiedPageNumbers
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-900'
                      }`}
                      title={`Copy all ${paginatedRecords.length.toLocaleString()} phone numbers on this page`}
                      aria-label={`Copy all ${paginatedRecords.length} phone numbers on this page`}
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-700" />
                      {copiedPageNumbers ? (
                        <Check className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Copy className="w-3 h-3 text-sky-700" />
                      )}
                    </button>
                  </>
                )}

                {harvestedRecords.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setHarvestedRecords([]);
                      setLastSummary(null);
                      setCurrentPage(1);
                    }}
                    className="h-7 w-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors cursor-pointer"
                    title="Clear session view (numbers stay saved in your Directory)"
                    aria-label="Clear session view"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {harvestedRecords.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No public phone numbers matched that exact web query. Click USA Multi-State Fetch above or choose another region.
              </div>
            ) : (
              <>
                {/* Mobile 2-Line Compact List (< md) */}
                <div className="md:hidden divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {paginatedRecords.map((rec) => {
                    const cleanName = formatDirectoryFullName(rec.ownerName);
                    const isNameCopied = copiedNameId === rec.id;
                    const isNumCopied = copiedNumberId === rec.id;
                    return (
                      <div key={rec.id} className="px-3 py-2.5 space-y-1 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-semibold text-slate-900 break-words">
                              {cleanName}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyOneName(rec)}
                              title={`Copy ${cleanName}`}
                              aria-label={`Copy ${cleanName}`}
                              className={`w-6 h-6 inline-flex items-center justify-center rounded border shrink-0 cursor-pointer ${
                                isNameCopied
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-500'
                              }`}
                            >
                              {isNameCopied ? (
                                <Check className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenContactFinder(rec.e164)}
                            title="Open Contact Finder dossier"
                            aria-label="Open Contact Finder dossier"
                            className="w-6 h-6 inline-flex items-center justify-center text-sky-800 bg-sky-50 border border-sky-200 rounded shrink-0 cursor-pointer"
                          >
                            <FileSearch className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono tabular-nums font-medium text-slate-800">
                              {rec.internationalFormat}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyOneNumber(rec)}
                              title={`Copy ${rec.e164}`}
                              aria-label={`Copy ${rec.e164}`}
                              className={`w-6 h-6 inline-flex items-center justify-center rounded border shrink-0 cursor-pointer ${
                                isNumCopied
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-500'
                              }`}
                            >
                              {isNumCopied ? (
                                <Check className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[11px] text-slate-500 truncate">
                            {rec.carrierGroup} · {[rec.city, rec.regionCode, rec.countryIso2].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table (md:+) */}
                <div className="hidden md:block overflow-x-auto max-h-[520px]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Full Owner Name</th>
                        <th className="py-2.5 px-4 font-semibold">Phone Number</th>
                        <th className="py-2.5 px-4 font-semibold">Carrier &amp; Type</th>
                        <th className="py-2.5 px-4 font-semibold">Location</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Info</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRecords.map((rec) => {
                        const cleanName = formatDirectoryFullName(rec.ownerName);
                        const isNameCopied = copiedNameId === rec.id;
                        const isNumCopied = copiedNumberId === rec.id;
                        return (
                          <tr key={rec.id} className="hover:bg-slate-50">
                            <td className="py-2 px-4">
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopyOneName(rec)}
                                  title={cleanName}
                                  className="font-semibold text-slate-900 hover:text-sky-700 text-left cursor-pointer"
                                >
                                  {cleanName}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyOneName(rec)}
                                  title={`Copy ${cleanName}`}
                                  aria-label={`Copy ${cleanName}`}
                                  className={`w-6 h-6 inline-flex items-center justify-center rounded border transition-colors shrink-0 cursor-pointer ${
                                    isNameCopied
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-800 border-slate-200'
                                  }`}
                                >
                                  {isNameCopied ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleCopyOneNumber(rec)}
                                  title={rec.e164}
                                  className="font-mono tabular-nums font-medium text-slate-900 hover:text-sky-700 cursor-pointer"
                                >
                                  {rec.internationalFormat}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyOneNumber(rec)}
                                  title={`Copy ${rec.e164}`}
                                  aria-label={`Copy ${rec.e164}`}
                                  className={`w-6 h-6 inline-flex items-center justify-center rounded border transition-colors shrink-0 cursor-pointer ${
                                    isNumCopied
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-800 border-slate-200'
                                  }`}
                                >
                                  {isNumCopied ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-4 text-slate-700">
                              {rec.carrierGroup} · {rec.lineType}
                            </td>
                            <td className="py-2 px-4 text-slate-600">
                              {[rec.city, rec.regionCode, rec.postalCode, rec.countryName]
                                .filter(Boolean)
                                .join(' · ')}
                            </td>
                            <td className="py-2 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => onOpenContactFinder(rec.e164)}
                                title="Open Contact Finder dossier"
                                aria-label="Open Contact Finder dossier"
                                className="w-7 h-7 inline-flex items-center justify-center text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors cursor-pointer"
                              >
                                <FileSearch className="w-3.5 h-3.5" />
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
