import React, { useMemo, useState } from 'react';
import { RotateCcw, Search, X } from 'lucide-react';
import type { HierarchyFacetSummary, LineType } from '../shared/types.ts';
import { formatCompactNumber } from '../utils/formatters.ts';

export interface ActiveFilters {
  continent: string;
  country: string;
  region: string;
  zipInput: string;
  carriers: string[];
  lineTypes: LineType[];
  prefix: string;
  search: string;
  onlyLiveWeb: boolean;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  facets: HierarchyFacetSummary | null;
  filters: ActiveFilters;
  onChangeFilters: (updater: (prev: ActiveFilters) => ActiveFilters) => void;
  onResetAll: () => void;
}

const LINE_TYPE_LABELS: Record<LineType, string> = {
  MOBILE: 'Mobile',
  LANDLINE: 'Landline',
  VOIP: 'VoIP',
  TOLL_FREE: 'Toll-Free',
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  facets,
  filters,
  onChangeFilters,
  onResetAll,
}) => {
  const [carrierQuery, setCarrierQuery] = useState('');

  const activeZipTokens = useMemo(
    () =>
      filters.zipInput
        .split(',')
        .map((z) => z.trim().toUpperCase())
        .filter(Boolean),
    [filters.zipInput]
  );

  const hasAnyFilter =
    Boolean(filters.continent) ||
    Boolean(filters.country) ||
    Boolean(filters.region) ||
    activeZipTokens.length > 0 ||
    filters.carriers.length > 0 ||
    filters.lineTypes.length > 0 ||
    Boolean(filters.prefix) ||
    Boolean(filters.search);

  const filteredCarriers = useMemo(() => {
    if (!facets) return [];
    const q = carrierQuery.trim().toLowerCase();
    if (!q) return facets.carrierGroups;
    return facets.carrierGroups.filter((c) => c.name.toLowerCase().includes(q));
  }, [facets, carrierQuery]);

  if (!isOpen) {
    return null;
  }

  const toggleSuggestedZip = (postalCode: string) => {
    const cleanTarget = postalCode.trim().toUpperCase();
    onChangeFilters((prev) => {
      const current = prev.zipInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const exists = current.some((z) => z.toUpperCase() === cleanTarget);
      const next = exists
        ? current.filter((z) => z.toUpperCase() !== cleanTarget)
        : [...current, postalCode];
      return { ...prev, zipInput: next.join(', ') };
    });
  };

  const toggleCarrier = (carrierName: string) => {
    onChangeFilters((prev) => {
      const exists = prev.carriers.includes(carrierName);
      const next = exists
        ? prev.carriers.filter((c) => c !== carrierName)
        : [...prev.carriers, carrierName];
      return { ...prev, carriers: next };
    });
  };

  const toggleLineType = (lt: LineType) => {
    onChangeFilters((prev) => {
      const exists = prev.lineTypes.includes(lt);
      const next = exists
        ? prev.lineTypes.filter((t) => t !== lt)
        : [...prev.lineTypes, lt];
      return { ...prev, lineTypes: next };
    });
  };

  return (
    <>
      {/* Mobile / Tablet Slide-Over Backdrop Scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/35 lg:hidden"
      />

      <aside
        aria-label="Phone Directory Filters"
        className="fixed inset-y-0 left-0 z-50 w-72 max-w-[86vw] shadow-2xl lg:static lg:z-auto lg:w-68 lg:max-w-none lg:shadow-none shrink-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-y-auto"
      >
        <div className="px-3.5 py-3 border-b border-slate-200 flex items-center justify-between gap-2 sticky top-0 bg-white z-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 whitespace-nowrap">
            Directory Filters
          </h2>

          <div className="flex items-center gap-2">
            {hasAnyFilter && (
              <button
                type="button"
                onClick={onResetAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="lg:hidden w-7 h-7 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-3.5 space-y-4 flex-1">
          {/* Location Section */}
          <section className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-700">Location</div>

            {/* Continent */}
            <div className="space-y-1">
              <label htmlFor="filter-continent" className="block text-[11px] text-slate-500">
                Continent
              </label>
              <select
                id="filter-continent"
                value={filters.continent}
                onChange={(e) => {
                  const val = e.target.value;
                  onChangeFilters((prev) => ({
                    ...prev,
                    continent: val,
                    country: '',
                    region: '',
                    zipInput: '',
                  }));
                }}
                className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="">
                  All Continents ({formatCompactNumber(facets?.totalRegistryRecords ?? 0)})
                </option>
                {facets?.continents.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({formatCompactNumber(c.count)})
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label htmlFor="filter-country" className="block text-[11px] text-slate-500">
                Country
              </label>
              <select
                id="filter-country"
                value={filters.country}
                onChange={(e) => {
                  const val = e.target.value;
                  const matchedCountry = facets?.countries.find((c) => c.iso2 === val);
                  onChangeFilters((prev) => ({
                    ...prev,
                    continent: matchedCountry ? matchedCountry.continentCode : prev.continent,
                    country: val,
                    region: '',
                    zipInput: '',
                  }));
                }}
                className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="">All Countries ({facets?.countries.length ?? 0})</option>
                {facets?.countries.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.name} (+{c.callingCode}) — {formatCompactNumber(c.count)}
                  </option>
                ))}
              </select>
            </div>

            {/* State / Region */}
            <div className="space-y-1">
              <label htmlFor="filter-region" className="block text-[11px] text-slate-500">
                State or Region
              </label>
              <select
                id="filter-region"
                value={filters.region}
                onChange={(e) => {
                  const val = e.target.value;
                  const matchedRegion = facets?.regions.find((r) => r.id === val);
                  onChangeFilters((prev) => ({
                    ...prev,
                    country: matchedRegion ? matchedRegion.countryIso2 : prev.country,
                    region: val,
                    zipInput: '',
                  }));
                }}
                className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="">All States &amp; Regions ({facets?.regions.length ?? 0})</option>
                {facets?.regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code}) — {formatCompactNumber(r.count)}
                  </option>
                ))}
              </select>
            </div>

            {/* Zip / Postal Code Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="filter-zip" className="block text-[11px] text-slate-500">
                  Zip or Postal Code
                </label>
                {filters.zipInput && (
                  <button
                    type="button"
                    onClick={() => onChangeFilters((prev) => ({ ...prev, zipInput: '' }))}
                    className="text-[11px] text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="filter-zip"
                  type="text"
                  value={filters.zipInput}
                  onChange={(e) =>
                    onChangeFilters((prev) => ({ ...prev, zipInput: e.target.value }))
                  }
                  placeholder="e.g. 90210, SW1A, 100-0001"
                  className="w-full h-8 pl-2.5 pr-7 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
                {filters.zipInput && (
                  <button
                    type="button"
                    onClick={() => onChangeFilters((prev) => ({ ...prev, zipInput: '' }))}
                    aria-label="Clear zip code"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {facets && facets.zipCodes.length > 0 && (
                <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-md divide-y divide-slate-100">
                  {facets.zipCodes.slice(0, 24).map((z) => {
                    const active = activeZipTokens.includes(z.postalCode.toUpperCase());
                    return (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => toggleSuggestedZip(z.postalCode)}
                        className={`w-full px-2.5 py-1.5 text-xs flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-sky-50 text-sky-900 font-medium'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">
                          <span className="font-mono">{z.postalCode}</span> · {z.city}
                        </span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
                          {formatCompactNumber(z.count)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Phone Type */}
          <section className="space-y-2">
            <div className="text-xs font-semibold text-slate-700">Phone Type</div>
            <div className="grid grid-cols-2 gap-1.5">
              {facets?.lineTypes.map(({ type, count }) => {
                const active = filters.lineTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleLineType(type)}
                    className={`px-2 py-1.5 text-xs rounded-md border flex items-center justify-between gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-sky-700 text-white border-sky-700 font-medium'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{LINE_TYPE_LABELS[type]}</span>
                    <span
                      className={`font-mono tabular-nums text-[10px] ${
                        active ? 'text-sky-100' : 'text-slate-400'
                      }`}
                    >
                      {formatCompactNumber(count)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Phone Company (Carrier) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Phone Company
              </span>
              {filters.carriers.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChangeFilters((prev) => ({ ...prev, carriers: [] }))}
                  className="text-[11px] text-sky-700 hover:text-sky-900 cursor-pointer"
                >
                  Clear ({filters.carriers.length})
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={carrierQuery}
                onChange={(e) => setCarrierQuery(e.target.value)}
                placeholder="AT&T, Verizon, Vodafone, Jio..."
                className="w-full h-8 pl-8 pr-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-md divide-y divide-slate-100">
              {filteredCarriers.map((carrier) => {
                const checked = filters.carriers.includes(carrier.name);
                return (
                  <label
                    key={carrier.name}
                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs cursor-pointer transition-colors ${
                      checked
                        ? 'bg-sky-50/70 text-slate-900 font-medium'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCarrier(carrier.name)}
                        className="rounded border-slate-300 text-sky-700 focus:ring-sky-600"
                      />
                      <span className="truncate">{carrier.name}</span>
                    </span>
                    <span className="font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
                      {formatCompactNumber(carrier.count)}
                    </span>
                  </label>
                );
              })}
              {filteredCarriers.length === 0 && (
                <div className="px-3 py-3 text-xs text-slate-400 text-center">
                  No matching companies
                </div>
              )}
            </div>
          </section>

          {/* Area Code / Prefix */}
          <section className="space-y-1">
            <label htmlFor="filter-prefix" className="block text-xs font-semibold text-slate-700">
              Area Code or Prefix
            </label>
            <input
              id="filter-prefix"
              type="text"
              value={filters.prefix}
              onChange={(e) =>
                onChangeFilters((prev) => ({ ...prev, prefix: e.target.value }))
              }
              placeholder="e.g. 310, 212, +44, +81"
              className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </section>
        </div>

        {/* Mobile Apply Button Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 lg:hidden sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-9 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer"
          >
            View Matching Numbers
          </button>
        </div>
      </aside>
    </>
  );
};
