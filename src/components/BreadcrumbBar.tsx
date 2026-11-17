import React from 'react';
import {
  Check,
  Copy,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  Search,
  SlidersHorizontal,
  User,
  X,
} from 'lucide-react';
import type { HierarchyFacetSummary } from '../shared/types.ts';
import { formatCompactNumber } from '../utils/formatters.ts';
import type { ActiveFilters } from './FilterSidebar.tsx';

interface DirectoryToolbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  facets: HierarchyFacetSummary | null;
  filters: ActiveFilters;
  totalMatched: number;
  pageCount: number;
  copiedNamesToast: boolean;
  copiedNumbersToast: boolean;
  isFetchingLiveWeb: boolean;
  liveWebStatusMessage: string | null;
  onChangeFilters: (updater: (prev: ActiveFilters) => ActiveFilters) => void;
  onCopyPageNames: () => void;
  onCopyPageNumbers: () => void;
  onSearchLiveWebNow: () => void;
}

export const BreadcrumbBar: React.FC<DirectoryToolbarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  facets,
  filters,
  totalMatched,
  pageCount,
  copiedNamesToast,
  copiedNumbersToast,
  isFetchingLiveWeb,
  liveWebStatusMessage,
  onChangeFilters,
  onCopyPageNames,
  onCopyPageNumbers,
  onSearchLiveWebNow,
}) => {
  const activeFilterCount =
    (filters.continent ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.region ? 1 : 0) +
    (filters.zipInput.trim() ? 1 : 0) +
    filters.carriers.length +
    filters.lineTypes.length +
    (filters.prefix.trim() ? 1 : 0);

  return (
    <div className="bg-white border-b border-slate-200 px-2.5 sm:px-4 py-2 flex items-center gap-1.5 sm:gap-2">
      {/* Toggle Sidebar / Mobile Filter Drawer */}
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? 'Hide filters' : 'Show filters'}
        title={sidebarOpen ? 'Hide filters' : 'Show filters'}
        className={`h-8 px-2 sm:px-2.5 inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border transition-colors shrink-0 cursor-pointer ${
          activeFilterCount > 0
            ? 'bg-sky-50 text-sky-900 border-sky-300'
            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5 lg:hidden" />
        <span className="hidden lg:inline">
          {sidebarOpen ? (
            <PanelLeftClose className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftOpen className="w-3.5 h-3.5" />
          )}
        </span>
        <span className="hidden sm:inline">Filters</span>
        {activeFilterCount > 0 && (
          <span className="font-mono tabular-nums text-[11px] font-semibold text-sky-800">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) =>
            onChangeFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          placeholder="Search name, phone, city, state, zip, or carrier..."
          className="w-full h-9 sm:h-8 pl-8 pr-7 text-xs sm:text-[13px] bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChangeFilters((prev) => ({ ...prev, search: '' }))}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Live Web Fetcher */}
      <button
        type="button"
        onClick={onSearchLiveWebNow}
        disabled={isFetchingLiveWeb}
        className="h-8 px-2 sm:px-2.5 inline-flex items-center gap-1 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
        title="Pull additional phone numbers & owners from the live web"
        aria-label="Fetch live web numbers"
      >
        <Globe className={`w-3.5 h-3.5 text-sky-700 ${isFetchingLiveWeb ? 'animate-spin' : ''}`} />
        <span className="hidden md:inline">{isFetchingLiveWeb ? 'Fetching...' : 'Web'}</span>
      </button>

      {/* Small Icon-Only: Copy All Full Names on Active Page */}
      <button
        type="button"
        onClick={onCopyPageNames}
        disabled={pageCount === 0}
        className={`h-8 px-2 inline-flex items-center justify-center gap-1 rounded-lg border transition-colors shrink-0 cursor-pointer disabled:opacity-50 ${
          copiedNamesToast
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
            : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
        }`}
        title={`Copy all ${pageCount.toLocaleString()} full names on this page`}
        aria-label={`Copy all ${pageCount} full names on this page`}
      >
        <User className="w-3.5 h-3.5" />
        {copiedNamesToast ? (
          <Check className="w-3 h-3 text-emerald-700" />
        ) : (
          <Copy className="w-3 h-3 text-slate-500" />
        )}
      </button>

      {/* Small Icon-Only: Copy All Phone Numbers on Active Page */}
      <button
        type="button"
        onClick={onCopyPageNumbers}
        disabled={pageCount === 0}
        className={`h-8 px-2 inline-flex items-center justify-center gap-1 rounded-lg border transition-colors shrink-0 cursor-pointer disabled:opacity-50 ${
          copiedNumbersToast
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
            : 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-900'
        }`}
        title={`Copy all ${pageCount.toLocaleString()} phone numbers on this page`}
        aria-label={`Copy all ${pageCount} phone numbers on this page`}
      >
        <Phone className="w-3.5 h-3.5 text-sky-700" />
        {copiedNumbersToast ? (
          <Check className="w-3 h-3 text-emerald-700" />
        ) : (
          <Copy className="w-3 h-3 text-sky-700" />
        )}
      </button>

      {/* Quiet Inline Count Summary (Zero Breadcrumbs) */}
      <div className="hidden sm:flex items-center gap-2 pl-1 shrink-0 text-xs">
        {liveWebStatusMessage && (
          <span className="font-medium text-emerald-700 whitespace-nowrap">
            {liveWebStatusMessage}
          </span>
        )}
        <span className="text-slate-600 font-mono tabular-nums whitespace-nowrap">
          <span className="font-semibold text-slate-900 lg:hidden">
            {formatCompactNumber(totalMatched)}
          </span>
          <span className="font-semibold text-slate-900 hidden lg:inline">
            {totalMatched.toLocaleString()}
          </span>{' '}
          <span className="hidden md:inline">lines</span>
          {facets && !filters.country && (
            <span className="hidden xl:inline">
              {' '}· {facets.countries.length} countries
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
