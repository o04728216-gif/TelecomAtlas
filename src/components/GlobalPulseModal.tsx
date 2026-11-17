import React, { useCallback, useEffect, useState } from 'react';
import {
  Check,
  Clock,
  Compass,
  Copy,
  FileSearch,
  Globe,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import type {
  HierarchyFacetSummary,
  ParsedNumberIntelligence,
  PhoneNumberRecord,
} from '../shared/types.ts';
import { copyTextToClipboard } from '../utils/clipboard.ts';
import {
  formatCompactNumber,
  getLiveTimeInTimezone,
  parseSubscriberDisplayName,
} from '../utils/formatters.ts';

interface GlobalPulseModalProps {
  isOpen: boolean;
  facets: HierarchyFacetSummary | null;
  onClose: () => void;
  onJumpToCountry: (continentCode: string, countryIso2: string) => void;
  onOpenContactFinder: (e164: string) => void;
}

const CONTINENT_TABS = [
  { code: 'ALL', label: 'All World' },
  { code: 'NA', label: 'N. America' },
  { code: 'EU', label: 'Europe' },
  { code: 'AS', label: 'Asia & ME' },
  { code: 'SA', label: 'S. America' },
  { code: 'AF', label: 'Africa' },
  { code: 'OC', label: 'Oceania' },
];

export const GlobalPulseModal: React.FC<GlobalPulseModalProps> = ({
  isOpen,
  facets,
  onClose,
  onJumpToCountry,
  onOpenContactFinder,
}) => {
  const [decodeInput, setDecodeInput] = useState('');
  const [decodedIntel, setDecodedIntel] = useState<ParsedNumberIntelligence | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);

  const [spotlightRecord, setSpotlightRecord] = useState<PhoneNumberRecord | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState('ALL');
  const [countrySearch, setCountrySearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const triggerCopy = async (key: string, value: string) => {
    if (!value) return;
    const ok = await copyTextToClipboard(value);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1500);
    }
  };

  const spinRandomGlobalLine = useCallback(async (continentFilter?: string) => {
    setIsSpinning(true);
    try {
      const qs =
        continentFilter && continentFilter !== 'ALL'
          ? `?continent=${encodeURIComponent(continentFilter)}`
          : '';
      const res = await fetch(`/api/random-line${qs}`);
      if (res.ok) {
        const data = (await res.json()) as { record: PhoneNumberRecord };
        if (data.record) {
          setSpotlightRecord(data.record);
        }
      }
    } catch {
      // Ignore transient error
    } finally {
      setIsSpinning(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !spotlightRecord) {
      spinRandomGlobalLine();
    }
  }, [isOpen, spotlightRecord, spinRandomGlobalLine]);

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Live instant number decoder as user types
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = decodeInput.trim();
    if (!trimmed) {
      setDecodedIntel(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsDecoding(true);
      try {
        const res = await fetch('/api/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: trimmed }),
        });
        if (res.ok) {
          const parsed = (await res.json()) as ParsedNumberIntelligence;
          setDecodedIntel(parsed);
        }
      } catch {
        // Ignore transient parse error
      } finally {
        setIsDecoding(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [decodeInput, isOpen]);

  if (!isOpen) {
    return null;
  }

  const allCountries = facets?.countries ?? [];
  const filteredCountries = allCountries.filter((c) => {
    if (selectedContinent !== 'ALL' && c.continentCode !== selectedContinent) {
      return false;
    }
    if (countrySearch.trim()) {
      const q = countrySearch.trim().toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q) ||
        `+${c.callingCode}`.includes(q)
      );
    }
    return true;
  });

  const spotlightTimezone =
    facets?.regions.find((r) => r.id === spotlightRecord?.regionId)?.timezone ?? null;
  const spotlightLiveTime = getLiveTimeInTimezone(spotlightTimezone);
  const spotlightParsedName = spotlightRecord
    ? parseSubscriberDisplayName(spotlightRecord.ownerName)
    : null;

  const decodedRegionTimezone =
    decodedIntel?.countryIso2 && decodedIntel?.regionCode
      ? facets?.regions.find(
          (r) => r.id === `${decodedIntel.countryIso2}-${decodedIntel.regionCode}`
        )?.timezone ?? null
      : null;
  const decodedLiveTime = getLiveTimeInTimezone(decodedRegionTimezone);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="World Telecom Radar and Instant Number Decoder"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/45 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92dvh] bg-white rounded-t-2xl sm:rounded-xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <Compass className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold tracking-tight truncate">
                World Telecom Radar &amp; Instant Decoder
              </h2>
              <p className="text-[11px] text-slate-300 truncate">
                {facets
                  ? `${formatCompactNumber(facets.totalRegistryRecords)}+ indexed lines across ${allCountries.length} countries + unlimited E.164 synthesis`
                  : 'Real-time ITU-T E.164 intelligence across all 6 continents'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close World Radar"
            className="w-7 h-7 inline-flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* 1. Instant Global Phone Number Decoder */}
          <section className="space-y-2">
            <label
              htmlFor="radar-instant-decode"
              className="block text-xs font-semibold text-slate-800"
            >
              Instant Global Number Decoder (Type any US or +International number)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="radar-instant-decode"
                type="text"
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Try +81 90-3100-4821, +41 79 410 22 10, +44 7700 900412, or 310-271-5800..."
                className="w-full h-10 pl-9 pr-8 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
              {decodeInput && (
                <button
                  type="button"
                  onClick={() => setDecodeInput('')}
                  aria-label="Clear number"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {decodedIntel && (
              <div
                className={`p-3 rounded-lg border text-xs space-y-2 ${
                  decodedIntel.isValidE164
                    ? 'bg-sky-50/60 border-sky-200 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {decodedIntel.isValidE164 && decodedIntel.e164 ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-slate-900 truncate">
                          {decodedIntel.ownerName ?? 'Allocated Subscriber Line'}
                        </span>
                        {decodedIntel.ownerName && (
                          <button
                            type="button"
                            onClick={() => triggerCopy('dec-name', decodedIntel.ownerName!)}
                            title={`Copy ${decodedIntel.ownerName}`}
                            aria-label={`Copy ${decodedIntel.ownerName}`}
                            className="w-6 h-6 inline-flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-sky-50 text-slate-600 hover:text-sky-800 transition-colors cursor-pointer shrink-0"
                          >
                            {copiedKey === 'dec-name' ? (
                              <Check className="w-3 h-3 text-emerald-700" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {decodedIntel.internationalFormat ?? decodedIntel.e164}
                        </span>
                        <button
                          type="button"
                          onClick={() => triggerCopy('dec-phone', decodedIntel.e164!)}
                          title={`Copy ${decodedIntel.e164}`}
                          aria-label={`Copy ${decodedIntel.e164}`}
                          className="w-6 h-6 inline-flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-sky-50 text-slate-600 hover:text-sky-800 transition-colors cursor-pointer shrink-0"
                        >
                          {copiedKey === 'dec-phone' ? (
                            <Check className="w-3 h-3 text-emerald-700" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onOpenContactFinder(decodedIntel.e164!);
                            onClose();
                          }}
                          className="h-6 px-2 inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded transition-colors cursor-pointer"
                        >
                          <FileSearch className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-600">
                      <span className="font-medium text-slate-800">
                        {decodedIntel.carrierName}
                      </span>
                      <span>·</span>
                      <span>{decodedIntel.lineType}</span>
                      <span>·</span>
                      <span>
                        {[decodedIntel.city, decodedIntel.regionName, decodedIntel.countryName]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                      {decodedLiveTime && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 font-mono text-sky-800">
                            <Clock className="w-3 h-3" />
                            {decodedLiveTime}
                          </span>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-600">
                    {isDecoding ? 'Decoding numbering plan...' : decodedIntel.validationReason}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 2. Live Global Exchange Spotlight */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Globe className="w-3.5 h-3.5 text-sky-700" />
                <span>Global Live Exchange Hop</span>
              </div>

              <button
                type="button"
                onClick={() => spinRandomGlobalLine(selectedContinent)}
                disabled={isSpinning}
                className="h-7 px-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-900 bg-white hover:bg-sky-50 border border-slate-300 rounded-md transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>Hop Global Line</span>
              </button>
            </div>

            {spotlightRecord && (
              <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 text-sm truncate">
                        {spotlightParsedName?.cleanFullName ?? spotlightRecord.ownerName}
                      </span>
                      <button
                        type="button"
                        onClick={() => triggerCopy('spot-name', spotlightRecord.ownerName)}
                        title={`Copy ${spotlightRecord.ownerName}`}
                        aria-label={`Copy ${spotlightRecord.ownerName}`}
                        className="w-6 h-6 inline-flex items-center justify-center rounded border border-slate-200 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-800 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedKey === 'spot-name' ? (
                          <Check className="w-3 h-3 text-emerald-700" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {[
                        spotlightRecord.streetAddress,
                        spotlightRecord.city,
                        spotlightRecord.regionName,
                        spotlightRecord.countryName,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {spotlightRecord.internationalFormat}
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerCopy('spot-phone', spotlightRecord.e164)}
                      title={`Copy ${spotlightRecord.e164}`}
                      aria-label={`Copy ${spotlightRecord.e164}`}
                      className="w-6 h-6 inline-flex items-center justify-center rounded border border-slate-200 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-800 transition-colors cursor-pointer"
                    >
                      {copiedKey === 'spot-phone' ? (
                        <Check className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
                    <span className="font-medium text-slate-800">
                      {spotlightRecord.carrierName}
                    </span>
                    <span>·</span>
                    <span>{spotlightRecord.lineType}</span>
                    {spotlightLiveTime && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 font-mono text-sky-800">
                          <Clock className="w-3 h-3" />
                          {spotlightLiveTime}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onJumpToCountry(
                          spotlightRecord.continentCode,
                          spotlightRecord.countryIso2
                        );
                        onClose();
                      }}
                      className="h-6 px-2 text-[11px] font-medium text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                    >
                      Browse {spotlightRecord.countryIso2}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenContactFinder(spotlightRecord.e164);
                        onClose();
                      }}
                      className="h-6 px-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded transition-colors cursor-pointer"
                    >
                      <FileSearch className="w-3 h-3" />
                      <span>Full Dossier</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 3. 80-Country Instant Atlas Jump */}
          <section className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800">
                Jump Directory to Country ({filteredCountries.length})
              </span>
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Filter country or +code..."
                className="h-9 sm:h-7 w-full sm:w-48 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {CONTINENT_TABS.map((tab) => {
                const active = selectedContinent === tab.code;
                return (
                  <button
                    key={tab.code}
                    type="button"
                    onClick={() => setSelectedContinent(tab.code)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
              {filteredCountries.map((c) => (
                <button
                  key={c.iso2}
                  type="button"
                  onClick={() => {
                    onJumpToCountry(c.continentCode, c.iso2);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 text-left text-xs bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-md flex items-center justify-between gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="truncate font-medium text-slate-800">
                    {c.name}{' '}
                    <span className="text-slate-400 font-mono">+{c.callingCode}</span>
                  </span>
                  <span className="font-mono tabular-nums text-[10px] text-sky-800 shrink-0">
                    {formatCompactNumber(c.count)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
