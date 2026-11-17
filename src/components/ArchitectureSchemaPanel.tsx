import React, { useEffect, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';

export const ArchitectureSchemaPanel: React.FC = () => {
  const [schemaSql, setSchemaSql] = useState('');
  const [engineCode, setEngineCode] = useState('');
  const [activeDoc, setActiveDoc] = useState<'schema' | 'engine'>('schema');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/architecture/artifacts')
      .then((r) => r.json())
      .then((data: { schemaSql?: string; engineCode?: string }) => {
        if (data.schemaSql) setSchemaSql(data.schemaSql);
        if (data.engineCode) setEngineCode(data.engineCode);
      })
      .catch(() => {});
  }, []);

  const currentContent = activeDoc === 'schema' ? schemaSql : engineCode;

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([schemaSql], { type: 'application/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'postgresql_postgis_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              System Architecture &amp; PostgreSQL / PostGIS DDL
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Production self-hosted relational schema (<code className="font-mono text-xs">continents</code>, <code className="font-mono text-xs">countries</code>, <code className="font-mono text-xs">regions</code>, <code className="font-mono text-xs">zip_codes</code> with PostGIS spatial GIST indexes, <code className="font-mono text-xs">prefix_carriers</code>, and <code className="font-mono text-xs">phone_numbers</code>) alongside our sub-millisecond Radix-Trie Longest-Prefix Matching service.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveDoc('schema')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeDoc === 'schema'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PostgreSQL + PostGIS Schema
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('engine')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeDoc === 'engine'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Radix-Trie Prefix Engine
              </button>
            </div>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-4">
            <span className="text-xs font-mono font-medium text-slate-700">
              {activeDoc === 'schema'
                ? 'schema/postgresql_postgis_schema.sql'
                : 'src/server/prefixEngine.ts'}
            </span>
            <div className="flex items-center gap-2">
              {activeDoc === 'schema' && (
                <button
                  type="button"
                  onClick={handleDownloadSql}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .sql
                </button>
              )}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors whitespace-nowrap cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Source
                  </>
                )}
              </button>
            </div>
          </div>
          <pre className="p-5 text-xs font-mono text-slate-800 overflow-x-auto leading-relaxed max-h-[640px]">
            <code>{currentContent || 'Loading source artifact...'}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
