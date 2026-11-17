import React, { useEffect, useMemo, useState } from 'react';
import type { IngestionJob, PhoneQueryResponse } from '../shared/types.ts';
import { PaginationBar } from './PaginationBar.tsx';

interface BatchIngestionPanelProps {
  onIngestionCompleted: () => void;
}

const JOBS_PAGE_SIZE = 10;
const REJECTIONS_PAGE_SIZE = 10;

const INGEST_COUNTRY_OPTIONS = [
  { iso2: 'US', label: 'United States (+1)' },
  { iso2: 'CA', label: 'Canada (+1)' },
  { iso2: 'MX', label: 'Mexico (+52)' },
  { iso2: 'GB', label: 'United Kingdom (+44)' },
  { iso2: 'DE', label: 'Germany (+49)' },
  { iso2: 'FR', label: 'France (+33)' },
  { iso2: 'ES', label: 'Spain (+34)' },
  { iso2: 'IT', label: 'Italy (+39)' },
  { iso2: 'NL', label: 'Netherlands (+31)' },
  { iso2: 'CH', label: 'Switzerland (+41)' },
  { iso2: 'JP', label: 'Japan (+81)' },
  { iso2: 'IN', label: 'India (+91)' },
  { iso2: 'SG', label: 'Singapore (+65)' },
  { iso2: 'KR', label: 'South Korea (+82)' },
  { iso2: 'AE', label: 'United Arab Emirates (+971)' },
  { iso2: 'PH', label: 'Philippines (+63)' },
  { iso2: 'BR', label: 'Brazil (+55)' },
  { iso2: 'NG', label: 'Nigeria (+234)' },
  { iso2: 'ZA', label: 'South Africa (+27)' },
  { iso2: 'AU', label: 'Australia (+61)' },
  { iso2: 'NZ', label: 'New Zealand (+64)' },
];

export const BatchIngestionPanel: React.FC<BatchIngestionPanelProps> = ({
  onIngestionCompleted,
}) => {
  const [sourceLabel, setSourceLabel] = useState('Custom Contact Import');
  const [defaultCountry, setDefaultCountry] = useState('US');
  const [rawText, setRawText] = useState('');
  const [jobs, setJobs] = useState<IngestionJob[]>([]);
  const [jobsPage, setJobsPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [rejectionsPage, setRejectionsPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/ingest/jobs');
      if (res.ok) {
        const data = (await res.json()) as { jobs: IngestionJob[] };
        setJobs(data.jobs ?? []);
        return data.jobs ?? [];
      }
    } catch {
      // Ignore transient errors
    }
    return [];
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const hasActive = jobs.some((j) => j.status === 'QUEUED' || j.status === 'PROCESSING');
    if (!hasActive) return;

    const timer = setInterval(async () => {
      const updated = await fetchJobs();
      const stillActive = updated.some(
        (j) => j.status === 'QUEUED' || j.status === 'PROCESSING'
      );
      if (!stillActive) {
        onIngestionCompleted();
      }
    }, 450);

    return () => clearInterval(timer);
  }, [jobs, onIngestionCompleted]);

  const loadRealVerifiedSample = async () => {
    try {
      const res = await fetch('/api/numbers?limit=8&offset=0');
      if (res.ok) {
        const data = (await res.json()) as PhoneQueryResponse;
        if (Array.isArray(data.items) && data.items.length > 0) {
          setRawText(
            data.items.map((r) => `${r.ownerName}, ${r.e164}`).join('\n')
          );
        }
      }
    } catch {
      // Ignore error
    }
  };

  const handleEnqueue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          sourceLabel,
          defaultCountry: defaultCountry || undefined,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setErrorMsg(payload.error || 'Failed to import phone numbers.');
      } else {
        setJobsPage(1);
        await fetchJobs();
        setTimeout(() => {
          fetchJobs();
          onIngestionCompleted();
        }, 250);
      }
    } catch {
      setErrorMsg('Network error submitting phone list.');
    } finally {
      setSubmitting(false);
    }
  };

  const paginatedJobs = useMemo(() => {
    const start = (jobsPage - 1) * JOBS_PAGE_SIZE;
    return jobs.slice(start, start + JOBS_PAGE_SIZE);
  }, [jobs, jobsPage]);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  const paginatedRejections = useMemo(() => {
    if (!selectedJob) return [];
    const start = (rejectionsPage - 1) * REJECTIONS_PAGE_SIZE;
    return selectedJob.rejections.slice(start, start + REJECTIONS_PAGE_SIZE);
  }, [selectedJob, rejectionsPage]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-5 pb-16 md:pb-6">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
        <div>
          <h1 className="text-base sm:text-xl font-semibold text-slate-900">
            Import Phone Numbers &amp; Owners
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Paste phone numbers (or <code className="font-mono text-xs">Owner Name, Phone Number</code> lines) to detect carrier &amp; region automatically and save them into your Phone Directory.
          </p>
        </div>

        <form
          onSubmit={handleEnqueue}
          className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label htmlFor="ingest-source" className="block text-xs font-medium text-slate-700">
                List Label
              </label>
              <input
                id="ingest-source"
                type="text"
                value={sourceLabel}
                onChange={(e) => setSourceLabel(e.target.value)}
                className="w-full h-10 sm:h-9 px-3 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="ingest-country" className="block text-xs font-medium text-slate-700">
                Default Country (if numbers don&apos;t start with +)
              </label>
              <select
                id="ingest-country"
                value={defaultCountry}
                onChange={(e) => setDefaultCountry(e.target.value)}
                className="w-full h-10 sm:h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                {INGEST_COUNTRY_OPTIONS.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="ingest-raw" className="block text-xs font-medium text-slate-700">
                Phone Numbers (one per line, optional &quot;Owner Name, +Phone&quot;)
              </label>
              <button
                type="button"
                onClick={loadRealVerifiedSample}
                className="text-xs text-sky-700 hover:text-sky-900 whitespace-nowrap cursor-pointer"
              >
                Load Example
              </button>
            </div>
            <textarea
              id="ingest-raw"
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste real phone numbers here, one per line (e.g. Jane Doe, +13102715800)..."
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-red-700 font-medium">{errorMsg}</div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Invalid or non-existent numbers are automatically rejected during validation.
            </span>
            <button
              type="submit"
              disabled={submitting || !rawText.trim()}
              className="h-9 px-4 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:opacity-50 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              {submitting ? 'Validating & Importing...' : 'Validate & Add to Directory'}
            </button>
          </div>
        </form>

        {jobs.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Import Jobs
              </h2>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {jobs.length} total jobs
              </span>
            </div>
            <div className="divide-y divide-slate-200">
              {paginatedJobs.map((job) => (
                <div key={job.id} className="p-3.5 sm:p-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900">
                      {job.sourceLabel}
                    </span>
                    <div className="flex items-center gap-3">
                      {job.rejections.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedJobId((prev) => (prev === job.id ? null : job.id));
                            setRejectionsPage(1);
                          }}
                          className="text-xs text-rose-700 hover:underline cursor-pointer"
                        >
                          {selectedJobId === job.id
                            ? 'Hide Rejected'
                            : `Rejected (${job.rejections.length})`}
                        </button>
                      )}
                      <span className="font-mono font-semibold text-emerald-700">
                        {job.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 font-mono tabular-nums text-slate-600">
                    <span>Added: {job.validInsertedCount}</span>
                    <span>·</span>
                    <span>Duplicates: {job.duplicateSkippedCount}</span>
                    <span>·</span>
                    <span>Invalid: {job.invalidRejectedCount}</span>
                  </div>
                </div>
              ))}
            </div>

            <PaginationBar
              totalItems={jobs.length}
              pageSize={JOBS_PAGE_SIZE}
              currentPage={jobsPage}
              onPageChange={setJobsPage}
              itemLabel="import jobs"
            />
          </div>
        )}

        {selectedJob && selectedJob.rejections.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Rejected Invalid Lines — {selectedJob.sourceLabel}
              </h3>
              <span className="text-xs font-mono text-rose-700">
                {selectedJob.rejections.length} rejected
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {paginatedRejections.map((rej, idx) => (
                <div
                  key={`${rej.raw}-${idx}`}
                  className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <span className="font-mono text-slate-800">{rej.raw}</span>
                  <span className="text-rose-700">{rej.reason}</span>
                </div>
              ))}
            </div>
            <PaginationBar
              totalItems={selectedJob.rejections.length}
              pageSize={REJECTIONS_PAGE_SIZE}
              currentPage={rejectionsPage}
              onPageChange={setRejectionsPage}
              itemLabel="rejected lines"
            />
          </div>
        )}
      </div>
    </div>
  );
};
