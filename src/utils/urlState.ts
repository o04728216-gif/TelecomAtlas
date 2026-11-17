import type { ActiveFilters } from '../components/FilterSidebar.tsx';
import type { LineType } from '../shared/types.ts';

export type WorkspaceTab = 'explorer' | 'finder' | 'web' | 'ingestion';
export type FinderSubMode = 'phone' | 'people' | 'batch';

export interface FinderUrlState {
  subMode: FinderSubMode;
  phoneQuery: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ParsedAppUrlState {
  tab: WorkspaceTab;
  filters: ActiveFilters;
  pageOffset: number;
  finder: FinderUrlState;
  webMode: 'directory' | 'url';
}

const PAGE_SIZE = 500;

const CONTINENT_BY_COUNTRY: Record<string, string> = {
  // North America & Caribbean
  US: 'NA', CA: 'NA', MX: 'NA', DO: 'NA', CR: 'NA', PA: 'NA', GT: 'NA', JM: 'NA', TT: 'NA', BS: 'NA', PR: 'NA', SV: 'NA', HN: 'NA', NI: 'NA', BB: 'NA',
  // Europe
  GB: 'EU', DE: 'EU', FR: 'EU', ES: 'EU', IT: 'EU', NL: 'EU', CH: 'EU', SE: 'EU', PL: 'EU', IE: 'EU', BE: 'EU', AT: 'EU', NO: 'EU', DK: 'EU', FI: 'EU', PT: 'EU', GR: 'EU', CZ: 'EU', RO: 'EU', HU: 'EU', UA: 'EU', HR: 'EU', SK: 'EU', BG: 'EU', RS: 'EU', LT: 'EU', LV: 'EU', EE: 'EU', LU: 'EU', IS: 'EU', SI: 'EU', CY: 'EU', MT: 'EU',
  // Asia & Middle East
  JP: 'AS', IN: 'AS', SG: 'AS', KR: 'AS', AE: 'AS', PH: 'AS', ID: 'AS', CN: 'AS', HK: 'AS', TW: 'AS', TH: 'AS', MY: 'AS', VN: 'AS', PK: 'AS', BD: 'AS', LK: 'AS', SA: 'AS', IL: 'AS', TR: 'AS', QA: 'AS', KW: 'AS', OM: 'AS', BH: 'AS', JO: 'AS', KZ: 'AS', UZ: 'AS', NP: 'AS', KH: 'AS',
  // South America
  BR: 'SA', AR: 'SA', CO: 'SA', CL: 'SA', PE: 'SA', EC: 'SA', UY: 'SA', PY: 'SA', BO: 'SA', VE: 'SA',
  // Africa
  NG: 'AF', ZA: 'AF', KE: 'AF', EG: 'AF', GH: 'AF', MA: 'AF', TN: 'AF', DZ: 'AF', ET: 'AF', TZ: 'AF', UG: 'AF', RW: 'AF', SN: 'AF', CI: 'AF', CM: 'AF', ZM: 'AF', ZW: 'AF', MU: 'AF',
  // Oceania
  AU: 'OC', NZ: 'OC', FJ: 'OC', PG: 'OC',
};

const DEFAULT_FILTERS: ActiveFilters = {
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

const DEFAULT_FINDER: FinderUrlState = {
  subMode: 'phone',
  phoneQuery: '',
  firstName: '',
  lastName: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
};

export function parseAppUrl(pathname: string, search: string): ParsedAppUrlState {
  const cleanPath = pathname.replace(/\/+$/, '') || '/directory';
  const segments = cleanPath
    .split('/')
    .filter(Boolean)
    .map((s) => decodeURIComponent(s));
  const params = new URLSearchParams(search);

  const filters: ActiveFilters = { ...DEFAULT_FILTERS };
  const finder: FinderUrlState = { ...DEFAULT_FINDER };
  let tab: WorkspaceTab = 'explorer';
  let pageOffset = 0;
  let webMode: 'directory' | 'url' = 'directory';

  const root = (segments[0] ?? 'directory').toLowerCase();

  if (root === 'contact-finder') {
    tab = 'finder';
    const sub = (segments[1] ?? '').toLowerCase();
    if (sub === 'people') {
      finder.subMode = 'people';
      finder.firstName = params.get('first') ?? '';
      finder.lastName = params.get('last') ?? '';
      finder.city = params.get('city') ?? '';
      finder.state = params.get('state') ?? '';
      finder.zip = params.get('zip') ?? '';
      finder.country = params.get('country') ?? 'US';
    } else if (sub === 'verify') {
      finder.subMode = 'batch';
    } else {
      finder.subMode = 'phone';
      if (sub === 'phone' && segments[2]) {
        finder.phoneQuery = segments.slice(2).join('/');
      } else if (params.get('phone')) {
        finder.phoneQuery = params.get('phone') ?? '';
      }
      if (params.get('country')) {
        finder.country = params.get('country') ?? 'US';
      }
    }
  } else if (root === 'web-harvester') {
    tab = 'web';
    if ((segments[1] ?? '').toLowerCase() === 'scan-url') {
      webMode = 'url';
    }
  } else if (root === 'import') {
    tab = 'ingestion';
  } else {
    tab = 'explorer';
    if (root === 'directory') {
      if ((segments[1] ?? '').toLowerCase() === 'continent' && segments[2]) {
        filters.continent = segments[2].toUpperCase();
      } else if (segments[1] && segments[1].length === 2) {
        const iso2 = segments[1].toUpperCase();
        filters.country = iso2;
        filters.continent = CONTINENT_BY_COUNTRY[iso2] ?? params.get('continent')?.toUpperCase() ?? '';
        if (segments[2]) {
          const regCode = segments[2].toUpperCase();
          filters.region = regCode.includes('-') ? regCode : `${iso2}-${regCode}`;
        }
      }
    }

    if (params.get('continent') && !filters.continent) {
      filters.continent = params.get('continent')!.toUpperCase();
    }
    if (params.get('country') && !filters.country) {
      filters.country = params.get('country')!.toUpperCase();
    }
    if (params.get('region') && !filters.region) {
      filters.region = params.get('region')!.toUpperCase();
    }
    if (params.get('zip')) {
      filters.zipInput = params.get('zip')!;
    }
    if (params.get('carrier')) {
      filters.carriers = params
        .get('carrier')!
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (params.get('type')) {
      const allowed = new Set<LineType>(['MOBILE', 'LANDLINE', 'VOIP', 'TOLL_FREE']);
      filters.lineTypes = params
        .get('type')!
        .split(',')
        .map((s) => s.trim().toUpperCase() as LineType)
        .filter((t) => allowed.has(t));
    }
    if (params.get('prefix')) {
      filters.prefix = params.get('prefix')!;
    }
    if (params.get('q')) {
      filters.search = params.get('q')!;
    }
    const pageNum = parseInt(params.get('page') ?? '1', 10);
    if (!Number.isNaN(pageNum) && pageNum > 1) {
      pageOffset = (pageNum - 1) * PAGE_SIZE;
    }
  }

  return { tab, filters, pageOffset, finder, webMode };
}

export function buildAppUrlAndTitle(state: {
  tab: WorkspaceTab;
  filters: ActiveFilters;
  pageOffset: number;
  finder: FinderUrlState;
  webMode?: 'directory' | 'url';
}): { url: string; title: string } {
  const { tab, filters, pageOffset, finder, webMode } = state;

  if (tab === 'finder') {
    if (finder.subMode === 'people') {
      const p = new URLSearchParams();
      if (finder.firstName.trim()) p.set('first', finder.firstName.trim());
      if (finder.lastName.trim()) p.set('last', finder.lastName.trim());
      if (finder.city.trim()) p.set('city', finder.city.trim());
      if (finder.state.trim()) p.set('state', finder.state.trim());
      if (finder.zip.trim()) p.set('zip', finder.zip.trim());
      if (finder.country && finder.country !== 'US') p.set('country', finder.country);
      const qs = p.toString();
      const who = [finder.firstName.trim(), finder.lastName.trim()].filter(Boolean).join(' ');
      return {
        url: `/contact-finder/people${qs ? `?${qs}` : ''}`,
        title: who
          ? `People Search: ${who} — TelecomAtlas`
          : 'People & Location Finder — TelecomAtlas',
      };
    }

    if (finder.subMode === 'batch') {
      return {
        url: '/contact-finder/verify',
        title: 'Bulk Phone Verification — TelecomAtlas',
      };
    }

    const cleanedPhone = finder.phoneQuery.trim();
    if (cleanedPhone) {
      const slug = encodeURIComponent(cleanedPhone).replace(/%2B/gi, '+');
      return {
        url: `/contact-finder/phone/${slug}`,
        title: `Contact Report: ${cleanedPhone} — TelecomAtlas`,
      };
    }

    return {
      url: '/contact-finder',
      title: 'Contact Finder & Reverse Phone Lookup — TelecomAtlas',
    };
  }

  if (tab === 'web') {
    if (webMode === 'url') {
      return {
        url: '/web-harvester/scan-url',
        title: 'Scan Website for Numbers — TelecomAtlas',
      };
    }
    return {
      url: '/web-harvester',
      title: 'Get Live Web Numbers — TelecomAtlas',
    };
  }

  if (tab === 'ingestion') {
    return {
      url: '/import',
      title: 'Import Phone Numbers — TelecomAtlas',
    };
  }

  // Phone Directory ('explorer')
  let path = '/directory';
  const titleParts: string[] = [];

  if (filters.country) {
    path += `/${filters.country.toLowerCase()}`;
    if (filters.region) {
      const shortRegion = filters.region.startsWith(`${filters.country}-`)
        ? filters.region.slice(filters.country.length + 1)
        : filters.region;
      path += `/${shortRegion.toLowerCase()}`;
      titleParts.push(`${shortRegion}, ${filters.country}`);
    } else {
      titleParts.push(filters.country);
    }
  } else if (filters.continent) {
    path += `/continent/${filters.continent.toLowerCase()}`;
    titleParts.push(filters.continent);
  }

  const p = new URLSearchParams();
  if (filters.search.trim()) {
    p.set('q', filters.search.trim());
    titleParts.push(`"${filters.search.trim()}"`);
  }
  if (filters.zipInput.trim()) {
    p.set('zip', filters.zipInput.trim());
    titleParts.push(`ZIP ${filters.zipInput.trim()}`);
  }
  if (filters.carriers.length > 0) {
    p.set('carrier', filters.carriers.join(','));
  }
  if (filters.lineTypes.length > 0) {
    p.set('type', filters.lineTypes.join(','));
  }
  if (filters.prefix.trim()) {
    p.set('prefix', filters.prefix.trim());
  }

  const pageNum = Math.floor(pageOffset / PAGE_SIZE) + 1;
  if (pageNum > 1) {
    p.set('page', String(pageNum));
  }

  const qs = p.toString();
  const baseTitle =
    titleParts.length > 0
      ? `${titleParts.join(' · ')} Phone Directory`
      : 'Worldwide Phone Directory';
  const fullTitle = `${baseTitle}${pageNum > 1 ? ` (Page ${pageNum})` : ''} — TelecomAtlas`;

  return {
    url: `${path}${qs ? `?${qs}` : ''}`,
    title: fullTitle,
  };
}
