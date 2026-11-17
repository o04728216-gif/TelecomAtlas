import React, { useEffect, useMemo, useRef, useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getSortedRowModel,
  useLegacyTable,
} from '@tanstack/react-table/legacy';
import type { LegacyColumnDef } from '@tanstack/react-table/legacy';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Copy,
  FileSearch,
  Globe,
} from 'lucide-react';
import type { LineType, PhoneNumberRecord } from '../shared/types.ts';
import { copyTextToClipboard } from '../utils/clipboard.ts';
import { PaginationBar } from './PaginationBar.tsx';

interface VirtualizedPhoneGridProps {
  records: PhoneNumberRecord[];
  totalMatched: number;
  pageOffset: number;
  pageSize: number;
  isLoading: boolean;
  selectedRecord: PhoneNumberRecord | null;
  onSelectRecord: (record: PhoneNumberRecord) => void;
  onPageChange: (nextOffset: number) => void;
  onFilterByZip: (postalCode: string) => void;
  onFilterByCarrier: (carrierGroup: string) => void;
  onOpenContactFinder: (e164: string) => void;
  onResetFilters: () => void;
  onSearchLiveWebNow: () => void;
}

const LINE_TYPE_DISPLAY: Record<LineType, string> = {
  MOBILE: 'Mobile',
  LANDLINE: 'Landline',
  VOIP: 'VoIP',
  TOLL_FREE: 'Toll-Free',
};

const GRID_COLUMNS_CLASS =
  'grid grid-cols-[minmax(190px,1.3fr)_225px_minmax(160px,1fr)_minmax(185px,1.2fr)_90px_108px] items-center w-full min-w-[980px]';

export const VirtualizedPhoneGrid: React.FC<VirtualizedPhoneGridProps> = ({
  records,
  totalMatched,
  pageOffset,
  pageSize,
  isLoading,
  selectedRecord,
  onSelectRecord,
  onPageChange,
  onFilterByZip,
  onFilterByCarrier,
  onOpenContactFinder,
  onResetFilters,
  onSearchLiveWebNow,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const parentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentScrollRef.current) {
      parentScrollRef.current.scrollTop = 0;
    }
  }, [records]);

  const handleCopyNumber = async (e: React.MouseEvent, rec: PhoneNumberRecord) => {
    e.stopPropagation();
    const ok = await copyTextToClipboard(rec.e164);
    if (ok) {
      setCopiedId(rec.id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === rec.id ? null : prev));
      }, 1500);
    }
  };

  const columns = useMemo<LegacyColumnDef<PhoneNumberRecord>[]>(
    () => [
      {
        accessorKey: 'ownerName',
        header: 'Phone Number Owner',
        cell: (info) => {
          const rec = info.row.original;
          return (
            <div className="flex items-center gap-1.5 min-w-0 pr-2 truncate">
              <span className="font-semibold text-slate-900 truncate">
                {rec.ownerName}
              </span>
              {rec.ownerTitle && (
                <>
                  <span aria-hidden="true" className="text-slate-300 shrink-0">
                    ·
                  </span>
                  <span className="text-[11px] text-slate-500 truncate">
                    {rec.ownerTitle}
                  </span>
                </>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'e164',
        header: 'Phone Number',
        cell: (info) => {
          const rec = info.row.original;
          const isCopied = copiedId === rec.id;
          return (
            <div className="flex items-center justify-between gap-2 pr-3">
              <button
                type="button"
                onClick={(e) => handleCopyNumber(e, rec)}
                title={`Copy ${rec.e164}`}
                className="font-mono tabular-nums font-medium text-slate-900 hover:text-sky-700 text-left truncate cursor-pointer"
              >
                {rec.internationalFormat}
              </button>
              <button
                type="button"
                onClick={(e) => handleCopyNumber(e, rec)}
                aria-label={`Copy phone number ${rec.e164}`}
                className={`h-7 px-2.5 inline-flex items-center gap-1 text-[11px] font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border-slate-200 hover:border-sky-300'
                }`}
              >
                {isCopied ? (
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
        },
      },
      {
        accessorKey: 'carrierGroup',
        header: 'Company & Type',
        cell: (info) => {
          const rec = info.row.original;
          return (
            <div className="flex items-center gap-1.5 min-w-0 text-xs text-slate-600 truncate pr-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterByCarrier(rec.carrierGroup);
                }}
                className="font-medium text-slate-800 hover:text-sky-700 hover:underline truncate cursor-pointer"
              >
                {rec.carrierGroup}
              </button>
              <span aria-hidden="true" className="text-slate-300 shrink-0">
                ·
              </span>
              <span className="text-slate-500 shrink-0">
                {LINE_TYPE_DISPLAY[rec.lineType] ?? rec.lineType}
              </span>
            </div>
          );
        },
      },
      {
        id: 'location',
        accessorFn: (row) =>
          `${row.city ?? ''} ${row.regionName ?? ''} ${row.countryName}`,
        header: 'City, State & Country',
        cell: (info) => {
          const rec = info.row.original;
          return (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate pr-2">
              {rec.city && (
                <>
                  <span className="text-slate-800 truncate">{rec.city}</span>
                  <span aria-hidden="true" className="text-slate-300 shrink-0">
                    ·
                  </span>
                </>
              )}
              {rec.regionCode && (
                <>
                  <span className="shrink-0">{rec.regionCode}</span>
                  <span aria-hidden="true" className="text-slate-300 shrink-0">
                    ·
                  </span>
                </>
              )}
              <span className="text-slate-500 truncate">{rec.countryName}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'postalCode',
        header: 'Zip Code',
        cell: (info) => {
          const zip = info.getValue() as string | null;
          if (!zip) {
            return <span className="text-slate-400 font-mono">—</span>;
          }
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFilterByZip(zip);
              }}
              title={`Filter by Zip Code ${zip}`}
              className="font-mono tabular-nums text-xs text-sky-800 hover:text-sky-950 hover:underline whitespace-nowrap cursor-pointer"
            >
              {zip}
            </button>
          );
        },
      },
      {
        id: 'publicReport',
        enableSorting: false,
        header: 'Public Info',
        cell: (info) => {
          const rec = info.row.original;
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenContactFinder(rec.e164);
              }}
              className="h-7 px-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileSearch className="w-3 h-3" />
              <span>Report</span>
            </button>
          );
        },
      },
    ],
    [copiedId, onFilterByCarrier, onFilterByZip, onOpenContactFinder]
  );

  const table = useLegacyTable({
    data: records,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentScrollRef.current,
    estimateSize: () => 44,
    overscan: 18,
    directDomUpdates: true,
    directDomUpdatesMode: 'transform',
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const currentPage = Math.floor(pageOffset / pageSize) + 1;

  if (isLoading) {
    return (
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        <div className={`${GRID_COLUMNS_CLASS} h-10 px-4 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600`}>
          <div>Phone Number Owner</div>
          <div>Phone Number</div>
          <div>Company &amp; Type</div>
          <div>City, State &amp; Country</div>
          <div>Zip Code</div>
          <div>Public Info</div>
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 14 }).map((_, idx) => (
            <div key={idx} className={`${GRID_COLUMNS_CLASS} h-11 px-4 animate-pulse`}>
              <div className="h-3.5 w-36 bg-slate-200 rounded" />
              <div className="h-3.5 w-40 bg-slate-200 rounded" />
              <div className="h-3.5 w-28 bg-slate-100 rounded" />
              <div className="h-3.5 w-36 bg-slate-100 rounded" />
              <div className="h-3.5 w-14 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          No Matching Phone Numbers in Current View
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 max-w-md">
          Pull fresh phone numbers &amp; owners from the web for your search, or reset active filters to view all worldwide numbers.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onSearchLiveWebNow}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            Fetch Web Numbers
          </button>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 bg-white flex flex-col overflow-hidden">
      <div
        ref={parentScrollRef}
        className="flex-1 overflow-auto relative"
      >
        <table className="w-full border-collapse block">
          <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 block">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={`${GRID_COLUMNS_CLASS} h-10 px-4`}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      className={`text-left text-xs font-semibold text-slate-700 select-none whitespace-nowrap pr-2 ${
                        canSort ? 'cursor-pointer hover:text-slate-950' : ''
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {canSort && (
                          <span className="text-slate-400">
                            {sorted === 'asc' ? (
                              <ArrowUp className="w-3 h-3 text-sky-700" />
                            ) : sorted === 'desc' ? (
                              <ArrowDown className="w-3 h-3 text-sky-700" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-60" />
                            )}
                          </span>
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody
            ref={rowVirtualizer.containerRef}
            className="relative block w-full"
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const rec = row.original;
              const isSelected = selectedRecord?.id === rec.id;

              return (
                <tr
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  onClick={() => onSelectRecord(rec)}
                  className={`group absolute top-0 left-0 ${GRID_COLUMNS_CLASS} h-11 px-4 text-xs border-b border-slate-100 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/90 text-slate-950'
                      : 'bg-white hover:bg-slate-50/90'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="min-w-0 truncate">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PaginationBar
        totalItems={totalMatched}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={(page) => onPageChange((page - 1) * pageSize)}
        itemLabel="numbers"
      />
    </div>
  );
};
