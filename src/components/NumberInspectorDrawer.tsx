import React, { useState } from 'react';
import { Award, Check, Copy, FileSearch, Phone, User, X } from 'lucide-react';
import type { PhoneNumberRecord } from '../shared/types.ts';
import { copyTextToClipboard } from '../utils/clipboard.ts';
import { parseSubscriberDisplayName } from '../utils/formatters.ts';

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

  const { cleanFullName, credentials } = parseSubscriberDisplayName(record.ownerName);

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
    <>
      {/* Mobile / Tablet Bottom-Sheet Backdrop Scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/35 xl:hidden"
      />

      <aside
        aria-label="Quick View Subscriber Details"
        className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] rounded-t-2xl shadow-2xl border-t border-slate-200 xl:static xl:z-auto xl:w-88 xl:max-h-none xl:rounded-none xl:shadow-none xl:border-t-0 xl:border-l shrink-0 bg-white flex flex-col xl:h-full overflow-hidden"
      >
        {/* Mobile Drag Handle */}
        <div className="xl:hidden pt-2 pb-0.5 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header: Full Name + Credentials (Pharm.D., DDS, MD, etc.) Shown Exclusively Here in Quick View */}
        <div className="px-4 py-3.5 border-b border-slate-200 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Quick View · Subscriber
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-base font-semibold text-slate-900 break-words leading-snug">
                {cleanFullName}
              </span>
              <button
                type="button"
                onClick={() => triggerCopy('name', cleanFullName)}
                title={`Copy ${cleanFullName}`}
                aria-label={`Copy ${cleanFullName}`}
                className={`w-6 h-6 inline-flex items-center justify-center rounded border transition-colors shrink-0 cursor-pointer ${
                  copiedKey === 'name'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-800 border-slate-200'
                }`}
              >
                {copiedKey === 'name' ? (
                  <Check className="w-3 h-3 text-emerald-700" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* Credentials (Pharm.D., DDS, MD, etc.) & Professional Title Shown Here in Quick View */}
            {(credentials || record.ownerTitle) && (
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-sky-800 font-medium">
                <Award className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                <span>
                  {[credentials, record.ownerTitle].filter(Boolean).join(' · ')}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Quick View"
            className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Primary Dossier Action + Compact Icon-Only Copy Rows */}
          <section className="space-y-2">
            <button
              type="button"
              onClick={() => onOpenContactFinder(record.e164)}
              className="w-full h-9 px-3.5 flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Open Full Contact Finder Dossier</span>
            </button>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 bg-slate-50/60">
              {/* Full Name Row */}
              <div className="px-3 py-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900 truncate">
                    {record.ownerName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerCopy('full-raw', record.ownerName)}
                  title={`Copy ${record.ownerName}`}
                  aria-label={`Copy ${record.ownerName}`}
                  className={`w-6 h-6 inline-flex items-center justify-center rounded border transition-colors shrink-0 cursor-pointer ${
                    copiedKey === 'full-raw'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-sky-50 text-slate-500 hover:text-sky-800 border-slate-200'
                  }`}
                >
                  {copiedKey === 'full-raw' ? (
                    <Check className="w-3 h-3 text-emerald-700" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* International E.164 Number Row */}
              <div className="px-3 py-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {record.internationalFormat}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerCopy('intl', record.e164)}
                  title={`Copy ${record.e164}`}
                  aria-label={`Copy ${record.e164}`}
                  className={`w-6 h-6 inline-flex items-center justify-center rounded border transition-colors shrink-0 cursor-pointer ${
                    copiedKey === 'intl'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-sky-50 text-slate-500 hover:text-sky-800 border-slate-200'
                  }`}
                >
                  {copiedKey === 'intl' ? (
                    <Check className="w-3 h-3 text-emerald-700" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* National / Local Dialing Format Row */}
              <div className="px-3 py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-slate-500 mr-1.5">Local:</span>
                  <span className="font-mono tabular-nums font-medium text-slate-800">
                    {record.nationalFormat}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerCopy('local', record.nationalFormat)}
                  title={`Copy ${record.nationalFormat}`}
                  aria-label={`Copy ${record.nationalFormat}`}
                  className={`w-6 h-6 inline-flex items-center justify-center rounded border transition-colors shrink-0 cursor-pointer ${
                    copiedKey === 'local'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-sky-50 text-slate-500 hover:text-sky-800 border-slate-200'
                  }`}
                >
                  {copiedKey === 'local' ? (
                    <Check className="w-3 h-3 text-emerald-700" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Public Identity & Location */}
          <section className="space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-900">
              Public Record &amp; Location
            </h4>
            <dl className="divide-y divide-slate-100 border-t border-b border-slate-200">
              {credentials && (
                <div className="py-2 flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Credentials</dt>
                  <dd className="text-slate-900 font-semibold text-right">{credentials}</dd>
                </div>
              )}
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
                  <dt className="text-slate-500">Specialty / Category</dt>
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
                <dd className="text-slate-900 text-right">
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
          <section className="space-y-1.5">
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
    </>
  );
};
