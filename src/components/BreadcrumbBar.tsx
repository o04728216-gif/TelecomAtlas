import React from 'react';
import {
  Check,
  ChevronRight,
  Copy,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from 'lucide-react';
import type { HierarchyFacetSummary } from '../shared/types.ts';
import type { ActiveFilters } from './FilterSidebar.tsx';

interface BreadcrumbBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  facets: HierarchyFacetSummary | null;
  filters: ActiveFilters;
  totalMatched: number;
  pageCount: number;
  copiedPageToast: boolean;
  isFetchingLiveWeb: boolean;
  liveWebStatusMessage: string | null;
  onChangeFilters: (updater: (prev: ActiveFilters) => ActiveFilters) => void;
  onCopyPageNumbers: () => void;
  onSearchLiveWebNow: () => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  facets,
  filters,
  totalMatched,
  pageCount,
  copiedPageToast,
  isFetchingLiveWeb,
  liveWebStatusMessage,
  onChangeFilters,
  onCopyPageNumbers,
  onSearchLiveWebNow,
}) => {
  const activeContinentObj = facets?.continents.find((c) => c.code === filters.continent);
  const activeCountryObj = facets?.countries.find((c) => c.iso2 === filters.country);
  const activeRegionObj = facets?.regions.find((r) => r.id === filters.region);

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 space-y-2.5">
      {/* Row 1: Search Bar + Fetch Web + Copy Page (500) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Hide filters' : 'Show filters'}
          title={sidebarOpen ? 'Hide filters' : 'Show filters'}
          className="h-10 px-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0 cursor-pointer"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* Search Input */}
        <div className="relative flex-1 min-w-60">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              onChangeFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Search any owner name, phone number, city, state, zip, or carrier (e.g. Texas, 90210, 310-271, Smith)..."
            className="w-full h-10 pl-10 pr-8 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChangeFilters((prev) => ({ ...prev, search: '' }))}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Web Fetcher */}
        <button
          type="button"
          onClick={onSearchLiveWebNow}
          disabled={isFetchingLiveWeb}
          className="h-10 px-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          title="Pull more phone numbers & owners from the web"
        >
          <Globe className="w-3.5 h-3.5 text-sky-700" />
          <span>{isFetchingLiveWeb ? 'Fetching Web...' : 'Fetch Web'}</span>
        </button>

        {/* Copy ONLY Current Page (500 Numbers) */}
        <button
          type="button"
          onClick={onCopyPageNumbers}
          disabled={pageCount === 0}
          className="h-10 px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          title="Copy only the phone numbers shown on this page"
        >
          {copiedPageToast ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-emerald-800">Copied Page ({pageCount.toLocaleString()})!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-sky-700" />
              <span>Copy Page ({pageCount.toLocaleString()})</span>
            </>
          )}
        </button>
      </div>

      {/* Row 2: Breadcrumb Path + Worldwide Million-Scale Count Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <nav aria-label="Location Path" className="flex items-center gap-1.5 min-w-0 overflow-x-auto">
          <button
            type="button"
            onClick={() =>
              onChangeFilters((prev) => ({
                ...prev,
                continent: '',
                country: '',
                region: '',
                zipInput: '',
              }))
            }
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              !filters.continent
                ? 'font-semibold text-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Worldwide
          </button>

          {filters.continent && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                type="button"
                onClick={() =>
                  onChangeFilters((prev) => ({
                    ...prev,
                    country: '',
                    region: '',
                    zipInput: '',
                  }))
                }
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  !filters.country
                    ? 'font-semibold text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeContinentObj?.name ?? filters.continent}
              </button>
            </>
          )}

          {filters.country && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                type="button"
                onClick={() =>
                  onChangeFilters((prev) => ({
                    ...prev,
                    region: '',
                    zipInput: '',
                  }))
                }
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  !filters.region
                    ? 'font-semibold text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeCountryObj
                  ? `${activeCountryObj.name} (+${activeCountryObj.callingCode})`
                  : filters.country}
              </button>
            </>
          )}

          {filters.region && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <button
                type="button"
                onClick={() =>
                  onChangeFilters((prev) => ({
                    ...prev,
                    zipInput: '',
                  }))
                }
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  !filters.zipInput
                    ? 'font-semibold text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeRegionObj?.name ?? filters.region}
              </button>
            </>
          )}

          {filters.zipInput.trim() && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono font-semibold text-sky-800 whitespace-nowrap shrink-0">
                Zip {filters.zipInput.trim()}
              </span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {liveWebStatusMessage && (
            <span className="text-xs font-medium text-emerald-700">
              {liveWebStatusMessage}
            </span>
          )}
          <span className="text-xs text-slate-600 font-mono tabular-nums whitespace-nowrap">
            Total <span className="font-semibold text-slate-900">{totalMatched.toLocaleString()}</span> numbers
            {facets && !filters.country && (
              <>
                {' '}· USA <span className="font-semibold text-sky-800">{facets.usTotalCount.toLocaleString()}</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Row 3: Continent / Country / State Drilldown Buttons */}
      {facets && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {!filters.country && (
            <button
              type="button"
              onClick={() =>
                onChangeFilters((prev) => ({
                  ...prev,
                  continent: 'NA',
                  country: 'US',
                  region: '',
                }))
              }
              className="px-2.5 py-1 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              United States (All 50 States){' '}
              <span className="font-mono tabular-nums text-sky-700">
                {facets.usTotalCount.toLocaleString()}
              </span>
            </button>
          )}

          {!filters.continent &&
            facets.continents.map((cont) => (
              <button
                key={cont.code}
                type="button"
                onClick={() =>
                  onChangeFilters((prev) => ({ ...prev, continent: cont.code }))
                }
                className="px-2.5 py-1 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{cont.name}</span>{' '}
                <span className="font-mono tabular-nums text-slate-400">
                  {cont.count.toLocaleString()}
                </span>
              </button>
            ))}

          {filters.continent &&
            !filters.country &&
            facets.countries.map((cty) => (
              <button
                key={cty.iso2}
                type="button"
                onClick={() =>
                  onChangeFilters((prev) => ({ ...prev, country: cty.iso2 }))
                }
                className="px-2.5 py-1 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{cty.name}</span>{' '}
                <span className="font-mono tabular-nums text-slate-400">
                  +{cty.callingCode} · {cty.count.toLocaleString()}
                </span>
              </button>
            ))}

          {filters.country &&
            !filters.region &&
            facets.regions.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() =>
                  onChangeFilters((prev) => ({ ...prev, region: reg.id }))
                }
                className="px-2.5 py-1 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{reg.name}</span>{' '}
                <span className="font-mono tabular-nums text-slate-400">
                  {reg.count.toLocaleString()}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
