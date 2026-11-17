/**
 * Formats subscriber names so outer directory listings show the clean full name
 * without post-nominal clinical/professional credentials (Pharm.D., DDS, MD, etc.),
 * while preserving full credentials for Quick View and Contact Finder dossiers.
 */

const CREDENTIAL_PATTERNS = [
  // Comma-separated trailing credentials: "Juan A. Aguilar, DDS" or "Sarah Jenkins, Pharm.D., RPh"
  /,\s*(?:Pharm\.?\s*D\.?|R\.?Ph\.?|M\.?D\.?|D\.?O\.?|D\.?D\.?S\.?|D\.?M\.?D\.?|D\.?P\.?M\.?|O\.?D\.?|D\.?C\.?|D\.?P\.?T\.?|P\.?T\.?|O\.?T\.?R?(?:\/L)?|R\.?N\.?|B\.?S\.?N\.?|M\.?S\.?N\.?|D\.?N\.?P\.?|A\.?P\.?R\.?N\.?|F\.?N\.?P\.?(?:-C|-BC)?|N\.?P\.?(?:-C)?|P\.?A\.?(?:-C)?|Ph\.?D\.?|Psy\.?D\.?|Ed\.?D\.?|L\.?C\.?S\.?W\.?|L\.?M\.?S\.?W\.?|L\.?M\.?F\.?T\.?|L\.?P\.?C\.?|C\.?P\.?A\.?|Esq\.?|J\.?D\.?|M\.?B\.?A\.?|M\.?P\.?H\.?|F\.?A\.?C\.?S\.?|F\.?A\.?C\.?P\.?|F\.?A\.?C\.?C\.?|F\.?A\.?A\.?P\.?|A\.?u\.?D\.?|C\.?R\.?N\.?A\.?|C\.?N\.?M\.?)(?:[\s,./;-]+[A-Za-z.-]+)*$/i,
  // Space-separated trailing clinical credentials without comma: "Kathryn A. Agamawi Pharm.D."
  /\s+(?:Pharm\.?\s*D\.?|R\.?Ph\.?|M\.?D\.?|D\.?D\.?S\.?|D\.?M\.?D\.?|D\.?P\.?M\.?|A\.?P\.?R\.?N\.?|F\.?N\.?P\.?(?:-C|-BC)?|P\.?A\.?-C|Ph\.?D\.?|Psy\.?D\.?|D\.?P\.?T\.?|L\.?C\.?S\.?W\.?|C\.?P\.?A\.?|C\.?R\.?N\.?A\.?|F\.?A\.?C\.?S\.?)$/i,
];

export interface ParsedDirectoryName {
  cleanFullName: string;
  credentials: string | null;
}

export function parseSubscriberDisplayName(rawName: string): ParsedDirectoryName {
  const trimmed = (rawName || '').trim();
  if (!trimmed) {
    return { cleanFullName: 'Unknown Subscriber', credentials: null };
  }

  // Strip leading honorifics like "Dr. " in directory if desired? Keep first/middle/last intact, strip trailing credentials.
  for (const pattern of CREDENTIAL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match.index !== undefined && match.index > 1) {
      const cleanFullName = trimmed.slice(0, match.index).replace(/[,\s]+$/, '').trim();
      const rawCred = match[0].replace(/^[,\s]+/, '').trim();
      if (cleanFullName.length >= 2) {
        return {
          cleanFullName,
          credentials: rawCred || null,
        };
      }
    }
  }

  return {
    cleanFullName: trimmed,
    credentials: null,
  };
}

export function formatDirectoryFullName(rawName: string): string {
  return parseSubscriberDisplayName(rawName).cleanFullName;
}

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(2)}B`;
  }
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 10_000) {
    return `${Math.round(n / 1_000)}K`;
  }
  return n.toLocaleString();
}

export function getLiveTimeInTimezone(timezone?: string | null): string | null {
  if (!timezone || timezone === 'Local Standard Time') return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(new Date());
  } catch {
    return null;
  }
}
