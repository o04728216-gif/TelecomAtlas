import React, { useState } from 'react';
import { Check, Copy, FileSearch, X } from 'lucide-react';
import type { PhoneNumberRecord } from '../shared/types.ts';
import { copyTextToClipboard } from '../utils/clipboard.ts';

interface NumberInspectorDrawerProps {
  record: PhoneNumberRecord | null;
  onClose: () => void;
  onFilterZip: (zip: string) => void;
  onFilterCarrier: (carrierGroup: string) => void;
  onOpenContactFinder: (e164: string) => void;
}

export const NumberInspectorDrawer: React.FC<NumberInspectorDrawerProps> = ({
  record,
  onClose,
  onFilterZip,
  onFilterCarrier,
  onOpenContactFinder,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!record) {
    return null;
  }

  const triggerCopy = async (key: string, text: string) => {
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1500);
    }
  };

  return (
    <aside
      aria-label="Owner and Phone Details"
      className="w-88 shrink-0 border-l border-slate-200 bg-white flex flex-col h-full overflow-y-auto"
    >
      <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-slate-500">Phone Number Owner</div>
          <h3 className="mt-0.5 text-lg font-semibold text-slate-900 truncate">
            {record.ownerName}
          </h3>
          {record.ownerTitle && (
            <div className="mt-0.5 text-xs text-slate-500 truncate">
              {record.ownerTitle}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5 text-xs">
        {/* Copy & Contact Finder Actions */}
        <section className="space-y-2">
          <button
            type="button"
            onClick={() => onOpenContactFinder(record.e164)}
            className="w-full h-10 px-4 flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            <FileSearch className="w-4 h-4" />
            <span>Open Full Public Report (Contact Finder)</span>
          </button>

          <button
            type="button"
            onClick={() => triggerCopy('intl', record.e164)}
            className="w-full h-10 px-4 flex items-center justify-between gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <span className="font-mono tabular-nums text-sm">
              {record.internationalFormat}
            </span>
            <span className="inline-flex items-center gap-1 text-xs whitespace-nowrap">
              {copiedKey === 'intl' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Number
                </>
              )}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => triggerCopy('local', record.nationalFormat)}
              className="h-9 px-3 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedKey === 'local' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copied Local</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Local</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                triggerCopy('card', `${record.ownerName} — ${record.internationalFormat}`)
              }
              className="h-9 px-3 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedKey === 'card' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copied Info</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Name + #</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Public Identity & Location */}
        <section className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-900">
            Public Record &amp; Location
          </h4>
          <dl className="divide-y divide-slate-100 border-t border-b border-slate-200">
            {record.organizationName && (
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Organization</dt>
                <dd className="text-slate-900 font-medium text-right">
                  {record.organizationName}
                </dd>
              </div>
            )}
            {record.specialtyOrCategory && (
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Category</dt>
                <dd className="text-slate-900 text-right">{record.specialtyOrCategory}</dd>
              </div>
            )}
            {record.publicRegistryId && (
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Registry ID</dt>
                <dd className="font-mono text-slate-900">{record.publicRegistryId}</dd>
              </div>
            )}
            {record.streetAddress && (
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Street Address</dt>
                <dd className="text-slate-900 text-right">{record.streetAddress}</dd>
              </div>
            )}
            {record.mailingAddress && record.mailingAddress !== record.streetAddress && (
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Mailing Address</dt>
                <dd className="text-slate-900 text-right">{record.mailingAddress}</dd>
              </div>
            )}
            <div className="py-2 flex items-center justify-between gap-3">
              <dt className="text-slate-500">City</dt>
              <dd className="text-slate-900">{record.city ?? '—'}</dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-3">
              <dt className="text-slate-500">State / Region</dt>
              <dd className="text-slate-900">
                {record.regionName
                  ? `${record.regionName} (${record.regionCode})`
                  : 'National'}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-3">
              <dt className="text-slate-500">Zip / Postal Code</dt>
              <dd>
                {record.postalCode ? (
                  <button
                    type="button"
                    onClick={() => onFilterZip(record.postalCode!)}
                    className="font-mono tabular-nums font-medium text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
                  >
                    {record.postalCode}
                  </button>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-3">
              <dt className="text-slate-500">Country</dt>
              <dd className="text-slate-900">
                {record.countryName} (+{record.callingCode})
              </dd>
            </div>
          </dl>
        </section>

        {/* Carrier & Phone Info */}
        <section className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-900">
            Phone Company &amp; Line Info
          </h4>
          <dl className="divide-y divide-slate-100 border-t border-b border-slate-200">
            <div className="py-2 flex items-center justify-between gap-3">
              <dt className="text-slate-500">Phone Company</dt>
              <dd className="text-right">
                <button
                  type="button"
                  onClick={() => onFilterCarrier(record.carrierGroup)}
                  className="font-medium text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
                >
                  {record.carrierName}
                </button>
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-3">
              <dt className="text-slate-500">Phone Type</dt>
              <dd className="font-medium text-slate-900">{record.lineType}</dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-3">
              <dt className="text-slate-500">Area / Prefix</dt>
              <dd className="font-mono tabular-nums text-slate-900">
                +{record.callingCode}-{record.ndcPrefix}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between gap-3">
              <dt className="text-slate-500">Source</dt>
              <dd className="text-slate-700 text-right">{record.registrySource}</dd>
            </div>
          </dl>
        </section>
      </div>
    </aside>
  );
};
