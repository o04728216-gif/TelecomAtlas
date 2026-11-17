import React, { useCallback, useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type {
  HierarchyFacetSummary,
  PhoneNumberRecord,
  PhoneQueryResponse,
  WebHarvestSummary,
} from './shared/types.ts';
import { copyTextToClipboard } from './utils/clipboard.ts';
import { FilterSidebar } from './components/FilterSidebar.tsx';
import type { ActiveFilters } from './components/FilterSidebar.tsx';
import { BreadcrumbBar } from './components/BreadcrumbBar.tsx';
import { VirtualizedPhoneGrid } from './components/VirtualizedPhoneGrid.tsx';
import { NumberInspectorDrawer } from './components/NumberInspectorDrawer.tsx';
import { ContactFinderPanel } from './components/ContactFinderPanel.tsx';
import { WebHarvesterPanel } from './components/WebHarvesterPanel.tsx';
import { BatchIngestionPanel } from './components/BatchIngestionPanel.tsx';
import { ArchitectureSchemaPanel } from './components/ArchitectureSchemaPanel.tsx';

type WorkspaceTab = 'explorer' | 'finder' | 'web' | 'ingestion' | 'schema';

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
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFiltersState] = useState<ActiveFilters>(INITIAL_FILTERS);
  const [pageOffset, setPageOffset] = useState(0);
  const [facets, setFacets] = useState<HierarchyFacetSummary | null>(null);
  const [records, setRecords] = useState<PhoneNumberRecord[]>([]);
  const [totalMatched, setTotalMatched] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<PhoneNumberRecord | null>(null);
  const [contactFinderTargetPhone, setContactFinderTargetPhone] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const [copiedPageToast, setCopiedPageToast] = useState(false);
  const [isFetchingLiveWeb, setIsFetchingLiveWeb] = useState(false);
  const [liveWebStatusMessage, setLiveWebStatusMessage] = useState<string | null>(null);

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

  // Load verified hierarchical counts
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

  // Execute paginated query (strictly 500 per page) across real existing phone numbers
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

  const handleFilterStrictlyByZip = useCallback((postalCode: string) => {
    setFiltersState((prev) => ({
      ...prev,
      zipInput: postalCode,
    }));
    setPageOffset(0);
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
    setActiveTab('explorer');
  }, []);

  const handleOpenContactFinder = useCallback((e164: string) => {
    setContactFinderTargetPhone(e164);
    setActiveTab('finder');
  }, []);

  // Copy ONLY the phone numbers currently displayed on the active 500-row page!
  const handleCopyCurrentPageNumbers = useCallback(async () => {
    if (records.length === 0) return;
    const text = records.map((r) => r.e164).join('\n');
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedPageToast(true);
      setTimeout(() => setCopiedPageToast(false), 1800);
    }
  }, [records]);

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
            `Fetched ${summary.fetchedCount.toLocaleString()} USA web numbers (${summary.newlyAddedCount.toLocaleString()} newly added)`
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
            ? `Fetched ${summary.fetchedCount} web numbers (${summary.newlyAddedCount} new)`
            : 'No extra web records matched that exact term'
        );
        setTimeout(() => setLiveWebStatusMessage(null), 5000);
      }
    } catch {
      setLiveWebStatusMessage('Could not reach live directory right now');
    } finally {
      setIsFetchingLiveWeb(false);
    }
  }, [filters.country, filters.region, filters.search, filters.zipInput]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="h-14 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#directory"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('explorer');
          }}
          className="text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          TelecomAtlas
        </a>

        {/* Zone 2: 5 Clean Single-Line Navigation Links */}
        <nav aria-label="Main Menu" className="flex items-center gap-6 text-sm font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('explorer')}
            className={`py-4 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
            className={`py-4 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
            className={`py-4 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
            className={`py-4 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'ingestion'
                ? 'border-sky-700 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Import List
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`py-4 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'schema'
                ? 'border-sky-700 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            System Schema
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Button — Copy ONLY Active Page (500 per page) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleCopyCurrentPageNumbers}
            disabled={records.length === 0}
            title="Copy only the phone numbers displayed on the current directory page (up to 500)"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedPageToast ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Page ({records.length.toLocaleString()})!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Page ({records.length.toLocaleString()})</span>
              </>
            )}
          </button>
        </div>
      </header>

      {activeTab === 'explorer' && (
        <div className="flex-1 min-h-0 flex overflow-hidden">
          <FilterSidebar
            isOpen={sidebarOpen}
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
              copiedPageToast={copiedPageToast}
              isFetchingLiveWeb={isFetchingLiveWeb}
              liveWebStatusMessage={liveWebStatusMessage}
              onChangeFilters={handleUpdateFilters}
              onCopyPageNumbers={handleCopyCurrentPageNumbers}
              onSearchLiveWebNow={handleSearchLiveWebNow}
            />

            <div className="flex-1 min-h-0 flex overflow-hidden">
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
          onClearInitialPhone={() => setContactFinderTargetPhone(null)}
          onNewRecordsDiscovered={() => setRefreshTick((t) => t + 1)}
        />
      )}

      {activeTab === 'web' && (
        <WebHarvesterPanel
          onNewRecordsHarvested={() => setRefreshTick((t) => t + 1)}
          onOpenContactFinder={handleOpenContactFinder}
        />
      )}

      {activeTab === 'ingestion' && (
        <BatchIngestionPanel
          onIngestionCompleted={() => setRefreshTick((t) => t + 1)}
        />
      )}

      {activeTab === 'schema' && <ArchitectureSchemaPanel />}
    </div>
  );
}
