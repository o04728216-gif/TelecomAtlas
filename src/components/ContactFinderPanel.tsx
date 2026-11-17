import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileSearch,
  Globe,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import type {
  ContactFinderReport,
  ParsedNumberIntelligence,
  PhoneNumberRecord,
  PhoneQueryResponse,
} from '../shared/types.ts';
import { copyTextToClipboard } from '../utils/clipboard.ts';
import { PaginationBar } from './PaginationBar.tsx';

interface ContactFinderPanelProps {
  initialPhone?: string | null;
  onClearInitialPhone?: () => void;
  onNewRecordsDiscovered?: () => void;
}

type FinderSubMode = 'phone' | 'people' | 'batch';

const PEOPLE_PAGE_SIZE = 500;
const ASSOCIATES_PAGE_SIZE = 10;
const MENTIONS_PAGE_SIZE = 10;
const BATCH_PAGE_SIZE = 50;

export const ContactFinderPanel: React.FC<ContactFinderPanelProps> = ({
  initialPhone,
  onClearInitialPhone,
  onNewRecordsDiscovered,
}) => {
  const [subMode, setSubMode] = useState<FinderSubMode>('phone');

  // Reverse Phone Lookup State
  const [phoneInput, setPhoneInput] = useState('');
  const [defaultCountry, setDefaultCountry] = useState('US');
  const [isLookingUpPhone, setIsLookingUpPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [report, setReport] = useState<ContactFinderReport | null>(null);
  const [sampleRealRecords, setSampleRealRecords] = useState<PhoneNumberRecord[]>([]);

  // Pagination inside Dossier
  const [associatesPage, setAssociatesPage] = useState(1);
  const [mentionsPage, setMentionsPage] = useState(1);

  // People & Location Finder State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [peopleCountry, setPeopleCountry] = useState('US');
  const [isSearchingPeople, setIsSearchingPeople] = useState(false);
  const [peopleError, setPeopleError] = useState<string | null>(null);
  const [peopleResults, setPeopleResults] = useState<PhoneNumberRecord[]>([]);
  const [peopleDurationMs, setPeopleDurationMs] = useState<number | null>(null);
  const [hasSearchedPeople, setHasSearchedPeople] = useState(false);
  const [peoplePage, setPeoplePage] = useState(1);

  // Batch Existence Check State
  const [batchText, setBatchText] = useState('');
  const [batchCountry, setBatchCountry] = useState('US');
  const [isCheckingBatch, setIsCheckingBatch] = useState(false);
  const [batchResults, setBatchResults] = useState<ParsedNumberIntelligence[]>([]);
  const [batchPage, setBatchPage] = useState(1);

  // Clipboard feedback state
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const triggerCopy = async (token: string, value: string) => {
    if (!value) return;
    const ok = await copyTextToClipboard(value);
    if (ok) {
      setCopiedToken(token);
      setTimeout(() => {
        setCopiedToken((prev) => (prev === token ? null : prev));
      }, 1600);
    }
  };

  // Load 6 real verified numbers from local store so users can test with 1 click
  useEffect(() => {
    fetch('/api/numbers?limit=6&offset=0')
      .then((r) => r.json())
      .then((data: PhoneQueryResponse) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          setSampleRealRecords(data.items.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  const runPhoneLookup = useCallback(
    async (targetNumber: string, countryHint?: string) => {
      const trimmed = targetNumber.trim();
      if (!trimmed) return;
      setSubMode('phone');
      setPhoneInput(trimmed);
      setIsLookingUpPhone(true);
      setPhoneError(null);
      setAssociatesPage(1);
      setMentionsPage(1);

      try {
        const res = await fetch('/api/contact-finder/phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: trimmed,
            defaultCountry: countryHint ?? defaultCountry,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setPhoneError(data.error || 'Could not look up that phone number.');
        } else {
          setReport(data as ContactFinderReport);
          onNewRecordsDiscovered?.();
        }
      } catch {
        setPhoneError('Network error while running public contact lookup.');
      } finally {
        setIsLookingUpPhone(false);
      }
    },
    [defaultCountry, onNewRecordsDiscovered]
  );

  // Automatically look up initialPhone when navigated from Directory or Inspector
  useEffect(() => {
    if (initialPhone && initialPhone.trim()) {
      runPhoneLookup(initialPhone.trim());
      onClearInitialPhone?.();
    }
  }, [initialPhone, onClearInitialPhone, runPhoneLookup]);

  const handlePeopleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingPeople(true);
    setPeopleError(null);
    setHasSearchedPeople(true);
    setPeoplePage(1);

    try {
      const res = await fetch('/api/contact-finder/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          city: city.trim() || undefined,
          state: stateCode.trim() || undefined,
          postalCode: postalCode.trim() || undefined,
          countryCode: peopleCountry,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPeopleError(data.error || 'Could not search public contact records.');
      } else {
        setPeopleResults(Array.isArray(data.items) ? data.items : []);
        setPeopleDurationMs(typeof data.durationMs === 'number' ? data.durationMs : null);
        onNewRecordsDiscovered?.();
      }
    } catch {
      setPeopleError('Network error while searching public contact records.');
    } finally {
      setIsSearchingPeople(false);
    }
  };

  const handleBatchVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = batchText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    setIsCheckingBatch(true);
    setBatchPage(1);
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumbers: lines.slice(0, 500),
          defaultCountry: batchCountry,
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.results)) {
        setBatchResults(data.results as ParsedNumberIntelligence[]);
      }
    } catch {
      // Ignore transient failure
    } finally {
      setIsCheckingBatch(false);
    }
  };

  // Paginated slices
  const paginatedAssociates = useMemo(() => {
    if (!report) return [];
    const start = (associatesPage - 1) * ASSOCIATES_PAGE_SIZE;
    return report.associates.slice(start, start + ASSOCIATES_PAGE_SIZE);
  }, [report, associatesPage]);

  const paginatedMentions = useMemo(() => {
    if (!report) return [];
    const start = (mentionsPage - 1) * MENTIONS_PAGE_SIZE;
    return report.webMentions.slice(start, start + MENTIONS_PAGE_SIZE);
  }, [report, mentionsPage]);

  const paginatedPeople = useMemo(() => {
    const start = (peoplePage - 1) * PEOPLE_PAGE_SIZE;
    return peopleResults.slice(start, start + PEOPLE_PAGE_SIZE);
  }, [peopleResults, peoplePage]);

  const paginatedBatch = useMemo(() => {
    const start = (batchPage - 1) * BATCH_PAGE_SIZE;
    return batchResults.slice(start, start + BATCH_PAGE_SIZE);
  }, [batchResults, batchPage]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Session Header & Mode Switcher */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h1 className="text-xl font-semibold text-slate-900">
              Public Contact Finder &amp; Reverse Phone Lookup
            </h1>
            <p className="text-xs text-slate-600">
              Search any phone number or person to view owner identity, street &amp; mailing addresses, carrier network, associated numbers, and public web mentions.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setSubMode('phone')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                subMode === 'phone'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reverse Phone Lookup
            </button>
            <button
              type="button"
              onClick={() => setSubMode('people')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                subMode === 'people'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Find by Name &amp; City
            </button>
            <button
              type="button"
              onClick={() => setSubMode('batch')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                subMode === 'batch'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verify Number List
            </button>
          </div>
        </div>

        {/* SUB-MODE 1: REVERSE PHONE LOOKUP DOSSIER */}
        {subMode === 'phone' && (
          <div className="space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runPhoneLookup(phoneInput, defaultCountry);
              }}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-4"
            >
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-64 space-y-1.5">
                  <label
                    htmlFor="finder-phone-input"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Enter Phone Number to Pull Public Information
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="finder-phone-input"
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="e.g. (310) 271-5800, +1 212-555-0199, +44 20 7946 0958..."
                      className="w-full h-11 pl-10 pr-4 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                    />
                  </div>
                </div>

                <div className="w-44 space-y-1.5">
                  <label
                    htmlFor="finder-country-select"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Default Country
                  </label>
                  <select
                    id="finder-country-select"
                    value={defaultCountry}
                    onChange={(e) => setDefaultCountry(e.target.value)}
                    className="w-full h-11 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="US">United States (+1)</option>
                    <option value="CA">Canada (+1)</option>
                    <option value="GB">United Kingdom (+44)</option>
                    <option value="AU">Australia (+61)</option>
                    <option value="DE">Germany (+49)</option>
                    <option value="FR">France (+33)</option>
                    <option value="ES">Spain (+34)</option>
                    <option value="IT">Italy (+39)</option>
                    <option value="IN">India (+91)</option>
                    <option value="JP">Japan (+81)</option>
                    <option value="MX">Mexico (+52)</option>
                    <option value="BR">Brazil (+55)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLookingUpPhone || !phoneInput.trim()}
                  className="h-11 px-6 inline-flex items-center gap-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{isLookingUpPhone ? 'Searching Public Records...' : 'Search Number'}</span>
                </button>
              </div>

              {sampleRealRecords.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-slate-500 mr-1">
                    Sample numbers:
                  </span>
                  {sampleRealRecords.map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => runPhoneLookup(rec.e164, rec.countryIso2)}
                      className="px-2.5 py-1 text-xs font-mono text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-900 border border-slate-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {rec.internationalFormat} · {rec.ownerName.split(' ').slice(0, 2).join(' ')}
                    </button>
                  ))}
                </div>
              )}
            </form>

            {phoneError && (
              <div className="p-4 bg-white border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                {phoneError}
              </div>
            )}

            {isLookingUpPhone && (
              <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-4 animate-pulse">
                <div className="h-5 w-64 bg-slate-200 rounded" />
                <div className="h-4 w-96 bg-slate-100 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="h-32 bg-slate-100 rounded-lg" />
                  <div className="h-32 bg-slate-100 rounded-lg" />
                </div>
              </div>
            )}

            {!isLookingUpPhone && report && (
              <div className="space-y-5">
                {/* 1. Existence & Verification Banner */}
                <div
                  className={`border rounded-lg p-4 flex flex-wrap items-start justify-between gap-4 ${
                    report.existenceStatus === 'CONFIRMED_PUBLIC_RECORD'
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : report.existenceStatus === 'VALID_ALLOCATED_EXCHANGE'
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                        : 'bg-rose-50/70 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-3 max-w-3xl">
                    {report.existenceStatus === 'CONFIRMED_PUBLIC_RECORD' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    ) : report.existenceStatus === 'VALID_ALLOCATED_EXCHANGE' ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">
                        {report.existenceStatus === 'INVALID_OR_UNASSIGNED'
                          ? 'Invalid or Unassigned Number'
                          : 'Active Phone Number · Contact Profile Found'}
                      </div>
                      <p className="text-xs opacity-90">{report.existenceSummary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {report.intel.e164 && (
                      <button
                        type="button"
                        onClick={() => triggerCopy('hero-phone', report.intel.e164!)}
                        className="h-9 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {copiedToken === 'hero-phone' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Copied {report.intel.e164}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-sky-700" />
                            <span>Copy {report.intel.internationalFormat ?? report.intel.e164}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Top Two-Column Dossier: Individual Identity + Line & Carrier Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left Card: Owner / Public Identity */}
                  <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-700" />
                        <h2 className="text-sm font-semibold text-slate-900">
                          Public Owner &amp; Identity Profile
                        </h2>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {report.lookupDurationMs} ms
                      </span>
                    </div>

                    {report.primaryOwner ? (
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="text-lg font-semibold text-slate-900">
                            {report.primaryOwner.name}
                          </div>
                          {report.primaryOwner.title && (
                            <div className="text-xs font-medium text-sky-800 mt-0.5">
                              {report.primaryOwner.title}
                            </div>
                          )}
                        </div>

                        <dl className="divide-y divide-slate-100 border-t border-b border-slate-200">
                          {report.primaryOwner.organization && (
                            <div className="py-2 flex items-center justify-between gap-3">
                              <dt className="text-slate-500 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                Organization
                              </dt>
                              <dd className="font-medium text-slate-900 text-right">
                                {report.primaryOwner.organization}
                              </dd>
                            </div>
                          )}
                          {report.primaryOwner.category && (
                            <div className="py-2 flex items-center justify-between gap-3">
                              <dt className="text-slate-500">Classification / Specialty</dt>
                              <dd className="text-slate-900 text-right">
                                {report.primaryOwner.category}
                              </dd>
                            </div>
                          )}
                          {report.primaryOwner.registryId && (
                            <div className="py-2 flex items-center justify-between gap-3">
                              <dt className="text-slate-500">Public Registry ID</dt>
                              <dd className="font-mono text-slate-900">
                                {report.primaryOwner.registryId}
                              </dd>
                            </div>
                          )}
                          <div className="py-2 flex items-center justify-between gap-3">
                            <dt className="text-slate-500">Directory Source</dt>
                            <dd className="text-slate-800 text-right">
                              {report.primaryOwner.verificationSource}
                            </dd>
                          </div>
                          {report.primaryOwner.lastUpdated && (
                            <div className="py-2 flex items-center justify-between gap-3">
                              <dt className="text-slate-500">Record Date</dt>
                              <dd className="font-mono text-slate-600">
                                {report.primaryOwner.lastUpdated.slice(0, 10)}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    ) : (
                      <div className="py-6 text-xs text-slate-600 space-y-2">
                        <p className="font-medium text-slate-800">
                          No subscriber profile available for this input.
                        </p>
                        <p>
                          Enter a valid national or international phone number to view subscriber details, carrier network, and public web mentions.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Card: Telecom Carrier, Line Classification & Associated Numbers */}
                  <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-sky-700" />
                        <h2 className="text-sm font-semibold text-slate-900">
                          Carrier Network &amp; Associated Lines
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-slate-600">
                        {report.intel.e164 ?? report.queryPhone}
                      </span>
                    </div>

                    <dl className="divide-y divide-slate-100 border-t border-b border-slate-200 text-xs">
                      <div className="py-2 flex items-center justify-between gap-3">
                        <dt className="text-slate-500">International / Local</dt>
                        <dd className="font-mono font-semibold text-slate-900">
                          {report.intel.internationalFormat ?? '—'} ·{' '}
                          {report.intel.nationalFormat ?? '—'}
                        </dd>
                      </div>
                      <div className="py-2 flex items-center justify-between gap-3">
                        <dt className="text-slate-500">Phone Company (Carrier)</dt>
                        <dd className="font-semibold text-slate-900 text-right">
                          {report.intel.carrierName}
                        </dd>
                      </div>
                      <div className="py-2 flex items-center justify-between gap-3">
                        <dt className="text-slate-500">Line Type</dt>
                        <dd className="font-medium text-slate-900">{report.intel.lineType}</dd>
                      </div>
                      <div className="py-2 flex items-center justify-between gap-3">
                        <dt className="text-slate-500">Area / Exchange Prefix</dt>
                        <dd className="font-mono text-slate-900">
                          {report.intel.callingCode ? `+${report.intel.callingCode}` : ''}{' '}
                          {report.intel.ndcPrefix ?? '—'}
                        </dd>
                      </div>
                      <div className="py-2 flex items-center justify-between gap-3">
                        <dt className="text-slate-500">Country &amp; Regulator</dt>
                        <dd className="text-slate-800 text-right">
                          {report.intel.countryName ?? 'Unknown'}
                          {report.intel.regulatoryAuthority
                            ? ` (${report.intel.regulatoryAuthority})`
                            : ''}
                        </dd>
                      </div>
                    </dl>

                    {report.associatedPhones.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="text-xs font-semibold text-slate-700">
                          Known Phone Numbers on File ({report.associatedPhones.length})
                        </div>
                        <div className="space-y-1.5">
                          {report.associatedPhones.map((ph) => {
                            const tok = `assoc-ph-${ph.e164}`;
                            return (
                              <div
                                key={ph.e164}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="min-w-0">
                                  <button
                                    type="button"
                                    onClick={() => runPhoneLookup(ph.e164)}
                                    className="font-mono font-semibold text-slate-900 hover:text-sky-700 cursor-pointer"
                                  >
                                    {ph.display}
                                  </button>
                                  <span className="text-slate-500 ml-2">
                                    {ph.label} · {ph.carrier} · {ph.lineType}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => triggerCopy(tok, ph.e164)}
                                  className="h-7 px-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-sky-50 border border-slate-200 rounded transition-colors shrink-0 cursor-pointer"
                                >
                                  {copiedToken === tok ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-700" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Known Public Addresses */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <MapPin className="w-4 h-4 text-sky-700" />
                    <h2 className="text-sm font-semibold text-slate-900">
                      Known Public Addresses &amp; Geographic Exchange ({report.addresses.length})
                    </h2>
                  </div>

                  {report.addresses.length === 0 ? (
                    <div className="text-xs text-slate-500 py-2">
                      No street or rate-center address on record for this number.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {report.addresses.map((addr, idx) => {
                        const formattedAddr = [
                          addr.street,
                          [addr.city, addr.state, addr.postalCode].filter(Boolean).join(', '),
                          addr.country,
                        ]
                          .filter(Boolean)
                          .join(' · ');
                        const tok = `addr-${idx}`;
                        return (
                          <div
                            key={idx}
                            className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="font-semibold text-slate-800">{addr.label}</div>
                              {addr.street && (
                                <div className="text-slate-900 font-medium">{addr.street}</div>
                              )}
                              <div className="text-slate-600">
                                {[addr.city, addr.state, addr.postalCode]
                                  .filter(Boolean)
                                  .join(', ')}{' '}
                                {addr.country ? `· ${addr.country}` : ''}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => triggerCopy(tok, formattedAddr)}
                              className="h-7 px-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors shrink-0 cursor-pointer"
                            >
                              {copiedToken === tok ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Co-Located Contacts & Possible Associates (Paginated) */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-700" />
                      <h2 className="text-sm font-semibold text-slate-900">
                        Associated Contacts, Same-Address &amp; Same-Surname Records (
                        {report.associates.length})
                      </h2>
                    </div>

                    {paginatedAssociates.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          triggerCopy(
                            'copy-assoc-page',
                            paginatedAssociates.map((a) => a.record.e164).join('\n')
                          )
                        }
                        className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {copiedToken === 'copy-assoc-page' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Copied Page ({paginatedAssociates.length})!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-sky-700" />
                            <span>Copy Page ({paginatedAssociates.length})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {report.associates.length === 0 ? (
                    <div className="p-6 text-xs text-slate-500">
                      No co-located or same-surname public contacts found in this local exchange yet.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                            <tr>
                              <th className="py-2.5 px-4 font-semibold">Name</th>
                              <th className="py-2.5 px-4 font-semibold">Connection</th>
                              <th className="py-2.5 px-4 font-semibold">Phone Number</th>
                              <th className="py-2.5 px-4 font-semibold">Address / City</th>
                              <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {paginatedAssociates.map(({ record: rec, relationship }) => {
                              const tok = `assoc-row-${rec.id}`;
                              return (
                                <tr key={rec.id} className="hover:bg-slate-50">
                                  <td className="py-2.5 px-4 font-semibold text-slate-900">
                                    {rec.ownerName}
                                  </td>
                                  <td className="py-2.5 px-4 text-sky-800 font-medium">
                                    {relationship}
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono tabular-nums font-medium text-slate-900">
                                        {rec.internationalFormat}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => triggerCopy(tok, rec.e164)}
                                        className="h-6 px-2 inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded cursor-pointer"
                                      >
                                        {copiedToken === tok ? (
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
                                  <td className="py-2.5 px-4 text-slate-600">
                                    {[rec.streetAddress, rec.city, rec.regionCode, rec.postalCode]
                                      .filter(Boolean)
                                      .join(', ')}
                                  </td>
                                  <td className="py-2.5 px-4 text-right">
                                    <button
                                      type="button"
                                      onClick={() => runPhoneLookup(rec.e164, rec.countryIso2)}
                                      className="px-2.5 py-1 text-xs font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                      View Report
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <PaginationBar
                        totalItems={report.associates.length}
                        pageSize={ASSOCIATES_PAGE_SIZE}
                        currentPage={associatesPage}
                        onPageChange={setAssociatesPage}
                        itemLabel="associated contacts"
                      />
                    </>
                  )}
                </div>

                {/* 5. Live Public Web Mentions (Paginated) */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-200 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-700" />
                    <h2 className="text-sm font-semibold text-slate-900">
                      Live Public Web Mentions ({report.webMentions.length})
                    </h2>
                  </div>

                  {report.webMentions.length === 0 ? (
                    <div className="p-6 text-xs text-slate-500">
                      No indexed public web pages explicitly published this exact phone number string.
                    </div>
                  ) : (
                    <>
                      <div className="divide-y divide-slate-100">
                        {paginatedMentions.map((m, idx) => (
                          <div key={`${m.url}-${idx}`} className="p-4 space-y-1 text-xs">
                            <div className="flex items-center justify-between gap-3">
                              <a
                                href={m.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-sky-800 hover:text-sky-950 hover:underline inline-flex items-center gap-1.5"
                              >
                                <span>{m.title}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                              <span className="font-mono text-[11px] text-slate-400 shrink-0">
                                {m.domain}
                              </span>
                            </div>
                            {m.snippet && (
                              <p className="text-slate-600 leading-relaxed">{m.snippet}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      <PaginationBar
                        totalItems={report.webMentions.length}
                        pageSize={MENTIONS_PAGE_SIZE}
                        currentPage={mentionsPage}
                        onPageChange={setMentionsPage}
                        itemLabel="web mentions"
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-MODE 2: PEOPLE & LOCATION PUBLIC CONTACT FINDER (500 PER PAGE) */}
        {subMode === 'people' && (
          <div className="space-y-5">
            <form
              onSubmit={handlePeopleSearch}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                <div className="space-y-1">
                  <label htmlFor="pf-first" className="block text-xs font-medium text-slate-700">
                    First Name
                  </label>
                  <input
                    id="pf-first"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Robert"
                    className="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-last" className="block text-xs font-medium text-slate-700">
                    Last Name or Business
                  </label>
                  <input
                    id="pf-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Johnson"
                    className="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-city" className="block text-xs font-medium text-slate-700">
                    City
                  </label>
                  <input
                    id="pf-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dallas"
                    className="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-state" className="block text-xs font-medium text-slate-700">
                    State (2-Letter)
                  </label>
                  <input
                    id="pf-state"
                    type="text"
                    maxLength={2}
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                    placeholder="TX, CA, NY..."
                    className="w-full h-9 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-zip" className="block text-xs font-medium text-slate-700">
                    Zip / Postal Code
                  </label>
                  <input
                    id="pf-zip"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 90210"
                    className="w-full h-9 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-country" className="block text-xs font-medium text-slate-700">
                    Country
                  </label>
                  <select
                    id="pf-country"
                    value={peopleCountry}
                    onChange={(e) => setPeopleCountry(e.target.value)}
                    className="w-full h-9 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="IN">India</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-xs text-slate-500">
                  Searches public registries and your worldwide directory. Click any result to open its full Contact Finder dossier.
                </span>
                <button
                  type="submit"
                  disabled={isSearchingPeople}
                  className="h-9 px-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearchingPeople ? 'Searching People...' : 'Find Public Contacts'}</span>
                </button>
              </div>
            </form>

            {peopleError && (
              <div className="p-4 bg-white border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                {peopleError}
              </div>
            )}

            {hasSearchedPeople && !isSearchingPeople && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-700">
                    Found{' '}
                    <span className="font-semibold text-slate-900">
                      {peopleResults.length.toLocaleString()}
                    </span>{' '}
                    matching contacts
                    {peopleDurationMs !== null ? ` in ${peopleDurationMs} ms` : ''}.
                  </div>

                  {paginatedPeople.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        triggerCopy(
                          'copy-people-page',
                          paginatedPeople.map((r) => r.e164).join('\n')
                        )
                      }
                      className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {copiedToken === 'copy-people-page' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Copied Page ({paginatedPeople.length})!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-sky-700" />
                          <span>Copy Page ({paginatedPeople.length})</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {peopleResults.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No public records matched those exact filters. Try broadening your name or state search.
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto max-h-[540px]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700">
                          <tr>
                            <th className="py-2.5 px-4 font-semibold">Person / Entity Name</th>
                            <th className="py-2.5 px-4 font-semibold">Phone Number</th>
                            <th className="py-2.5 px-4 font-semibold">Address &amp; Location</th>
                            <th className="py-2.5 px-4 font-semibold">Carrier</th>
                            <th className="py-2.5 px-4 font-semibold text-right">Dossier</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedPeople.map((rec) => {
                            const tok = `pf-row-${rec.id}`;
                            return (
                              <tr key={rec.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4">
                                  <div className="font-semibold text-slate-900">{rec.ownerName}</div>
                                  {rec.ownerTitle && (
                                    <div className="text-[11px] text-slate-500 truncate max-w-56">
                                      {rec.ownerTitle}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono tabular-nums font-medium text-slate-900">
                                      {rec.internationalFormat}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(tok, rec.e164)}
                                      className="h-6 px-2 inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded cursor-pointer"
                                    >
                                      {copiedToken === tok ? (
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
                                <td className="py-2.5 px-4 text-slate-600">
                                  {[rec.streetAddress, rec.city, rec.regionCode, rec.postalCode]
                                    .filter(Boolean)
                                    .join(', ')}
                                </td>
                                <td className="py-2.5 px-4 text-slate-700">
                                  {rec.carrierGroup} · {rec.lineType}
                                </td>
                                <td className="py-2.5 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => runPhoneLookup(rec.e164, rec.countryIso2)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                                  >
                                    <FileSearch className="w-3 h-3" />
                                    <span>Public Report</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <PaginationBar
                      totalItems={peopleResults.length}
                      pageSize={PEOPLE_PAGE_SIZE}
                      currentPage={peoplePage}
                      onPageChange={setPeoplePage}
                      itemLabel="public contacts"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* SUB-MODE 3: BATCH EXISTENCE & E.164 VERIFICATION (PAGINATED) */}
        {subMode === 'batch' && (
          <div className="space-y-5">
            <form
              onSubmit={handleBatchVerify}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Bulk Phone Existence &amp; Carrier Checker
                  </h2>
                  <p className="text-xs text-slate-500">
                    Paste up to 500 phone numbers (one per line) to verify ITU-T E.164 existence, carrier operator, and public owner match.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    aria-label="Default Country"
                    value={batchCountry}
                    onChange={(e) => setBatchCountry(e.target.value)}
                    className="h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900"
                  >
                    <option value="US">United States (+1)</option>
                    <option value="CA">Canada (+1)</option>
                    <option value="GB">United Kingdom (+44)</option>
                    <option value="DE">Germany (+49)</option>
                    <option value="AU">Australia (+61)</option>
                  </select>

                  {sampleRealRecords.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setBatchText(sampleRealRecords.map((r) => r.e164).join('\n'))
                      }
                      className="h-9 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      Load Sample
                    </button>
                  )}
                </div>
              </div>

              <textarea
                rows={6}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="Paste phone numbers here, one per line..."
                className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCheckingBatch || !batchText.trim()}
                  className="h-9 px-5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCheckingBatch ? 'Verifying Numbers...' : 'Verify Numbers'}
                </button>
              </div>
            </form>

            {batchResults.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-700">
                    Checked{' '}
                    <span className="font-semibold text-slate-900">{batchResults.length}</span>{' '}
                    numbers ·{' '}
                    <span className="font-semibold text-emerald-700">
                      {batchResults.filter((r) => r.isValidE164).length} valid existing lines
                    </span>
                  </div>

                  {paginatedBatch.some((r) => r.isValidE164 && r.e164) && (
                    <button
                      type="button"
                      onClick={() =>
                        triggerCopy(
                          'copy-batch-page',
                          paginatedBatch
                            .filter((r) => r.isValidE164 && r.e164)
                            .map((r) => r.e164!)
                            .join('\n')
                        )
                      }
                      className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {copiedToken === 'copy-batch-page' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Copied Valid on Page!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-sky-700" />
                          <span>Copy Valid on Page</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Input / E.164</th>
                        <th className="py-2.5 px-4 font-semibold">Existence</th>
                        <th className="py-2.5 px-4 font-semibold">Public Owner</th>
                        <th className="py-2.5 px-4 font-semibold">Carrier &amp; Line</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Dossier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedBatch.map((item, idx) => (
                        <tr key={`${item.rawInput}-${idx}`} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                            {item.internationalFormat ?? item.rawInput}
                          </td>
                          <td className="py-2.5 px-4">
                            {item.isValidE164 ? (
                              <span className="font-semibold text-emerald-700">Valid Line</span>
                            ) : (
                              <span className="font-semibold text-rose-700">Invalid</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-slate-800">
                            {item.ownerName ?? 'Open Report'}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">
                            {item.carrierGroup} · {item.lineType}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            {item.e164 && (
                              <button
                                type="button"
                                onClick={() =>
                                  runPhoneLookup(item.e164!, item.countryIso2 ?? undefined)
                                }
                                className="px-2.5 py-1 text-xs font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors cursor-pointer"
                              >
                                Full Report
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <PaginationBar
                  totalItems={batchResults.length}
                  pageSize={BATCH_PAGE_SIZE}
                  currentPage={batchPage}
                  onPageChange={setBatchPage}
                  itemLabel="checked numbers"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
