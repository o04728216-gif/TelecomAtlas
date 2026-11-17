import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Compass,
  FileSearch,
  Globe,
  List,
  Upload,
} from 'lucide-react';
import type {
  HierarchyFacetSummary,
  PhoneNumberRecord,
  PhoneQueryResponse,
  WebHarvestSummary,
} from './shared/types.ts';
import { copyTextToClipboard } from './utils/clipboard.ts';
import { formatDirectoryFullName } from './utils/formatters.ts';
import {
  buildAppUrlAndTitle,
  parseAppUrl,
  type FinderUrlState,
  type WorkspaceTab,
} from './utils/urlState.ts';
import { FilterSidebar } from './components/FilterSidebar.tsx';
import type { ActiveFilters } from './components/FilterSidebar.tsx';
import { BreadcrumbBar } from './components/BreadcrumbBar.tsx';
import { VirtualizedPhoneGrid } from './components/VirtualizedPhoneGrid.tsx';
import { NumberInspectorDrawer } from './components/NumberInspectorDrawer.tsx';
import { ContactFinderPanel } from './components/ContactFinderPanel.tsx';
import { WebHarvesterPanel } from './components/WebHarvesterPanel.tsx';
import { BatchIngestionPanel } from './components/BatchIngestionPanel.tsx';
import { GlobalPulseModal } from './components/GlobalPulseModal.tsx';

const PAGE_SIZE = 500;

const INITIAL_FILTERS: ActiveFilters = {
  continent: '',
  country: '',
  region: '',
  zipInput: '',
  carriers: [],
  lineTypes: [],
  prefix: '',
  search: '',
  onlyLiveWeb: false,
};

function buildFilterQueryParams(filters: ActiveFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.continent) params.set('continent', filters.continent);
  if (filters.country) params.set('country', filters.country);
  if (filters.region) params.set('region', filters.region);
  if (filters.zipInput.trim()) params.set('zipCodes', filters.zipInput.trim());
  if (filters.carriers.length > 0) params.set('carriers', filters.carriers.join(','));
  if (filters.lineTypes.length > 0) params.set('lineTypes', filters.lineTypes.join(','));
  if (filters.prefix.trim()) params.set('prefix', filters.prefix.trim());
  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.onlyLiveWeb) params.set('onlyLiveWeb', 'true');
  return params;
}

export default function App() {
  const initialUrlParsed = useMemo(
    () =>
      typeof window !== 'undefined'
        ? parseAppUrl(window.location.pathname, window.location.search)
        : parseAppUrl('/directory', ''),
    []
  );

  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialUrlParsed.tab);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [filters, setFiltersState] = useState<ActiveFilters>(initialUrlParsed.filters);
  const [pageOffset, setPageOffset] = useState(initialUrlParsed.pageOffset);
  const [finderUrlState, setFinderUrlState] = useState<FinderUrlState>(initialUrlParsed.finder);
  const [webMode, setWebMode] = useState<'directory' | 'url'>(initialUrlParsed.webMode);
  const [isRadarOpen, setIsRadarOpen] = useState(false);

  const [facets, setFacets] = useState<HierarchyFacetSummary | null>(null);
  const [records, setRecords] = useState<PhoneNumberRecord[]>([]);
  const [totalMatched, setTotalMatched] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<PhoneNumberRecord | null>(null);
  const [contactFinderTargetPhone, setContactFinderTargetPhone] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const [copiedNamesToast, setCopiedNamesToast] = useState(false);
  const [copiedNumbersToast, setCopiedNumbersToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFetchingLiveWeb, setIsFetchingLiveWeb] = useState(false);
  const [liveWebStatusMessage, setLiveWebStatusMessage] = useState<string | null>(null);

  const isHandlingPopStateRef = useRef(false);
  const lastTabRef = useRef<WorkspaceTab>(initialUrlParsed.tab);
  const toastTimerRef = useRef<number | null>(null);

  const showFloatingToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  }, []);

  // Cmd/Ctrl + K opens World Radar from anywhere
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsRadarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Sync Browser Back / Forward navigation -> App State
  useEffect(() => {
    const onPopState = () => {
      isHandlingPopStateRef.current = true;
      const parsed = parseAppUrl(window.location.pathname, window.location.search);
      setActiveTab(parsed.tab);
      setFiltersState(parsed.filters);
      setPageOffset(parsed.pageOffset);
      setFinderUrlState(parsed.finder);
      setWebMode(parsed.webMode);
      if (parsed.tab === 'finder' && parsed.finder.subMode === 'phone' && parsed.finder.phoneQuery) {
        setContactFinderTargetPhone(parsed.finder.phoneQuery);
      }
      setTimeout(() => {
        isHandlingPopStateRef.current = false;
      }, 0);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync App State -> Browser URL Bar & Document Title
  useEffect(() => {
    const { url, title } = buildAppUrlAndTitle({
      tab: activeTab,
      filters,
      pageOffset,
      finder: finderUrlState,
      webMode,
    });

    if (document.title !== title) {
      document.title = title;
    }

    if (isHandlingPopStateRef.current) {
      lastTabRef.current = activeTab;
      return;
    }

    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== url) {
      if (lastTabRef.current !== activeTab) {
        window.history.pushState(null, '', url);
      } else {
        window.history.replaceState(null, '', url);
      }
    }
    lastTabRef.current = activeTab;
  }, [activeTab, filters, finderUrlState, pageOffset, webMode]);

  const handleUpdateFilters = useCallback(
    (updater: (prev: ActiveFilters) => ActiveFilters) => {
      setFiltersState((prev) => updater(prev));
      setPageOffset(0);
    },
    []
  );

  // Refresh facets as background real-registry harvest waves complete
  useEffect(() => {
    const t1 = setTimeout(() => setRefreshTick((t) => t + 1), 4000);
    const t2 = setTimeout(() => setRefreshTick((t) => t + 1), 10000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Load hierarchical counts
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.continent) params.set('continent', filters.continent);
    if (filters.country) params.set('country', filters.country);
    if (filters.region) params.set('region', filters.region);

    fetch(`/api/facets?${params.toString()}`)
      .then((res) => res.json())
      .then((data: HierarchyFacetSummary) => setFacets(data))
      .catch((err) => console.error('Failed loading facets:', err));
  }, [filters.continent, filters.country, filters.region, refreshTick]);

  // Execute paginated query (strictly 500 per page) across worldwide directory
  useEffect(() => {
    const controller = new AbortController();
    const params = buildFilterQueryParams(filters);
    params.set('limit', String(PAGE_SIZE));
    params.set('offset', String(pageOffset));

    setIsLoading(true);
    fetch(`/api/numbers?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: PhoneQueryResponse) => {
        setRecords(data.items ?? []);
        setTotalMatched(data.totalMatched ?? 0);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Query error:', err);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [filters, pageOffset, refreshTick]);

  const handleResetFilters = useCallback(() => {
    setFiltersState(INITIAL_FILTERS);
    setPageOffset(0);
    setSelectedRecord(null);
    setLiveWebStatusMessage(null);
  }, []);

  const handleJumpToCountry = useCallback((continentCode: string, countryIso2: string) => {
    setFiltersState((prev) => ({
      ...prev,
      continent: continentCode,
      country: countryIso2,
      region: '',
      zipInput: '',
      prefix: '',
      search: '',
    }));
    setPageOffset(0);
    setSelectedRecord(null);
    setActiveTab('explorer');
  }, []);

  const handleFilterStrictlyByZip = useCallback((postalCode: string) => {
    setFiltersState((prev) => ({
      ...prev,
      zipInput: postalCode,
    }));
    setPageOffset(0);
    setSelectedRecord(null);
    setActiveTab('explorer');
  }, []);

  const handleFilterByCarrier = useCallback((carrierGroup: string) => {
    setFiltersState((prev) => ({
      ...prev,
      carriers: prev.carriers.includes(carrierGroup)
        ? prev.carriers
        : [...prev.carriers, carrierGroup],
    }));
    setPageOffset(0);
    setSelectedRecord(null);
    setActiveTab('explorer');
  }, []);

  const handleOpenContactFinder = useCallback((e164: string) => {
    setSelectedRecord(null);
    setContactFinderTargetPhone(e164);
    setFinderUrlState((prev) => ({
      ...prev,
      subMode: 'phone',
      phoneQuery: e164,
    }));
    setActiveTab('finder');
  }, []);

  // 1-Click Copy ONLY the clean full owner names currently displayed on the active 500-row page
  const handleCopyCurrentPageNames = useCallback(async () => {
    if (records.length === 0) return;
    const text = records.map((r) => formatDirectoryFullName(r.ownerName)).join('\n');
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedNamesToast(true);
      showFloatingToast(`${records.length.toLocaleString()} full names copied`);
      setTimeout(() => setCopiedNamesToast(false), 1800);
    }
  }, [records, showFloatingToast]);

  // 1-Click Copy ONLY the phone numbers currently displayed on the active 500-row page
  const handleCopyCurrentPageNumbers = useCallback(async () => {
    if (records.length === 0) return;
    const text = records.map((r) => r.e164).join('\n');
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedNumbersToast(true);
      showFloatingToast(`${records.length.toLocaleString()} phone numbers copied`);
      setTimeout(() => setCopiedNumbersToast(false), 1800);
    }
  }, [records, showFloatingToast]);

  const handleSearchLiveWebNow = useCallback(async () => {
    setIsFetchingLiveWeb(true);
    setLiveWebStatusMessage(null);
    try {
      const hasSpecificSearch =
        Boolean(filters.search.trim()) ||
        Boolean(filters.zipInput.trim()) ||
        Boolean(filters.region);

      if (!hasSpecificSearch && (!filters.country || filters.country === 'US')) {
        const res = await fetch('/api/web-turbo-usa', { method: 'POST' });
        if (res.ok) {
          const summary = (await res.json()) as WebHarvestSummary;
          setRefreshTick((t) => t + 1);
          setLiveWebStatusMessage(
            `+${summary.fetchedCount.toLocaleString()} USA web lines`
          );
          setTimeout(() => setLiveWebStatusMessage(null), 5000);
        }
        return;
      }

      const regionState =
        filters.region.startsWith('US-') ? filters.region.replace('US-', '') : undefined;
      const firstZip = filters.zipInput.split(',')[0]?.trim() || undefined;

      const res = await fetch('/api/web-discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryText: filters.search.trim() || undefined,
          postalCode: firstZip,
          state: regionState,
          countryCode: filters.country || undefined,
          limit: 200,
        }),
      });
      if (res.ok) {
        const summary = (await res.json()) as WebHarvestSummary;
        setRefreshTick((t) => t + 1);
        setLiveWebStatusMessage(
          summary.fetchedCount > 0
            ? `+${summary.fetchedCount} web lines`
            : 'No extra web lines matched'
        );
        setTimeout(() => setLiveWebStatusMessage(null), 5000);
      }
    } catch {
      setLiveWebStatusMessage('Live directory busy');
    } finally {
      setIsFetchingLiveWeb(false);
    }
  }, [filters.country, filters.region, filters.search, filters.zipInput]);

  return (
    <div className="h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-hidden flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract — Sleek Compact Height Across Mobile & Desktop */}
      <header className="h-11 md:h-13 shrink-0 bg-white border-b border-slate-200 px-3 sm:px-5 flex items-center justify-between gap-3 md:gap-8 z-30">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/directory"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('explorer');
          }}
          className="text-base sm:text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          TelecomAtlas
        </a>

        {/* Zone 2: 4 Clean Single-Line Navigation Links (Desktop/Tablet) */}
        <nav
          aria-label="Main Menu"
          className="hidden md:flex items-center gap-6 text-sm font-medium h-full"
        >
          <button
            type="button"
            onClick={() => setActiveTab('explorer')}
            className={`h-full inline-flex items-center border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'explorer'
                ? 'border-sky-700 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Phone Directory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('finder')}
            className={`h-full inline-flex items-center border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'finder'
                ? 'border-sky-700 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Contact Finder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('web')}
            className={`h-full inline-flex items-center border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'web'
                ? 'border-sky-700 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Get Web Numbers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingestion')}
            className={`h-full inline-flex items-center border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'ingestion'
                ? 'border-sky-700 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Import List
          </button>
        </nav>

        {/* Zone 3: 1 Interactive Primary Action — World Telecom Radar & Live Decoder */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsRadarOpen(true)}
            title="Open World Telecom Radar, Instant Decoder & 80-Country Atlas (⌘K)"
            className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>World Radar</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-800 rounded">
              ⌘K
            </kbd>
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'explorer' && (
          <div className="flex-1 min-h-0 flex overflow-hidden relative">
            <FilterSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              facets={facets}
              filters={filters}
              onChangeFilters={handleUpdateFilters}
              onResetAll={handleResetFilters}
            />

            <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
              <BreadcrumbBar
                sidebarOpen={sidebarOpen}
                onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                facets={facets}
                filters={filters}
                totalMatched={totalMatched}
                pageCount={records.length}
                copiedNamesToast={copiedNamesToast}
                copiedNumbersToast={copiedNumbersToast}
                isFetchingLiveWeb={isFetchingLiveWeb}
                liveWebStatusMessage={liveWebStatusMessage}
                onChangeFilters={handleUpdateFilters}
                onCopyPageNames={handleCopyCurrentPageNames}
                onCopyPageNumbers={handleCopyCurrentPageNumbers}
                onSearchLiveWebNow={handleSearchLiveWebNow}
              />

              <div className="flex-1 min-h-0 flex overflow-hidden relative">
                <VirtualizedPhoneGrid
                  records={records}
                  totalMatched={totalMatched}
                  pageOffset={pageOffset}
                  pageSize={PAGE_SIZE}
                  isLoading={isLoading}
                  selectedRecord={selectedRecord}
                  onSelectRecord={(rec) =>
                    setSelectedRecord((prev) => (prev?.id === rec.id ? null : rec))
                  }
                  onPageChange={setPageOffset}
                  onFilterByZip={handleFilterStrictlyByZip}
                  onFilterByCarrier={handleFilterByCarrier}
                  onOpenContactFinder={handleOpenContactFinder}
                  onResetFilters={handleResetFilters}
                  onSearchLiveWebNow={handleSearchLiveWebNow}
                />

                <NumberInspectorDrawer
                  record={selectedRecord}
                  onClose={() => setSelectedRecord(null)}
                  onFilterZip={handleFilterStrictlyByZip}
                  onFilterCarrier={handleFilterByCarrier}
                  onOpenContactFinder={handleOpenContactFinder}
                />
              </div>
            </main>
          </div>
        )}

        {activeTab === 'finder' && (
          <ContactFinderPanel
            initialPhone={contactFinderTargetPhone}
            finderUrlState={finderUrlState}
            onFinderUrlStateChange={setFinderUrlState}
            onClearInitialPhone={() => setContactFinderTargetPhone(null)}
            onNewRecordsDiscovered={() => setRefreshTick((t) => t + 1)}
          />
        )}

        {activeTab === 'web' && (
          <WebHarvesterPanel
            mode={webMode}
            onModeChange={setWebMode}
            onNewRecordsHarvested={() => setRefreshTick((t) => t + 1)}
            onOpenContactFinder={handleOpenContactFinder}
          />
        )}

        {activeTab === 'ingestion' && (
          <BatchIngestionPanel
            onIngestionCompleted={() => setRefreshTick((t) => t + 1)}
          />
        )}
      </div>

      {/* Sleek Ergonomic Mobile Bottom Navigation Bar (4 Tabs, Thumb-Zone Friendly) */}
      <nav
        aria-label="Mobile Workspace Navigation"
        className="md:hidden h-12 shrink-0 bg-white border-t border-slate-200 grid grid-cols-4 z-30"
      >
        <button
          type="button"
          onClick={() => setActiveTab('explorer')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'explorer'
              ? 'text-sky-700 font-semibold bg-sky-50/40'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Directory</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('finder')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'finder'
              ? 'text-sky-700 font-semibold bg-sky-50/40'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span>Finder</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('web')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'web'
              ? 'text-sky-700 font-semibold bg-sky-50/40'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Web Fetch</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ingestion')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'ingestion'
              ? 'text-sky-700 font-semibold bg-sky-50/40'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>
      </nav>

      {/* Subtle Floating Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 md:bottom-5 right-4 z-50 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg shadow-lg pointer-events-none"
        >
          {toastMessage}
        </div>
      )}

      {/* World Radar Modal */}
      <GlobalPulseModal
        isOpen={isRadarOpen}
        facets={facets}
        onClose={() => setIsRadarOpen(false)}
        onJumpToCountry={handleJumpToCountry}
        onOpenContactFinder={handleOpenContactFinder}
      />
    </div>
  );
}
