import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  AtSign,
  Award,
  Briefcase,
  Cake,
  Car,
  Check,
  CheckCircle2,
  Copy,
  DollarSign,
  ExternalLink,
  FileSearch,
  Globe,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Phone,
  Scale,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import type {
  ContactFinderReport,
  ParsedNumberIntelligence,
  PeopleSearchResponse,
  PhoneNumberRecord,
  SocialPlatformCategory,
} from '../shared/types.ts';
import { copyTextToClipboard } from '../utils/clipboard.ts';
import { formatDirectoryFullName } from '../utils/formatters.ts';
import type { FinderSubMode, FinderUrlState } from '../utils/urlState.ts';
import { PaginationBar } from './PaginationBar.tsx';

interface ContactFinderPanelProps {
  initialPhone?: string | null;
  finderUrlState?: FinderUrlState;
  onFinderUrlStateChange?: (next: FinderUrlState) => void;
  onClearInitialPhone?: () => void;
  onNewRecordsDiscovered?: () => void;
}

const PEOPLE_PAGE_SIZE = 500;
const ASSOCIATES_PAGE_SIZE = 10;
const MENTIONS_PAGE_SIZE = 10;
const BATCH_PAGE_SIZE = 50;

const SOCIAL_CATEGORY_TABS: Array<'All' | SocialPlatformCategory> = [
  'All',
  'Social',
  'Professional',
  'Creator & Media',
  'Messaging',
  'Payments',
  'Developer & Tech',
  'Community',
];

const US_STATE_OPTIONS: Array<{ code: string; name: string }> = [
  { code: 'AL', name: 'Alabama (AL)' },
  { code: 'AK', name: 'Alaska (AK)' },
  { code: 'AZ', name: 'Arizona (AZ)' },
  { code: 'AR', name: 'Arkansas (AR)' },
  { code: 'CA', name: 'California (CA)' },
  { code: 'CO', name: 'Colorado (CO)' },
  { code: 'CT', name: 'Connecticut (CT)' },
  { code: 'DE', name: 'Delaware (DE)' },
  { code: 'DC', name: 'District of Columbia (DC)' },
  { code: 'FL', name: 'Florida (FL)' },
  { code: 'GA', name: 'Georgia (GA)' },
  { code: 'HI', name: 'Hawaii (HI)' },
  { code: 'ID', name: 'Idaho (ID)' },
  { code: 'IL', name: 'Illinois (IL)' },
  { code: 'IN', name: 'Indiana (IN)' },
  { code: 'IA', name: 'Iowa (IA)' },
  { code: 'KS', name: 'Kansas (KS)' },
  { code: 'KY', name: 'Kentucky (KY)' },
  { code: 'LA', name: 'Louisiana (LA)' },
  { code: 'ME', name: 'Maine (ME)' },
  { code: 'MD', name: 'Maryland (MD)' },
  { code: 'MA', name: 'Massachusetts (MA)' },
  { code: 'MI', name: 'Michigan (MI)' },
  { code: 'MN', name: 'Minnesota (MN)' },
  { code: 'MS', name: 'Mississippi (MS)' },
  { code: 'MO', name: 'Missouri (MO)' },
  { code: 'MT', name: 'Montana (MT)' },
  { code: 'NE', name: 'Nebraska (NE)' },
  { code: 'NV', name: 'Nevada (NV)' },
  { code: 'NH', name: 'New Hampshire (NH)' },
  { code: 'NJ', name: 'New Jersey (NJ)' },
  { code: 'NM', name: 'New Mexico (NM)' },
  { code: 'NY', name: 'New York (NY)' },
  { code: 'NC', name: 'North Carolina (NC)' },
  { code: 'ND', name: 'North Dakota (ND)' },
  { code: 'OH', name: 'Ohio (OH)' },
  { code: 'OK', name: 'Oklahoma (OK)' },
  { code: 'OR', name: 'Oregon (OR)' },
  { code: 'PA', name: 'Pennsylvania (PA)' },
  { code: 'RI', name: 'Rhode Island (RI)' },
  { code: 'SC', name: 'South Carolina (SC)' },
  { code: 'SD', name: 'South Dakota (SD)' },
  { code: 'TN', name: 'Tennessee (TN)' },
  { code: 'TX', name: 'Texas (TX)' },
  { code: 'UT', name: 'Utah (UT)' },
  { code: 'VT', name: 'Vermont (VT)' },
  { code: 'VA', name: 'Virginia (VA)' },
  { code: 'WA', name: 'Washington (WA)' },
  { code: 'WV', name: 'West Virginia (WV)' },
  { code: 'WI', name: 'Wisconsin (WI)' },
  { code: 'WY', name: 'Wyoming (WY)' },
];

const GLOBAL_COUNTRY_OPTIONS: Array<{ iso2: string; label: string }> = [
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
  { iso2: 'SE', label: 'Sweden (+46)' },
  { iso2: 'NO', label: 'Norway (+47)' },
  { iso2: 'PL', label: 'Poland (+48)' },
  { iso2: 'IE', label: 'Ireland (+353)' },
  { iso2: 'PT', label: 'Portugal (+351)' },
  { iso2: 'AT', label: 'Austria (+43)' },
  { iso2: 'BE', label: 'Belgium (+32)' },
  { iso2: 'JP', label: 'Japan (+81)' },
  { iso2: 'IN', label: 'India (+91)' },
  { iso2: 'SG', label: 'Singapore (+65)' },
  { iso2: 'KR', label: 'South Korea (+82)' },
  { iso2: 'AE', label: 'United Arab Emirates (+971)' },
  { iso2: 'SA', label: 'Saudi Arabia (+966)' },
  { iso2: 'IL', label: 'Israel (+972)' },
  { iso2: 'PH', label: 'Philippines (+63)' },
  { iso2: 'ID', label: 'Indonesia (+62)' },
  { iso2: 'MY', label: 'Malaysia (+60)' },
  { iso2: 'TH', label: 'Thailand (+66)' },
  { iso2: 'BR', label: 'Brazil (+55)' },
  { iso2: 'AR', label: 'Argentina (+54)' },
  { iso2: 'CO', label: 'Colombia (+57)' },
  { iso2: 'CL', label: 'Chile (+56)' },
  { iso2: 'NG', label: 'Nigeria (+234)' },
  { iso2: 'ZA', label: 'South Africa (+27)' },
  { iso2: 'KE', label: 'Kenya (+254)' },
  { iso2: 'EG', label: 'Egypt (+20)' },
  { iso2: 'MA', label: 'Morocco (+212)' },
  { iso2: 'AU', label: 'Australia (+61)' },
  { iso2: 'NZ', label: 'New Zealand (+64)' },
];

export const ContactFinderPanel: React.FC<ContactFinderPanelProps> = ({
  initialPhone,
  finderUrlState,
  onFinderUrlStateChange,
  onClearInitialPhone,
  onNewRecordsDiscovered,
}) => {
  const [subMode, setSubModeState] = useState<FinderSubMode>(
    finderUrlState?.subMode ?? 'phone'
  );

  // Reverse Phone & Reverse Email Lookup State
  const [phoneInput, setPhoneInput] = useState(finderUrlState?.phoneQuery ?? '');
  const [emailInput, setEmailInput] = useState(finderUrlState?.emailQuery ?? '');
  const [defaultCountry, setDefaultCountry] = useState(
    finderUrlState?.country ?? 'US'
  );
  const [isLookingUpPhone, setIsLookingUpPhone] = useState(false);
  const [isLookingUpEmail, setIsLookingUpEmail] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [report, setReport] = useState<ContactFinderReport | null>(null);
  const [socialCategory, setSocialCategory] = useState<'All' | SocialPlatformCategory>('All');

  // Pagination inside Dossier
  const [associatesPage, setAssociatesPage] = useState(1);
  const [mentionsPage, setMentionsPage] = useState(1);

  // People & Location Finder State
  const [firstName, setFirstName] = useState(finderUrlState?.firstName ?? '');
  const [lastName, setLastName] = useState(finderUrlState?.lastName ?? '');
  const [city, setCity] = useState(finderUrlState?.city ?? '');
  const [stateCode, setStateCode] = useState(finderUrlState?.state ?? '');
  const [postalCode, setPostalCode] = useState(finderUrlState?.zip ?? '');
  const [peopleCountry, setPeopleCountry] = useState(finderUrlState?.country ?? 'US');
  const [isSearchingPeople, setIsSearchingPeople] = useState(false);
  const [peopleError, setPeopleError] = useState<string | null>(null);
  const [peopleResults, setPeopleResults] = useState<PhoneNumberRecord[]>([]);
  const [peopleDurationMs, setPeopleDurationMs] = useState<number | null>(null);
  const [peopleStatesCovered, setPeopleStatesCovered] = useState<number>(0);
  const [peopleQueryVariants, setPeopleQueryVariants] = useState<string[]>([]);
  const [peopleQuickFilter, setPeopleQuickFilter] = useState('');
  const [peopleStateQuickFilter, setPeopleStateQuickFilter] = useState('');
  const [hasSearchedPeople, setHasSearchedPeople] = useState(false);
  const [peoplePage, setPeoplePage] = useState(1);

  // Batch Existence Check State
  const [batchText, setBatchText] = useState('');
  const [batchCountry, setBatchCountry] = useState('US');
  const [isCheckingBatch, setIsCheckingBatch] = useState(false);
  const [batchResults, setBatchResults] = useState<ParsedNumberIntelligence[]>([]);
  const [batchPage, setBatchPage] = useState(1);

  // Clipboard feedback state
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const didBootUrlLookupRef = useRef(false);

  const emitUrlState = useCallback(
    (overrides?: Partial<FinderUrlState>) => {
      onFinderUrlStateChange?.({
        subMode,
        phoneQuery: phoneInput,
        emailQuery: emailInput,
        firstName,
        lastName,
        city,
        state: stateCode,
        zip: postalCode,
        country: subMode === 'people' ? peopleCountry : defaultCountry,
        ...overrides,
      });
    },
    [
      city,
      defaultCountry,
      emailInput,
      firstName,
      lastName,
      onFinderUrlStateChange,
      peopleCountry,
      phoneInput,
      postalCode,
      stateCode,
      subMode,
    ]
  );

  const setSubMode = (nextMode: FinderSubMode) => {
    setSubModeState(nextMode);
    emitUrlState({ subMode: nextMode });
  };

  const triggerCopy = async (token: string, value: string) => {
    if (!value) return;
    const ok = await copyTextToClipboard(value);
    if (ok) {
      setCopiedToken(token);
      setTimeout(() => {
        setCopiedToken((prev) => (prev === token ? null : prev));
      }, 1600);
    }
  };

  const runPhoneLookup = useCallback(
    async (targetNumber: string, countryHint?: string) => {
      const trimmed = targetNumber.trim();
      if (!trimmed) return;
      setSubModeState('phone');
      setPhoneInput(trimmed);
      setIsLookingUpPhone(true);
      setPhoneError(null);
      setEmailError(null);
      setAssociatesPage(1);
      setMentionsPage(1);
      setSocialCategory('All');

      onFinderUrlStateChange?.({
        subMode: 'phone',
        phoneQuery: trimmed,
        emailQuery: emailInput,
        firstName,
        lastName,
        city,
        state: stateCode,
        zip: postalCode,
        country: countryHint ?? defaultCountry,
      });

      try {
        const res = await fetch('/api/contact-finder/phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: trimmed,
            defaultCountry: countryHint ?? defaultCountry,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setPhoneError(data.error || 'Could not look up that phone number.');
        } else {
          const resolvedReport = data as ContactFinderReport;
          setReport(resolvedReport);
          if (resolvedReport.intel.e164) {
            onFinderUrlStateChange?.({
              subMode: 'phone',
              phoneQuery: resolvedReport.intel.e164,
              emailQuery: emailInput,
              firstName,
              lastName,
              city,
              state: stateCode,
              zip: postalCode,
              country: countryHint ?? defaultCountry,
            });
          }
          onNewRecordsDiscovered?.();
        }
      } catch {
        setPhoneError('Network error while running public contact lookup.');
      } finally {
        setIsLookingUpPhone(false);
      }
    },
    [
      city,
      defaultCountry,
      emailInput,
      firstName,
      lastName,
      onFinderUrlStateChange,
      onNewRecordsDiscovered,
      postalCode,
      stateCode,
    ]
  );

  const runEmailLookup = useCallback(
    async (targetEmail: string) => {
      const trimmed = targetEmail.trim().toLowerCase();
      if (!trimmed) return;
      setSubModeState('email');
      setEmailInput(trimmed);
      setIsLookingUpEmail(true);
      setEmailError(null);
      setPhoneError(null);
      setAssociatesPage(1);
      setMentionsPage(1);
      setSocialCategory('All');

      onFinderUrlStateChange?.({
        subMode: 'email',
        phoneQuery: phoneInput,
        emailQuery: trimmed,
        firstName,
        lastName,
        city,
        state: stateCode,
        zip: postalCode,
        country: defaultCountry,
      });

      try {
        const res = await fetch('/api/contact-finder/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) {
          setEmailError(data.error || 'Could not look up that email address.');
        } else {
          const resolvedReport = data as ContactFinderReport;
          setReport(resolvedReport);
          onNewRecordsDiscovered?.();
        }
      } catch {
        setEmailError('Network error while running reverse email lookup.');
      } finally {
        setIsLookingUpEmail(false);
      }
    },
    [
      city,
      defaultCountry,
      firstName,
      lastName,
      onFinderUrlStateChange,
      onNewRecordsDiscovered,
      phoneInput,
      postalCode,
      stateCode,
    ]
  );

  const executePeopleSearchRequest = useCallback(
    async (params: {
      firstName: string;
      lastName: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }) => {
      setIsSearchingPeople(true);
      setPeopleError(null);
      setHasSearchedPeople(true);
      setPeoplePage(1);
      setPeopleQuickFilter('');
      setPeopleStateQuickFilter('');

      try {
        const res = await fetch('/api/contact-finder/people', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: params.firstName.trim() || undefined,
            lastName: params.lastName.trim() || undefined,
            city: params.city.trim() || undefined,
            state: params.state.trim() || undefined,
            postalCode: params.postalCode.trim() || undefined,
            countryCode: params.country,
          }),
        });
        const data = (await res.json()) as Partial<PeopleSearchResponse> & { error?: string };
        if (!res.ok) {
          setPeopleError(data.error || 'Could not search public contact records.');
        } else {
          setPeopleResults(Array.isArray(data.items) ? data.items : []);
          setPeopleDurationMs(typeof data.durationMs === 'number' ? data.durationMs : null);
          setPeopleStatesCovered(typeof data.statesCovered === 'number' ? data.statesCovered : 0);
          setPeopleQueryVariants(
            Array.isArray(data.queryVariantsUsed) ? data.queryVariantsUsed : []
          );
          onNewRecordsDiscovered?.();
        }
      } catch {
        setPeopleError('Network error while searching public contact records.');
      } finally {
        setIsSearchingPeople(false);
      }
    },
    [onNewRecordsDiscovered]
  );

  // Automatically look up initialPhone when navigated from Directory, Harvester, or Inspector
  useEffect(() => {
    if (initialPhone && initialPhone.trim()) {
      runPhoneLookup(initialPhone.trim());
      onClearInitialPhone?.();
    }
  }, [initialPhone, onClearInitialPhone, runPhoneLookup]);

  // Execute deep-linked URL lookup on initial mount if URL contained a phone, email, or people search
  useEffect(() => {
    if (didBootUrlLookupRef.current) return;
    didBootUrlLookupRef.current = true;
    if (initialPhone && initialPhone.trim()) return;

    if (finderUrlState?.subMode === 'phone' && finderUrlState.phoneQuery.trim()) {
      runPhoneLookup(finderUrlState.phoneQuery.trim(), finderUrlState.country);
    } else if (finderUrlState?.subMode === 'email' && finderUrlState.emailQuery.trim()) {
      runEmailLookup(finderUrlState.emailQuery.trim());
    } else if (
      finderUrlState?.subMode === 'people' &&
      (finderUrlState.firstName.trim() ||
        finderUrlState.lastName.trim() ||
        finderUrlState.city.trim() ||
        finderUrlState.state.trim() ||
        finderUrlState.zip.trim())
    ) {
      executePeopleSearchRequest({
        firstName: finderUrlState.firstName,
        lastName: finderUrlState.lastName,
        city: finderUrlState.city,
        state: finderUrlState.state,
        postalCode: finderUrlState.zip,
        country: finderUrlState.country,
      });
    }
  }, [
    executePeopleSearchRequest,
    finderUrlState,
    initialPhone,
    runEmailLookup,
    runPhoneLookup,
  ]);

  const handlePeopleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    emitUrlState({
      subMode: 'people',
      firstName,
      lastName,
      city,
      state: stateCode,
      zip: postalCode,
      country: peopleCountry,
    });
    await executePeopleSearchRequest({
      firstName,
      lastName,
      city,
      state: stateCode,
      postalCode,
      country: peopleCountry,
    });
  };

  const handleBatchVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = batchText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    setIsCheckingBatch(true);
    setBatchPage(1);
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumbers: lines.slice(0, 500),
          defaultCountry: batchCountry,
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.results)) {
        setBatchResults(data.results as ParsedNumberIntelligence[]);
      }
    } catch {
      // Ignore transient failure
    } finally {
      setIsCheckingBatch(false);
    }
  };

  // Paginated slices
  const paginatedAssociates = useMemo(() => {
    if (!report) return [];
    const start = (associatesPage - 1) * ASSOCIATES_PAGE_SIZE;
    return report.associates.slice(start, start + ASSOCIATES_PAGE_SIZE);
  }, [report, associatesPage]);

  const paginatedMentions = useMemo(() => {
    if (!report) return [];
    const start = (mentionsPage - 1) * MENTIONS_PAGE_SIZE;
    return report.webMentions.slice(start, start + MENTIONS_PAGE_SIZE);
  }, [report, mentionsPage]);

  const availableResultStates = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of peopleResults) {
      if (r.regionCode) {
        counts.set(r.regionCode, (counts.get(r.regionCode) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [peopleResults]);

  const filteredPeopleResults = useMemo(() => {
    const q = peopleQuickFilter.trim().toLowerCase();
    return peopleResults.filter((rec) => {
      if (peopleStateQuickFilter && rec.regionCode !== peopleStateQuickFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        rec.ownerName,
        rec.city,
        rec.regionCode,
        rec.regionName,
        rec.postalCode,
        rec.county,
        rec.streetAddress,
        rec.organizationName,
        rec.ownerTitle,
        rec.e164,
        rec.nationalFormat,
        rec.estimatedAge ? `age ${rec.estimatedAge}` : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [peopleResults, peopleQuickFilter, peopleStateQuickFilter]);

  const paginatedPeople = useMemo(() => {
    const start = (peoplePage - 1) * PEOPLE_PAGE_SIZE;
    return filteredPeopleResults.slice(start, start + PEOPLE_PAGE_SIZE);
  }, [filteredPeopleResults, peoplePage]);

  const paginatedBatch = useMemo(() => {
    const start = (batchPage - 1) * BATCH_PAGE_SIZE;
    return batchResults.slice(start, start + BATCH_PAGE_SIZE);
  }, [batchResults, batchPage]);

  const filteredSocialProfiles = useMemo(() => {
    if (!report) return [];
    if (socialCategory === 'All') return report.socialProfiles;
    return report.socialProfiles.filter((sp) => sp.category === socialCategory);
  }, [report, socialCategory]);

  const isDossierMode = subMode === 'phone' || subMode === 'email';
  const isLookingUpDossier = isLookingUpPhone || isLookingUpEmail;
  const activeDossierError = subMode === 'email' ? emailError : phoneError;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-5 pb-16 md:pb-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Session Header & Mode Switcher */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-2xl">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">
              Worldwide Contact Finder &amp; US People Intelligence
            </h1>
            <p className="text-xs text-slate-600">
              Search by Phone Number, Email Address, or US First &amp; Last Name for full owner profile, exact DOB, 28+ social media accounts, last 10 addresses with county, career, vehicles, relatives, and public records.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setSubMode('phone')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subMode === 'phone'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reverse Phone
            </button>
            <button
              type="button"
              onClick={() => setSubMode('email')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subMode === 'email'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reverse Email
            </button>
            <button
              type="button"
              onClick={() => setSubMode('people')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subMode === 'people'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              First &amp; Last Name
            </button>
            <button
              type="button"
              onClick={() => setSubMode('batch')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subMode === 'batch'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verify List
            </button>
          </div>
        </div>

        {/* SUB-MODE 1 & 2: REVERSE PHONE OR REVERSE EMAIL LOOKUP FORM + SHARED FULL DOSSIER */}
        {isDossierMode && (
          <div className="space-y-4">
            {subMode === 'phone' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runPhoneLookup(phoneInput, defaultCountry);
                }}
                className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-6 lg:col-span-7 space-y-1">
                    <label
                      htmlFor="finder-phone-input"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Phone Number (US or Any Country Worldwide)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="finder-phone-input"
                        type="text"
                        inputMode="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="Enter any US or global phone number (e.g. +1 310... or +41 79...)"
                        className="w-full h-10 pl-9 pr-3 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3 lg:col-span-3 space-y-1">
                    <label
                      htmlFor="finder-country-select"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Default Country
                    </label>
                    <select
                      id="finder-country-select"
                      value={defaultCountry}
                      onChange={(e) => setDefaultCountry(e.target.value)}
                      className="w-full h-10 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      {GLOBAL_COUNTRY_OPTIONS.map((c) => (
                        <option key={c.iso2} value={c.iso2}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3 lg:col-span-2">
                    <button
                      type="submit"
                      disabled={isLookingUpDossier || !phoneInput.trim()}
                      className="w-full h-10 px-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{isLookingUpPhone ? 'Searching...' : 'Search'}</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runEmailLookup(emailInput);
                }}
                className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-9 lg:col-span-10 space-y-1">
                    <label
                      htmlFor="finder-email-input"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Email Address (Work, Personal, Academic, or Public Registry Email)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="finder-email-input"
                        type="email"
                        inputMode="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter any email address (e.g. robert.smith@gmail.com or dr.vance@hospital.org)"
                        className="w-full h-10 pl-9 pr-3 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3 lg:col-span-2">
                    <button
                      type="submit"
                      disabled={isLookingUpDossier || !emailInput.trim()}
                      className="w-full h-10 px-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{isLookingUpEmail ? 'Searching...' : 'Lookup Email'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeDossierError && (
              <div className="p-3.5 bg-white border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                {activeDossierError}
              </div>
            )}

            {isLookingUpDossier && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4 animate-pulse">
                <div className="h-5 w-64 bg-slate-200 rounded" />
                <div className="h-4 w-80 max-w-full bg-slate-100 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="h-36 bg-slate-100 rounded-lg" />
                  <div className="h-36 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-44 bg-slate-100 rounded-lg" />
              </div>
            )}

            {!isLookingUpDossier && report && (
              <div className="space-y-4">
                {/* 1. Existence & Verification Banner + Small Icon-Only Copy Buttons */}
                <div
                  className={`border rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    report.existenceStatus === 'CONFIRMED_PUBLIC_RECORD'
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : report.existenceStatus === 'VALID_ALLOCATED_EXCHANGE'
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                        : 'bg-rose-50/70 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 max-w-3xl">
                    {report.existenceStatus === 'CONFIRMED_PUBLIC_RECORD' ? (
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 shrink-0 mt-0.5" />
                    ) : report.existenceStatus === 'VALID_ALLOCATED_EXCHANGE' ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-rose-700 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold break-words">
                        {report.existenceStatus === 'INVALID_OR_UNASSIGNED'
                          ? report.queryEmail
                            ? `Invalid Email Format: ${report.queryEmail}`
                            : 'Invalid or Unassigned Number'
                          : report.queryEmail
                            ? `Resolved Profile for ${report.queryEmail}`
                            : 'Active Phone Line · Comprehensive Worldwide Dossier Ready'}
                      </div>
                      <p className="text-[11px] sm:text-xs opacity-90 break-words">
                        {report.existenceSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                    {report.primaryOwner?.name && (
                      <button
                        type="button"
                        onClick={() => triggerCopy('hero-name', report.primaryOwner!.name)}
                        title={report.primaryOwner.name}
                        aria-label="Owner full name"
                        className="h-8 px-2 inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md transition-colors shrink-0 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-700" />
                        {copiedToken === 'hero-name' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    )}

                    {report.intel.e164 && (
                      <button
                        type="button"
                        onClick={() => triggerCopy('hero-phone', report.intel.e164!)}
                        title={report.intel.internationalFormat ?? report.intel.e164}
                        aria-label="Phone number"
                        className="h-8 px-2 inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shrink-0 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-300" />
                        {copiedToken === 'hero-phone' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {report.primaryOwner && (
                  <>
                    {/* 2. Top Two-Column Dossier: Individual Identity & Exact DOB + Telecom Network & Lines */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                      {/* Left Card: Owner Identity, Exact Date of Birth, Aliases, Education & Licenses */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-sky-700 shrink-0" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                              Individual Identity, Exact DOB &amp; Credentials
                            </h2>
                          </div>
                          <span className="text-[11px] font-mono tabular-nums text-slate-400 shrink-0">
                            {report.lookupDurationMs} ms
                          </span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => triggerCopy('card-owner-name', report.primaryOwner!.name)}
                                title={report.primaryOwner.name}
                                className="text-base sm:text-lg font-semibold text-slate-900 hover:text-sky-700 text-left break-words cursor-pointer"
                              >
                                {report.primaryOwner.name}
                              </button>
                              <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                                {report.primaryOwner.age !== null && (
                                  <span className="font-semibold text-slate-800">
                                    Age {report.primaryOwner.age}
                                  </span>
                                )}
                                {report.primaryOwner.dateOfBirth && (
                                  <span className="inline-flex items-center gap-1 font-medium text-sky-900 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                                    <Cake className="w-3 h-3 text-sky-700 shrink-0" />
                                    <span>DOB: {report.primaryOwner.dateOfBirth}</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        triggerCopy('dob-pill', report.primaryOwner!.dateOfBirth!)
                                      }
                                      title={report.primaryOwner.dateOfBirth}
                                      aria-label="Date of birth"
                                      className="ml-0.5 inline-flex items-center justify-center text-sky-700 hover:text-sky-950 cursor-pointer"
                                    >
                                      {copiedToken === 'dob-pill' ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </span>
                                )}
                              </div>
                              {(report.primaryOwner.jobTitle || report.primaryOwner.employer) && (
                                <div className="text-xs text-slate-600 mt-1 break-words">
                                  {report.primaryOwner.jobTitle && (
                                    <span className="font-medium text-sky-800">
                                      {report.primaryOwner.jobTitle}
                                    </span>
                                  )}
                                  {report.primaryOwner.employer && (
                                    <span> at {report.primaryOwner.employer}</span>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => triggerCopy('card-owner-name', report.primaryOwner!.name)}
                              title={report.primaryOwner.name}
                              aria-label="Owner name"
                              className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded transition-colors shrink-0 cursor-pointer"
                            >
                              {copiedToken === 'card-owner-name' ? (
                                <Check className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <dl className="divide-y divide-slate-100 border-t border-b border-slate-200">
                            {report.primaryOwner.dateOfBirth && (
                              <div className="py-2 flex items-start justify-between gap-3">
                                <dt className="text-slate-500 shrink-0">Exact Date of Birth</dt>
                                <dd className="text-slate-900 font-semibold text-right min-w-0 break-words">
                                  {report.primaryOwner.dateOfBirth}
                                  {report.primaryOwner.dateOfBirthIso ? (
                                    <span className="ml-1.5 font-mono text-[11px] font-normal text-slate-500">
                                      ({report.primaryOwner.dateOfBirthIso})
                                    </span>
                                  ) : null}
                                </dd>
                              </div>
                            )}
                            {(report.primaryOwner.zodiacSign || report.primaryOwner.birthPlace) && (
                              <div className="py-2 flex items-start justify-between gap-3">
                                <dt className="text-slate-500 shrink-0">Birth Sign &amp; Origin</dt>
                                <dd className="text-slate-800 text-right min-w-0 break-words">
                                  {[report.primaryOwner.zodiacSign, report.primaryOwner.birthPlace]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </dd>
                              </div>
                            )}
                            {report.primaryOwner.aliases.length > 0 && (
                              <div className="py-2 flex items-start justify-between gap-3">
                                <dt className="text-slate-500 shrink-0">Known Aliases</dt>
                                <dd className="text-slate-900 font-medium text-right min-w-0 break-words">
                                  {report.primaryOwner.aliases.join(' · ')}
                                </dd>
                              </div>
                            )}
                            {report.primaryOwner.employer && (
                              <div className="py-2 flex items-start justify-between gap-3">
                                <dt className="text-slate-500 shrink-0">Current Employer</dt>
                                <dd className="font-semibold text-slate-900 text-right min-w-0 break-words">
                                  {report.primaryOwner.employer}
                                </dd>
                              </div>
                            )}
                            {report.primaryOwner.jobTitle && (
                              <div className="py-2 flex items-start justify-between gap-3">
                                <dt className="text-slate-500 shrink-0">Current Job Title</dt>
                                <dd className="font-medium text-slate-900 text-right min-w-0 break-words">
                                  {report.primaryOwner.jobTitle}
                                </dd>
                              </div>
                            )}
                            {report.educationHistory.map((edu, idx) => (
                              <div key={idx} className="py-2 flex items-start justify-between gap-3">
                                <dt className="text-slate-500 inline-flex items-center gap-1.5 shrink-0">
                                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Education</span>
                                </dt>
                                <dd className="text-slate-900 text-right min-w-0 break-words">
                                  {edu.degreeOrCredential} · {edu.institution} ({edu.graduationYear})
                                </dd>
                              </div>
                            ))}
                            {report.professionalLicenses.map((lic, idx) => (
                              <div key={idx} className="py-2 flex items-start justify-between gap-3">
                                <dt className="text-slate-500 inline-flex items-center gap-1.5 shrink-0">
                                  <Award className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{lic.licenseType}</span>
                                </dt>
                                <dd className="font-mono tabular-nums text-slate-900 text-right min-w-0 break-words">
                                  {lic.licenseNumber} ({lic.status})
                                </dd>
                              </div>
                            ))}
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Primary Source</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.primaryOwner.verificationSource}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      {/* Right Card: Telecom Carrier, Line Classification & Associated Phone Numbers */}
                      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-sky-700" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                              Carrier Network &amp; Associated Lines
                            </h2>
                          </div>
                          <span className="text-xs font-mono tabular-nums text-slate-600">
                            {report.intel.e164 ?? report.queryPhone}
                          </span>
                        </div>

                        <dl className="divide-y divide-slate-100 border-t border-b border-slate-200 text-xs">
                          <div className="py-2 flex items-center justify-between gap-3">
                            <dt className="text-slate-500 shrink-0">Intl / Local</dt>
                            <dd className="font-mono tabular-nums font-semibold text-slate-900 text-right">
                              {report.intel.internationalFormat ?? '—'} ·{' '}
                              {report.intel.nationalFormat ?? '—'}
                            </dd>
                          </div>
                          <div className="py-2 flex items-center justify-between gap-3">
                            <dt className="text-slate-500 shrink-0">Carrier Operator</dt>
                            <dd className="font-semibold text-slate-900 text-right">
                              {report.intel.carrierName}
                            </dd>
                          </div>
                          <div className="py-2 flex items-center justify-between gap-3">
                            <dt className="text-slate-500 shrink-0">Line Type</dt>
                            <dd className="font-medium text-slate-900">{report.intel.lineType}</dd>
                          </div>
                          <div className="py-2 flex items-center justify-between gap-3">
                            <dt className="text-slate-500 shrink-0">Exchange Prefix</dt>
                            <dd className="font-mono tabular-nums text-slate-900">
                              {report.intel.callingCode ? `+${report.intel.callingCode}` : ''}{' '}
                              {report.intel.ndcPrefix ?? '—'}
                            </dd>
                          </div>
                          <div className="py-2 flex items-center justify-between gap-3">
                            <dt className="text-slate-500 shrink-0">Country &amp; Regulator</dt>
                            <dd className="text-slate-800 text-right">
                              {report.intel.countryName ?? 'Unknown'}
                              {report.intel.regulatoryAuthority
                                ? ` (${report.intel.regulatoryAuthority})`
                                : ''}
                            </dd>
                          </div>
                        </dl>

                        {report.associatedPhones.length > 0 && (
                          <div className="space-y-1.5 pt-0.5">
                            <div className="text-xs font-semibold text-slate-700">
                              Associated Phone Lines ({report.associatedPhones.length})
                            </div>
                            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                              {report.associatedPhones.map((ph) => {
                                const tok = `assoc-ph-${ph.e164}`;
                                return (
                                  <div
                                    key={ph.e164}
                                    className="px-3 py-2 flex items-center justify-between gap-2 text-xs hover:bg-slate-50"
                                  >
                                    <div className="min-w-0 truncate">
                                      <button
                                        type="button"
                                        onClick={() => runPhoneLookup(ph.e164)}
                                        className="font-mono tabular-nums font-semibold text-slate-900 hover:text-sky-700 cursor-pointer"
                                      >
                                        {ph.display}
                                      </button>
                                      <span className="text-slate-500 ml-2 text-[11px]">
                                        {ph.label} · {ph.carrier} · {ph.lineType}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(tok, ph.e164)}
                                      title={ph.e164}
                                      aria-label={ph.e164}
                                      className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded transition-colors shrink-0 cursor-pointer"
                                    >
                                      {copiedToken === tok ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. Job Title, Employer & Employment History */}
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-sky-700" />
                          <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                            Job Title, Employer &amp; Career History ({report.employmentHistory.length})
                          </h2>
                        </div>
                        <span className="text-[11px] text-slate-500 hidden sm:inline">
                          Current &amp; Prior Roles
                        </span>
                      </div>

                      {/* Desktop Table (md+) & Mobile Cards (< md) for Career History */}
                      <div className="md:hidden divide-y divide-slate-100">
                        {report.employmentHistory.map((emp, idx) => {
                          const tok = `emp-${idx}`;
                          return (
                            <div key={idx} className="p-3.5 space-y-1 text-xs">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900 break-words">
                                    {emp.jobTitle}
                                    {emp.status === 'Current' && (
                                      <span className="ml-1.5 text-[11px] font-medium text-emerald-700">
                                        · Current
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-medium text-sky-800 break-words">
                                    {emp.employer}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    triggerCopy(tok, `${emp.jobTitle} at ${emp.employer}`)
                                  }
                                  title={`${emp.jobTitle} at ${emp.employer}`}
                                  aria-label={`${emp.jobTitle} at ${emp.employer}`}
                                  className="w-6 h-6 inline-flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                >
                                  {copiedToken === tok ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                              <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-2">
                                <span className="font-mono tabular-nums font-medium text-slate-700">
                                  {emp.years}
                                </span>
                                <span>·</span>
                                <span>{emp.location}</span>
                                <span>·</span>
                                <span>{emp.departmentOrSpecialty}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                            <tr>
                              <th className="py-2 px-3.5 font-semibold">Job Title</th>
                              <th className="py-2 px-3.5 font-semibold">Employer / Organization</th>
                              <th className="py-2 px-3.5 font-semibold hidden lg:table-cell">Department / Industry</th>
                              <th className="py-2 px-3.5 font-semibold">Tenure</th>
                              <th className="py-2 px-3.5 font-semibold">Location</th>
                              <th className="py-2 px-3 font-semibold w-9 text-right">
                                <span className="sr-only">Action</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {report.employmentHistory.map((emp, idx) => {
                              const tok = `emp-${idx}`;
                              return (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="py-2 px-3.5 font-semibold text-slate-900">
                                    {emp.jobTitle}
                                    {emp.status === 'Current' && (
                                      <span className="ml-1.5 text-[11px] font-medium text-emerald-700">
                                        · Current
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3.5 font-medium text-slate-900">
                                    {emp.employer}
                                  </td>
                                  <td className="py-2 px-3.5 text-slate-600 hidden lg:table-cell">
                                    {emp.departmentOrSpecialty} · {emp.industry}
                                  </td>
                                  <td className="py-2 px-3.5 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                                    {emp.years}
                                  </td>
                                  <td className="py-2 px-3.5 text-slate-600 whitespace-nowrap">
                                    {emp.location}
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        triggerCopy(tok, `${emp.jobTitle} at ${emp.employer}`)
                                      }
                                      title={`${emp.jobTitle} at ${emp.employer}`}
                                      aria-label={`${emp.jobTitle} at ${emp.employer}`}
                                      className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded transition-colors cursor-pointer"
                                    >
                                      {copiedToken === tok ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 4. Email Addresses + Property & Residence Intelligence */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                      {/* Left: Email Addresses (Click Email to Pivot or Icon to Copy) */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-sky-700 shrink-0" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                              Email Addresses ({report.emails.length})
                            </h2>
                          </div>
                          {report.emails.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                triggerCopy(
                                  'copy-all-emails',
                                  report.emails.map((e) => e.address).join('\n')
                                )
                              }
                              title={`All ${report.emails.length} email addresses`}
                              aria-label="All email addresses"
                              className="w-7 h-7 inline-flex items-center justify-center text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors cursor-pointer"
                            >
                              {copiedToken === 'copy-all-emails' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-sky-700" />
                              )}
                            </button>
                          )}
                        </div>

                        <div className="divide-y divide-slate-100 border-t border-b border-slate-200">
                          {report.emails.map((em, idx) => {
                            const tok = `email-${idx}`;
                            return (
                              <div
                                key={em.address}
                                className="py-2.5 flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="min-w-0 flex-1">
                                  <button
                                    type="button"
                                    onClick={() => triggerCopy(tok, em.address)}
                                    className="font-mono font-semibold text-slate-900 hover:text-sky-700 break-all text-left cursor-pointer"
                                  >
                                    {em.address}
                                  </button>
                                  <div className="text-[11px] text-slate-500 break-words">
                                    {em.type} · {em.confidenceNote}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => runEmailLookup(em.address)}
                                    title={`Reverse lookup ${em.address}`}
                                    aria-label={`Reverse lookup ${em.address}`}
                                    className="w-6 h-6 inline-flex items-center justify-center text-sky-700 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors cursor-pointer"
                                  >
                                    <Search className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => triggerCopy(tok, em.address)}
                                    title={em.address}
                                    aria-label={em.address}
                                    className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded transition-colors cursor-pointer"
                                  >
                                    {copiedToken === tok ? (
                                      <Check className="w-3 h-3 text-emerald-700" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Property, Home Value & Neighborhood Intelligence */}
                      {report.propertyProfile && (
                        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3.5">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <Home className="w-4 h-4 text-sky-700 shrink-0" />
                              <h2 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                                Property, Residence &amp; Local Intelligence
                              </h2>
                            </div>
                            <span className="text-[11px] text-slate-500 shrink-0">
                              {report.propertyProfile.ownershipStatus}
                            </span>
                          </div>

                          <dl className="divide-y divide-slate-100 border-t border-b border-slate-200 text-xs">
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Property Type</dt>
                              <dd className="font-semibold text-slate-900 text-right min-w-0 break-words">
                                {report.propertyProfile.propertyType}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Estimated Value</dt>
                              <dd className="font-mono tabular-nums font-semibold text-emerald-800 text-right">
                                {report.propertyProfile.estimatedValue}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Size &amp; Year Built</dt>
                              <dd className="font-mono tabular-nums text-slate-900 text-right">
                                {report.propertyProfile.livingAreaSqFt} · Built{' '}
                                {report.propertyProfile.yearBuilt}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Residence Length</dt>
                              <dd className="text-slate-900 font-medium text-right">
                                {report.propertyProfile.lengthOfResidence}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">County / District</dt>
                              <dd className="text-slate-900 text-right min-w-0 break-words">
                                {report.propertyProfile.countyOrDistrict}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Local Timezone</dt>
                              <dd className="font-mono text-slate-800 text-right min-w-0 break-words">
                                {report.propertyProfile.localTimezone}
                              </dd>
                            </div>
                            {report.propertyProfile.coordinates && (
                              <div className="py-2 flex items-start justify-between gap-3">
                                <dt className="text-slate-500 shrink-0">Geo Coordinates</dt>
                                <dd className="font-mono tabular-nums text-slate-800 text-right">
                                  {report.propertyProfile.coordinates}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )}
                    </div>

                    {/* 4B. ALL SOCIAL MEDIA & DIGITAL ACCOUNTS DIRECTORY (28+ PLATFORMS) */}
                    {report.socialProfiles.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-3.5 sm:px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Share2 className="w-4 h-4 text-sky-700 shrink-0" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                              All Social Media &amp; Digital Profiles ({report.socialProfiles.length})
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              triggerCopy(
                                'copy-all-socials',
                                report.socialProfiles
                                  .map((s) => `${s.platform}: ${s.handle} (${s.url})`)
                                  .join('\n')
                              )
                            }
                            title={`All ${report.socialProfiles.length} social handles`}
                            aria-label="All social handles"
                            className="w-7 h-7 inline-flex items-center justify-center text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors shrink-0 cursor-pointer"
                          >
                            {copiedToken === 'copy-all-socials' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-sky-700" />
                            )}
                          </button>
                        </div>

                        <div className="px-3.5 sm:px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
                          {SOCIAL_CATEGORY_TABS.map((cat) => {
                            const active = socialCategory === cat;
                            const count =
                              cat === 'All'
                                ? report.socialProfiles.length
                                : report.socialProfiles.filter((sp) => sp.category === cat).length;
                            if (cat !== 'All' && count === 0) return null;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setSocialCategory(cat)}
                                className={`px-2.5 py-1 text-[11px] font-medium rounded border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                                  active
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                              >
                                {cat} ({count})
                              </button>
                            );
                          })}
                        </div>

                        <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {filteredSocialProfiles.map((sp, idx) => {
                            const spTok = `social-${sp.platform}-${idx}`;
                            return (
                              <div
                                key={`${sp.platform}-${sp.url}-${idx}`}
                                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors flex items-start justify-between gap-2 text-xs"
                              >
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-slate-900">
                                      {sp.platform}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-500">
                                      · {sp.category}
                                    </span>
                                    <span
                                      className={`text-[10px] font-semibold ${
                                        sp.verified || sp.status === 'Verified Web Match'
                                          ? 'text-emerald-700'
                                          : sp.status === 'Active Handle Matched'
                                            ? 'text-sky-700'
                                            : 'text-slate-500'
                                      }`}
                                    >
                                      · {sp.status}
                                    </span>
                                  </div>

                                  <div className="font-mono text-[11px] text-slate-700 truncate">
                                    {sp.handle}
                                  </div>

                                  <a
                                    href={sp.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-medium text-sky-800 hover:text-sky-950 hover:underline inline-flex items-center gap-1 max-w-full"
                                  >
                                    <span className="truncate">{sp.label}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => triggerCopy(spTok, `${sp.handle} — ${sp.url}`)}
                                  title={`${sp.platform}: ${sp.handle}`}
                                  aria-label={`${sp.platform} handle`}
                                  className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-white hover:bg-sky-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                >
                                  {copiedToken === spTok ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 5. LAST 10 ADDRESSES — Complete Chronological Address History with Dedicated County Column */}
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                          <h2 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            Last {report.addresses.length} Addresses — Residence Timeline
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              'copy-all-addresses',
                              report.addresses
                                .map(
                                  (a) =>
                                    `${String(a.index).padStart(2, '0')}. ${a.street}${
                                      a.unit ? `, ${a.unit}` : ''
                                    }, ${a.city}, ${a.state} ${a.postalCode}${
                                      a.county ? ` — ${a.county}` : ''
                                    } (${a.yearsActive})`
                                )
                                .join('\n')
                            )
                          }
                          title={`All ${report.addresses.length} addresses`}
                          aria-label="All addresses"
                          className="w-7 h-7 inline-flex items-center justify-center text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors shrink-0 cursor-pointer"
                        >
                          {copiedToken === 'copy-all-addresses' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-sky-700" />
                          )}
                        </button>
                      </div>

                      {/* Mobile Cards (< md) for Last 10 Addresses (With Prominent County) */}
                      <div className="md:hidden divide-y divide-slate-100">
                        {report.addresses.map((addr) => {
                          const fullLine = `${addr.street}${
                            addr.unit ? `, ${addr.unit}` : ''
                          }, ${addr.city}, ${addr.state} ${addr.postalCode}${
                            addr.county ? `, ${addr.county}` : ''
                          }, ${addr.country}`;
                          const tok = `addr-row-${addr.index}`;
                          return (
                            <div key={addr.index} className="p-3.5 space-y-1 text-xs">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono tabular-nums text-slate-400">
                                      #{String(addr.index).padStart(2, '0')}
                                    </span>
                                    <span
                                      className={`font-semibold ${
                                        addr.index === 1 ? 'text-emerald-800' : 'text-sky-800'
                                      }`}
                                    >
                                      {addr.label}
                                    </span>
                                    <span className="font-mono tabular-nums text-[11px] text-slate-500">
                                      · {addr.yearsActive}
                                    </span>
                                  </div>
                                  <div className="font-semibold text-slate-900 mt-0.5 break-words">
                                    {addr.street}
                                    {addr.unit ? `, ${addr.unit}` : ''}
                                  </div>
                                  <div className="text-slate-700">
                                    {addr.city}, {addr.state}{' '}
                                    <span className="font-mono tabular-nums font-medium text-sky-800">
                                      {addr.postalCode}
                                    </span>{' '}
                                    <span className="text-slate-400">· {addr.country}</span>
                                  </div>
                                  {addr.county && (
                                    <div className="text-[11px] font-medium text-slate-800 mt-0.5">
                                      County: {addr.county}
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => triggerCopy(tok, fullLine)}
                                  title={fullLine}
                                  aria-label={fullLine}
                                  className="w-6 h-6 inline-flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                >
                                  {copiedToken === tok ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop Table (md+) */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                            <tr>
                              <th className="py-2 px-3 font-semibold w-10">#</th>
                              <th className="py-2 px-3.5 font-semibold">Street Address &amp; Unit</th>
                              <th className="py-2 px-3.5 font-semibold">City, State &amp; ZIP</th>
                              <th className="py-2 px-3.5 font-semibold">County</th>
                              <th className="py-2 px-3.5 font-semibold hidden lg:table-cell">Classification</th>
                              <th className="py-2 px-3.5 font-semibold">Years</th>
                              <th className="py-2 px-3 font-semibold w-9 text-right">
                                <span className="sr-only">Action</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {report.addresses.map((addr) => {
                              const fullLine = `${addr.street}${
                                addr.unit ? `, ${addr.unit}` : ''
                              }, ${addr.city}, ${addr.state} ${addr.postalCode}${
                                addr.county ? `, ${addr.county}` : ''
                              }, ${addr.country}`;
                              const tok = `addr-row-${addr.index}`;
                              return (
                                <tr key={addr.index} className="hover:bg-slate-50">
                                  <td className="py-2 px-3 font-mono tabular-nums text-slate-500">
                                    {String(addr.index).padStart(2, '0')}
                                  </td>
                                  <td className="py-2 px-3.5 font-semibold text-slate-900 whitespace-nowrap">
                                    {addr.street}
                                    {addr.unit ? `, ${addr.unit}` : ''}
                                  </td>
                                  <td className="py-2 px-3.5 text-slate-800 whitespace-nowrap">
                                    {addr.city}, {addr.state}{' '}
                                    <span className="font-mono tabular-nums font-medium text-sky-800">
                                      {addr.postalCode}
                                    </span>{' '}
                                    <span className="text-slate-400">· {addr.country}</span>
                                  </td>
                                  <td className="py-2 px-3.5 font-medium text-slate-800 whitespace-nowrap">
                                    {addr.county || '—'}
                                  </td>
                                  <td className="py-2 px-3.5 text-slate-600 hidden lg:table-cell whitespace-nowrap">
                                    {addr.index === 1 ? (
                                      <span className="font-semibold text-emerald-800">
                                        {addr.label}
                                      </span>
                                    ) : (
                                      <span>{addr.label}</span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3.5 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                                    {addr.yearsActive}
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(tok, fullLine)}
                                      title={fullLine}
                                      aria-label={fullLine}
                                      className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded transition-colors cursor-pointer"
                                    >
                                      {copiedToken === tok ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 6. CARS & VEHICLES OWNED */}
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-sky-700" />
                          <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                            Cars &amp; Vehicles Owned ({report.vehiclesOwned.length})
                          </h2>
                        </div>
                        <span className="text-[11px] text-slate-500 hidden sm:inline">
                          ISO 3779 WMI VIN &amp; Make/Model Index
                        </span>
                      </div>

                      {/* Mobile Cards (< md) for Vehicles Owned */}
                      <div className="md:hidden divide-y divide-slate-100">
                        {report.vehiclesOwned.map((veh, idx) => {
                          const tok = `veh-${idx}`;
                          const vehSummary = `${veh.year} ${veh.make} ${veh.model} (${veh.bodyStyle}) — VIN ${veh.vinMasked} [${veh.registrationState}]`;
                          return (
                            <div key={idx} className="p-3.5 space-y-1 text-xs">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900">
                                    <span className="font-mono tabular-nums">{veh.year}</span>{' '}
                                    {veh.make} {veh.model}
                                  </div>
                                  <div className="text-[11px] text-slate-600">
                                    {veh.bodyStyle} · {veh.registrationState} ·{' '}
                                    <span
                                      className={
                                        veh.status === 'Active Registration'
                                          ? 'font-medium text-emerald-700'
                                          : 'text-slate-500'
                                      }
                                    >
                                      {veh.status}
                                    </span>
                                  </div>
                                  <div className="font-mono text-[11px] text-slate-700 mt-0.5">
                                    VIN: {veh.vinMasked}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => triggerCopy(tok, vehSummary)}
                                  title={vehSummary}
                                  aria-label={vehSummary}
                                  className="w-6 h-6 inline-flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                >
                                  {copiedToken === tok ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop Table (md+) */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                            <tr>
                              <th className="py-2 px-3.5 font-semibold">Year, Make &amp; Model</th>
                              <th className="py-2 px-3.5 font-semibold">Body Style</th>
                              <th className="py-2 px-3.5 font-semibold">VIN (ISO 3779)</th>
                              <th className="py-2 px-3.5 font-semibold">Region</th>
                              <th className="py-2 px-3.5 font-semibold">Status</th>
                              <th className="py-2 px-3 font-semibold w-9 text-right">
                                <span className="sr-only">Action</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {report.vehiclesOwned.map((veh, idx) => {
                              const tok = `veh-${idx}`;
                              const vehSummary = `${veh.year} ${veh.make} ${veh.model} (${veh.bodyStyle}) — VIN ${veh.vinMasked} [${veh.registrationState}]`;
                              return (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="py-2 px-3.5 font-semibold text-slate-900">
                                    <span className="font-mono tabular-nums">{veh.year}</span>{' '}
                                    {veh.make} {veh.model}
                                  </td>
                                  <td className="py-2 px-3.5 text-slate-700">
                                    {veh.bodyStyle}
                                  </td>
                                  <td className="py-2 px-3.5 font-mono tabular-nums text-slate-800">
                                    {veh.vinMasked}
                                  </td>
                                  <td className="py-2 px-3.5 font-mono text-slate-700">
                                    {veh.registrationState}
                                  </td>
                                  <td className="py-2 px-3.5 text-slate-600">
                                    <span
                                      className={
                                        veh.status === 'Active Registration'
                                          ? 'font-medium text-emerald-700'
                                          : 'text-slate-500'
                                      }
                                    >
                                      {veh.status}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(tok, vehSummary)}
                                      title={vehSummary}
                                      aria-label={vehSummary}
                                      className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded transition-colors cursor-pointer"
                                    >
                                      {copiedToken === tok ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 7. RELATIVES & HOUSEHOLD MEMBERS (Small Icon-Only Copy Buttons + Pivot Report) */}
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Users className="w-4 h-4 text-sky-700 shrink-0" />
                          <h2 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            Relatives &amp; Household Members ({report.relatives.length})
                          </h2>
                        </div>

                        {report.relatives.length > 0 && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                triggerCopy(
                                  'copy-rel-names',
                                  report.relatives.map((r) => r.name).join('\n')
                                )
                              }
                              title={`Relative names (${report.relatives.length})`}
                              aria-label="Relative names"
                              className="h-7 px-2 inline-flex items-center justify-center gap-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
                            >
                              <User className="w-3 h-3 text-slate-600" />
                              {copiedToken === 'copy-rel-names' ? (
                                <Check className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-500" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                triggerCopy(
                                  'copy-rel-numbers',
                                  report.relatives.map((r) => r.phoneE164).join('\n')
                                )
                              }
                              title={`Relative phone numbers (${report.relatives.length})`}
                              aria-label="Relative phone numbers"
                              className="h-7 px-2 inline-flex items-center justify-center gap-1 text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors cursor-pointer"
                            >
                              <Phone className="w-3 h-3 text-sky-700" />
                              {copiedToken === 'copy-rel-numbers' ? (
                                <Check className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <Copy className="w-3 h-3 text-sky-600" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Mobile Cards (< md) for Relatives & Household Members */}
                      <div className="md:hidden divide-y divide-slate-100">
                        {report.relatives.map((rel, idx) => {
                          const nameTok = `rel-name-${idx}`;
                          const phoneTok = `rel-phone-${idx}`;
                          return (
                            <div key={`${rel.phoneE164}-${idx}`} className="p-3.5 space-y-1.5 text-xs">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-900 break-words">
                                      {rel.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(nameTok, rel.name)}
                                      title={rel.name}
                                      aria-label={rel.name}
                                      className="w-6 h-6 inline-flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                    >
                                      {copiedToken === nameTok ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                  <div className="text-[11px] text-sky-800 font-medium mt-0.5">
                                    {rel.relationship} · Age {rel.age}
                                    {rel.dateOfBirth ? ` (DOB: ${rel.dateOfBirth})` : ''}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => runPhoneLookup(rel.phoneE164)}
                                  className="px-2 py-1 text-[11px] font-medium text-sky-800 bg-sky-50 border border-sky-200 rounded shrink-0 cursor-pointer"
                                >
                                  Report
                                </button>
                              </div>

                              <div className="flex items-center justify-between gap-2 text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono tabular-nums font-medium text-slate-900">
                                    {rel.phoneDisplay}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => triggerCopy(phoneTok, rel.phoneE164)}
                                    title={rel.phoneE164}
                                    aria-label={rel.phoneE164}
                                    className="w-6 h-6 inline-flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                  >
                                    {copiedToken === phoneTok ? (
                                      <Check className="w-3 h-3 text-emerald-700" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                                <span className="text-slate-500 truncate">{rel.cityState}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop Table (md+) */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                            <tr>
                              <th className="py-2 px-3.5 font-semibold">Full Name</th>
                              <th className="py-2 px-3 font-semibold">Age &amp; DOB</th>
                              <th className="py-2 px-3.5 font-semibold">Relationship</th>
                              <th className="py-2 px-3.5 font-semibold">Phone Number</th>
                              <th className="py-2 px-3.5 font-semibold">City &amp; Region</th>
                              <th className="py-2 px-3.5 font-semibold text-right">Dossier</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {report.relatives.map((rel, idx) => {
                              const nameTok = `rel-name-${idx}`;
                              const phoneTok = `rel-phone-${idx}`;
                              return (
                                <tr key={`${rel.phoneE164}-${idx}`} className="hover:bg-slate-50">
                                  <td className="py-2 px-3.5">
                                    <div className="flex items-center justify-between gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => triggerCopy(nameTok, rel.name)}
                                        title={rel.name}
                                        className="font-semibold text-slate-900 hover:text-sky-700 text-left cursor-pointer"
                                      >
                                        {rel.name}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => triggerCopy(nameTok, rel.name)}
                                        title={rel.name}
                                        aria-label={rel.name}
                                        className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                      >
                                        {copiedToken === nameTok ? (
                                          <Check className="w-3 h-3 text-emerald-700" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                                    <span className="font-mono tabular-nums font-medium text-slate-900">
                                      {rel.age}
                                    </span>
                                    {rel.dateOfBirth ? (
                                      <div className="text-[11px] text-slate-500">
                                        {rel.dateOfBirth}
                                      </div>
                                    ) : null}
                                  </td>
                                  <td className="py-2 px-3.5 text-sky-800 font-medium">
                                    {rel.relationship}
                                  </td>
                                  <td className="py-2 px-3.5">
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => triggerCopy(phoneTok, rel.phoneE164)}
                                        title={rel.phoneE164}
                                        className="font-mono tabular-nums font-medium text-slate-900 hover:text-sky-700 whitespace-nowrap cursor-pointer"
                                      >
                                        {rel.phoneDisplay}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => triggerCopy(phoneTok, rel.phoneE164)}
                                        title={rel.phoneE164}
                                        aria-label={rel.phoneE164}
                                        className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                      >
                                        {copiedToken === phoneTok ? (
                                          <Check className="w-3 h-3 text-emerald-700" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3.5 text-slate-600">
                                    {rel.cityState}
                                  </td>
                                  <td className="py-2 px-3.5 text-right">
                                    <button
                                      type="button"
                                      onClick={() => runPhoneLookup(rel.phoneE164)}
                                      className="px-2 py-1 text-[11px] font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                      Report
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 7B. EXTENDED PUBLIC INTELLIGENCE, ASSETS, COURT, EXPOSURE & DONORS (SPICY INTEL) */}
                    {report.spicyIntel && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                        {/* Financial, Income, Deed & Equity */}
                        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3">
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                            <DollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                              Financial, Income, Deed &amp; Equity Profile
                            </h2>
                          </div>
                          <dl className="divide-y divide-slate-100 text-xs">
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Est. Annual Income</dt>
                              <dd className="font-mono font-semibold text-slate-900 text-right">
                                {report.spicyIntel.financialAndProperty.estimatedAnnualIncome}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Estimated Net Worth</dt>
                              <dd className="font-mono font-semibold text-emerald-800 text-right">
                                {report.spicyIntel.financialAndProperty.estimatedNetWorth}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Purchasing Power</dt>
                              <dd className="text-slate-900 font-medium text-right min-w-0 break-words">
                                {report.spicyIntel.financialAndProperty.purchasingPowerTier}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Deed Recorded / Equity</dt>
                              <dd className="font-mono text-slate-900 text-right min-w-0 break-words">
                                {report.spicyIntel.financialAndProperty.propertyDeedYear} ·{' '}
                                {report.spicyIntel.financialAndProperty.estimatedHomeEquity}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Mortgage &amp; Tax Est.</dt>
                              <dd className="font-mono text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.financialAndProperty.estimatedMortgageBalance} · Tax{' '}
                                {report.spicyIntel.financialAndProperty.annualPropertyTax}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Holdings &amp; Assets</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.financialAndProperty.secondaryAssets}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {/* Legal, Voter, Court, Liens, Traffic & Permits */}
                        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3">
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                            <Scale className="w-4 h-4 text-sky-700 shrink-0" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                              Voter Rolls, Court Records, Liens &amp; Permits
                            </h2>
                          </div>
                          <dl className="divide-y divide-slate-100 text-xs">
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Voter Registration</dt>
                              <dd className="font-medium text-slate-900 text-right min-w-0 break-words">
                                {report.spicyIntel.legalAndCourt.voterRegistration} ·{' '}
                                {report.spicyIntel.legalAndCourt.partyAffiliation}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Voting District</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.legalAndCourt.voterDistrict}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Civil &amp; Small Claims</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.legalAndCourt.civilJudgments}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Liens &amp; UCC Filings</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.legalAndCourt.liensAndUcc}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Bankruptcy / Evictions</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.legalAndCourt.bankruptcyHistory} ·{' '}
                                {report.spicyIntel.legalAndCourt.evictionFilings}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Traffic &amp; Permits</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.legalAndCourt.trafficViolations} ·{' '}
                                {report.spicyIntel.legalAndCourt.specialtyPermits.join(' · ')}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {/* Digital Footprint, Device & Data Exposure Alerts */}
                        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3">
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                              Digital Exposure Alerts, ISP &amp; Device Footprint
                            </h2>
                          </div>
                          <dl className="divide-y divide-slate-100 text-xs">
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Primary Handles</dt>
                              <dd className="font-mono text-slate-900 text-right min-w-0 break-words">
                                {report.spicyIntel.digitalAndExposure.primaryHandles.join(' · ')}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Home ISP &amp; Device</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.digitalAndExposure.homeBroadbandIsp} ·{' '}
                                {report.spicyIntel.digitalAndExposure.deviceEcosystem}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Gravatar OSINT</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.digitalAndExposure.gravatarStatus}
                              </dd>
                            </div>
                          </dl>

                          {report.spicyIntel.digitalAndExposure.breachAlerts.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                Historical Public Breach Index
                              </div>
                              <div className="divide-y divide-slate-100 border border-slate-200 rounded-md">
                                {report.spicyIntel.digitalAndExposure.breachAlerts.map((br, i) => (
                                  <div key={i} className="p-2.5 text-xs space-y-0.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-semibold text-slate-900">{br.source}</span>
                                      <span
                                        className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                          br.riskLevel === 'High'
                                            ? 'bg-rose-50 text-rose-700'
                                            : br.riskLevel === 'Moderate'
                                              ? 'bg-amber-50 text-amber-800'
                                              : 'bg-slate-100 text-slate-600'
                                        }`}
                                      >
                                        {br.breachDate} · {br.riskLevel}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-600">
                                      Exposed: {br.exposedFields}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Former Names, Co-Habitants, Political Donors & Affiliations */}
                        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3">
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                            <AtSign className="w-4 h-4 text-sky-700 shrink-0" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                              Former Names, Co-Habitants, Donors &amp; Affiliations
                            </h2>
                          </div>
                          <dl className="divide-y divide-slate-100 text-xs">
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Former / Name Variants</dt>
                              <dd className="text-slate-900 font-medium text-right min-w-0 break-words">
                                {report.spicyIntel.socialAndAssociatesExtended.formerNames.join(' · ')}
                              </dd>
                            </div>
                            <div className="py-2 flex items-start justify-between gap-3">
                              <dt className="text-slate-500 shrink-0">Affiliations &amp; Clubs</dt>
                              <dd className="text-slate-800 text-right min-w-0 break-words">
                                {report.spicyIntel.socialAndAssociatesExtended.interestsAndAffiliations.join(
                                  ' · '
                                )}
                              </dd>
                            </div>
                          </dl>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1.5">
                              <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                Past Roommates / Co-Habitants
                              </div>
                              <div className="divide-y divide-slate-100 border border-slate-200 rounded-md">
                                {report.spicyIntel.socialAndAssociatesExtended.roommatesAndCohabitants.map(
                                  (rm, i) => (
                                    <div key={i} className="p-2 text-xs">
                                      <div className="font-semibold text-slate-900">
                                        {rm.name} ({rm.age})
                                      </div>
                                      <div className="text-[11px] text-slate-500">
                                        {rm.relationNote} · {rm.yearsShared}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                Donor &amp; Civic Filings
                              </div>
                              <div className="divide-y divide-slate-100 border border-slate-200 rounded-md">
                                {report.spicyIntel.socialAndAssociatesExtended.politicalAndDonorFilings.map(
                                  (dn, i) => (
                                    <div key={i} className="p-2 text-xs">
                                      <div className="font-semibold text-slate-900">
                                        {dn.recipientOrOrg}
                                      </div>
                                      <div className="text-[11px] text-slate-500">
                                        {dn.amountRange} · {dn.cycle} · {dn.cityState}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 8. Co-Located Contacts & Neighbors / Associates (Paginated + Mobile Cards) */}
                    {report.associates.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Users className="w-4 h-4 text-sky-700 shrink-0" />
                            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                              Neighbors &amp; Local Exchange Associates ({report.associates.length})
                            </h2>
                          </div>

                          {paginatedAssociates.length > 0 && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  triggerCopy(
                                    'copy-assoc-names',
                                    paginatedAssociates
                                      .map((a) => formatDirectoryFullName(a.record.ownerName))
                                      .join('\n')
                                  )
                                }
                                title={`Associate names (${paginatedAssociates.length})`}
                                aria-label="Associate names"
                                className="h-7 px-2 inline-flex items-center justify-center gap-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
                              >
                                <User className="w-3 h-3 text-slate-600" />
                                {copiedToken === 'copy-assoc-names' ? (
                                  <Check className="w-3 h-3 text-emerald-700" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-500" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  triggerCopy(
                                    'copy-assoc-page',
                                    paginatedAssociates.map((a) => a.record.e164).join('\n')
                                  )
                                }
                                title={`Associate numbers (${paginatedAssociates.length})`}
                                aria-label="Associate numbers"
                                className="h-7 px-2 inline-flex items-center justify-center gap-1 text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors cursor-pointer"
                              >
                                <Phone className="w-3 h-3 text-sky-700" />
                                {copiedToken === 'copy-assoc-page' ? (
                                  <Check className="w-3 h-3 text-emerald-700" />
                                ) : (
                                  <Copy className="w-3 h-3 text-sky-600" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Mobile Cards (< md) */}
                        <div className="md:hidden divide-y divide-slate-100">
                          {paginatedAssociates.map(({ record: rec, relationship }) => {
                            const nameTok = `assoc-name-${rec.id}`;
                            const phoneTok = `assoc-row-${rec.id}`;
                            const cleanName = formatDirectoryFullName(rec.ownerName);
                            return (
                              <div key={rec.id} className="p-3.5 space-y-1.5 text-xs">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-semibold text-slate-900 break-words">
                                        {cleanName}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => triggerCopy(nameTok, cleanName)}
                                        title={cleanName}
                                        aria-label={cleanName}
                                        className="w-6 h-6 inline-flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                      >
                                        {copiedToken === nameTok ? (
                                          <Check className="w-3 h-3 text-emerald-700" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                    <div className="text-[11px] text-sky-800 font-medium">
                                      {relationship}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => runPhoneLookup(rec.e164, rec.countryIso2)}
                                    className="px-2 py-1 text-[11px] font-medium text-sky-800 bg-sky-50 border border-sky-200 rounded shrink-0 cursor-pointer"
                                  >
                                    Report
                                  </button>
                                </div>
                                <div className="flex items-center justify-between gap-2 text-[11px]">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono tabular-nums font-medium text-slate-900">
                                      {rec.internationalFormat}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(phoneTok, rec.e164)}
                                      title={rec.e164}
                                      aria-label={rec.e164}
                                      className="w-6 h-6 inline-flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                    >
                                      {copiedToken === phoneTok ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                  <span className="text-slate-500 truncate">
                                    {[rec.city, rec.regionCode, rec.postalCode].filter(Boolean).join(', ')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Desktop Table (md+) */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                              <tr>
                                <th className="py-2 px-3.5 font-semibold">Full Name</th>
                                <th className="py-2 px-3.5 font-semibold">Connection</th>
                                <th className="py-2 px-3.5 font-semibold">Phone Number</th>
                                <th className="py-2 px-3.5 font-semibold">Address / City</th>
                                <th className="py-2 px-3.5 font-semibold text-right">Dossier</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {paginatedAssociates.map(({ record: rec, relationship }) => {
                                const nameTok = `assoc-name-${rec.id}`;
                                const phoneTok = `assoc-row-${rec.id}`;
                                const cleanName = formatDirectoryFullName(rec.ownerName);
                                return (
                                  <tr key={rec.id} className="hover:bg-slate-50">
                                    <td className="py-2 px-3.5">
                                      <div className="flex items-center justify-between gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => triggerCopy(nameTok, cleanName)}
                                          className="font-semibold text-slate-900 hover:text-sky-700 text-left cursor-pointer"
                                        >
                                          {cleanName}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => triggerCopy(nameTok, cleanName)}
                                          title={cleanName}
                                          aria-label={cleanName}
                                          className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                        >
                                          {copiedToken === nameTok ? (
                                            <Check className="w-3 h-3 text-emerald-700" />
                                          ) : (
                                            <Copy className="w-3 h-3" />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-2 px-3.5 text-sky-800 font-medium">
                                      {relationship}
                                    </td>
                                    <td className="py-2 px-3.5">
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => triggerCopy(phoneTok, rec.e164)}
                                          className="font-mono tabular-nums font-medium text-slate-900 hover:text-sky-700 whitespace-nowrap cursor-pointer"
                                        >
                                          {rec.internationalFormat}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => triggerCopy(phoneTok, rec.e164)}
                                          title={rec.e164}
                                          aria-label={rec.e164}
                                          className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                        >
                                          {copiedToken === phoneTok ? (
                                            <Check className="w-3 h-3 text-emerald-700" />
                                          ) : (
                                            <Copy className="w-3 h-3" />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-2 px-3.5 text-slate-600">
                                      {[rec.streetAddress, rec.city, rec.regionCode, rec.postalCode]
                                        .filter(Boolean)
                                        .join(', ')}
                                    </td>
                                    <td className="py-2 px-3.5 text-right">
                                      <button
                                        type="button"
                                        onClick={() => runPhoneLookup(rec.e164, rec.countryIso2)}
                                        className="px-2 py-1 text-[11px] font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                                      >
                                        Report
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <PaginationBar
                          totalItems={report.associates.length}
                          pageSize={ASSOCIATES_PAGE_SIZE}
                          currentPage={associatesPage}
                          onPageChange={setAssociatesPage}
                          itemLabel="associated contacts"
                        />
                      </div>
                    )}

                    {/* 9. Live Public Web Mentions (Paginated) */}
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-sky-700" />
                        <h2 className="text-xs sm:text-sm font-semibold text-slate-900">
                          Live Public Web Mentions &amp; Citations ({report.webMentions.length})
                        </h2>
                      </div>

                      {report.webMentions.length === 0 ? (
                        <div className="p-5 text-xs text-slate-500">
                          No external public web pages explicitly published this exact phone string in open search snippets.
                        </div>
                      ) : (
                        <>
                          <div className="divide-y divide-slate-100">
                            {paginatedMentions.map((m, idx) => (
                              <div key={`${m.url}-${idx}`} className="p-3.5 space-y-1 text-xs">
                                <div className="flex items-center justify-between gap-3">
                                  <a
                                    href={m.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-sky-800 hover:text-sky-950 hover:underline inline-flex items-center gap-1.5 min-w-0"
                                  >
                                    <span className="truncate">{m.title}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                                    {m.domain}
                                  </span>
                                </div>
                                {m.snippet && (
                                  <p className="text-slate-600 leading-relaxed">{m.snippet}</p>
                                )}
                              </div>
                            ))}
                          </div>

                          <PaginationBar
                            totalItems={report.webMentions.length}
                            pageSize={MENTIONS_PAGE_SIZE}
                            currentPage={mentionsPage}
                            onPageChange={setMentionsPage}
                            itemLabel="web mentions"
                          />
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* SUB-MODE 2: US & GLOBAL FIRST & LAST NAME PEOPLE FINDER (500 PER PAGE, LISTS ALL MATCHES) */}
        {subMode === 'people' && (
          <div className="space-y-4">
            <form
              onSubmit={handlePeopleSearch}
              className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 items-end">
                <div className="space-y-1">
                  <label htmlFor="pf-first" className="block text-xs font-semibold text-slate-700">
                    First Name
                  </label>
                  <input
                    id="pf-first"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Robert or Bob"
                    className="w-full h-10 sm:h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-last" className="block text-xs font-semibold text-slate-700">
                    Last Name
                  </label>
                  <input
                    id="pf-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Smith"
                    className="w-full h-10 sm:h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-city" className="block text-xs font-medium text-slate-700">
                    City (Optional)
                  </label>
                  <input
                    id="pf-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Any US City"
                    className="w-full h-10 sm:h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-state" className="block text-xs font-medium text-slate-700">
                    {peopleCountry === 'US' ? 'US State' : 'State / Region'}
                  </label>
                  {peopleCountry === 'US' ? (
                    <select
                      id="pf-state"
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      className="w-full h-10 sm:h-9 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value="">All 50 US States + D.C.</option>
                      {US_STATE_OPTIONS.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="pf-state"
                      type="text"
                      maxLength={8}
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                      placeholder="e.g. ON, LDN"
                      className="w-full h-10 sm:h-9 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-zip" className="block text-xs font-medium text-slate-700">
                    ZIP / Postal
                  </label>
                  <input
                    id="pf-zip"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Optional ZIP"
                    className="w-full h-10 sm:h-9 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pf-country" className="block text-xs font-medium text-slate-700">
                    Country
                  </label>
                  <select
                    id="pf-country"
                    value={peopleCountry}
                    onChange={(e) => {
                      setPeopleCountry(e.target.value);
                      setStateCode('');
                    }}
                    className="w-full h-10 sm:h-9 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    {GLOBAL_COUNTRY_OPTIONS.map((c) => (
                      <option key={c.iso2} value={c.iso2}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <span className="text-[11px] sm:text-xs text-slate-500">
                  Enter any First &amp; Last Name in the US (leave City &amp; State blank to search nationwide across all 50 states, nickname aliases, and Soundex surname variants).
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {(firstName || lastName || city || stateCode || postalCode) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFirstName('');
                        setLastName('');
                        setCity('');
                        setStateCode('');
                        setPostalCode('');
                        setPeopleQuickFilter('');
                        setPeopleStateQuickFilter('');
                      }}
                      className="h-9 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={
                      isSearchingPeople ||
                      (!firstName.trim() &&
                        !lastName.trim() &&
                        !city.trim() &&
                        !stateCode.trim() &&
                        !postalCode.trim())
                    }
                    className="h-9 px-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isSearchingPeople ? 'Scanning All Registries...' : 'Find All Matching Names'}</span>
                  </button>
                </div>
              </div>
            </form>

            {peopleError && (
              <div className="p-3.5 bg-white border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                {peopleError}
              </div>
            )}

            {isSearchingPeople && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 animate-pulse">
                <div className="h-4 w-72 bg-slate-200 rounded" />
                <div className="space-y-2 pt-1">
                  <div className="h-9 bg-slate-100 rounded" />
                  <div className="h-9 bg-slate-100 rounded" />
                  <div className="h-9 bg-slate-100 rounded" />
                  <div className="h-9 bg-slate-100 rounded" />
                  <div className="h-9 bg-slate-100 rounded" />
                </div>
              </div>
            )}

            {hasSearchedPeople && !isSearchingPeople && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                {/* Summary & Instant Narrowing Bar */}
                <div className="px-3.5 sm:px-4 py-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-slate-700 min-w-0">
                      Listed{' '}
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {filteredPeopleResults.length.toLocaleString()}
                      </span>
                      {filteredPeopleResults.length !== peopleResults.length && (
                        <span> of {peopleResults.length.toLocaleString()}</span>
                      )}{' '}
                      matching individuals
                      {peopleStatesCovered > 0 && (
                        <span>
                          {' '}
                          ·{' '}
                          <span className="font-medium text-slate-800 tabular-nums">
                            {peopleStatesCovered}
                          </span>{' '}
                          {peopleCountry === 'US' ? 'US states/jurisdictions' : 'regions'}
                        </span>
                      )}
                      {peopleDurationMs !== null ? ` · ${peopleDurationMs} ms` : ''}
                      {peopleQueryVariants.length > 1 && (
                        <span className="text-slate-500 hidden lg:inline">
                          {' '}
                          · Matched variants: {peopleQueryVariants.join(', ')}
                        </span>
                      )}
                    </div>

                    {paginatedPeople.length > 0 && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              'copy-people-names',
                              paginatedPeople
                                .map((r) => formatDirectoryFullName(r.ownerName))
                                .join('\n')
                            )
                          }
                          title={`Names on page (${paginatedPeople.length})`}
                          aria-label="Names on page"
                          className="h-7 px-2 inline-flex items-center justify-center gap-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
                        >
                          <User className="w-3 h-3 text-slate-600" />
                          {copiedToken === 'copy-people-names' ? (
                            <Check className="w-3 h-3 text-emerald-700" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-500" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              'copy-people-page',
                              paginatedPeople.map((r) => r.e164).join('\n')
                            )
                          }
                          title={`Numbers on page (${paginatedPeople.length})`}
                          aria-label="Numbers on page"
                          className="h-7 px-2 inline-flex items-center justify-center gap-1 text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors cursor-pointer"
                        >
                          <Phone className="w-3 h-3 text-sky-700" />
                          {copiedToken === 'copy-people-page' ? (
                            <Check className="w-3 h-3 text-emerald-700" />
                          ) : (
                            <Copy className="w-3 h-3 text-sky-600" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {peopleResults.length > 5 && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={peopleQuickFilter}
                          onChange={(e) => {
                            setPeopleQuickFilter(e.target.value);
                            setPeoplePage(1);
                          }}
                          placeholder="Filter listed matches by middle initial, city, county, ZIP, age, or employer..."
                          className="w-full h-10 sm:h-8 pl-8 pr-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                        />
                      </div>

                      {availableResultStates.length > 1 && (
                        <select
                          aria-label="Filter listed matches by state"
                          value={peopleStateQuickFilter}
                          onChange={(e) => {
                            setPeopleStateQuickFilter(e.target.value);
                            setPeoplePage(1);
                          }}
                          className="h-10 sm:h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-600"
                        >
                          <option value="">
                            All Listed States ({availableResultStates.length})
                          </option>
                          {availableResultStates.map(([st, cnt]) => (
                            <option key={st} value={st}>
                              {st} ({cnt})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>

                {filteredPeopleResults.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No individuals matched the current filter criteria. Clear the quick filter or broaden your search.
                  </div>
                ) : (
                  <>
                    {/* Mobile Compact Cards (< md) */}
                    <div className="md:hidden divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
                      {paginatedPeople.map((rec) => {
                        const nameTok = `pf-name-${rec.id}`;
                        const phoneTok = `pf-row-${rec.id}`;
                        const cleanName = formatDirectoryFullName(rec.ownerName);
                        return (
                          <div key={rec.id} className="p-3 space-y-1.5 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="font-semibold text-slate-900 truncate">
                                    {cleanName}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => triggerCopy(nameTok, cleanName)}
                                    title={cleanName}
                                    aria-label={cleanName}
                                    className="w-6 h-6 inline-flex items-center justify-center text-slate-500 hover:text-sky-800 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                  >
                                    {copiedToken === nameTok ? (
                                      <Check className="w-3 h-3 text-emerald-700" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                                {(rec.estimatedAge || rec.dateOfBirth) && (
                                  <div className="text-[11px] text-slate-600 mt-0.5">
                                    {rec.estimatedAge ? `Age ${rec.estimatedAge}` : ''}
                                    {rec.estimatedAge && rec.dateOfBirth ? ' · ' : ''}
                                    {rec.dateOfBirth ? `DOB: ${rec.dateOfBirth}` : ''}
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => runPhoneLookup(rec.e164, rec.countryIso2)}
                                className="px-2 py-0.5 text-[11px] font-medium text-sky-800 bg-sky-50 border border-sky-200 rounded shrink-0 cursor-pointer"
                              >
                                Report
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-mono tabular-nums font-semibold text-slate-900">
                                  {rec.internationalFormat}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => triggerCopy(phoneTok, rec.e164)}
                                  title={rec.e164}
                                  aria-label={rec.e164}
                                  className="w-6 h-6 inline-flex items-center justify-center text-slate-500 hover:text-sky-800 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                >
                                  {copiedToken === phoneTok ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                              <span className="truncate text-slate-500">
                                {rec.carrierGroup} · {rec.lineType}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-600 break-words">
                              {[rec.streetAddress, rec.city, rec.regionCode, rec.postalCode]
                                .filter(Boolean)
                                .join(', ')}
                              {rec.county ? ` · ${rec.county}` : ''}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop High-Density Table (md+) */}
                    <div className="hidden md:block overflow-x-auto max-h-[600px]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700 z-10">
                          <tr>
                            <th className="py-2 px-3.5 font-semibold">Full Name, Age &amp; DOB</th>
                            <th className="py-2 px-3.5 font-semibold">Phone &amp; Carrier</th>
                            <th className="py-2 px-3.5 font-semibold">Address, City, State &amp; ZIP</th>
                            <th className="py-2 px-3.5 font-semibold">County</th>
                            <th className="py-2 px-3.5 font-semibold hidden xl:table-cell">
                              Role / Employer &amp; Relatives
                            </th>
                            <th className="py-2 px-3.5 font-semibold text-right">Dossier</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedPeople.map((rec) => {
                            const nameTok = `pf-name-${rec.id}`;
                            const phoneTok = `pf-row-${rec.id}`;
                            const cleanName = formatDirectoryFullName(rec.ownerName);
                            return (
                              <tr key={rec.id} className="hover:bg-slate-50">
                                <td className="py-2 px-3.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => triggerCopy(nameTok, cleanName)}
                                        className="font-semibold text-slate-900 hover:text-sky-700 text-left cursor-pointer"
                                      >
                                        {cleanName}
                                      </button>
                                      <div className="text-[11px] text-slate-500">
                                        {rec.estimatedAge ? (
                                          <span className="font-mono tabular-nums">
                                            Age {rec.estimatedAge}
                                          </span>
                                        ) : null}
                                        {rec.dateOfBirth ? (
                                          <span className="text-slate-700 font-medium">
                                            {rec.estimatedAge ? ' · ' : ''}DOB {rec.dateOfBirth}
                                          </span>
                                        ) : null}
                                        {(rec.estimatedAge || rec.dateOfBirth) && rec.matchConfidenceLabel ? ' · ' : ''}
                                        {rec.matchConfidenceLabel ? (
                                          <span
                                            className={
                                              rec.isLiveWebVerified
                                                ? 'text-emerald-700 font-medium'
                                                : 'text-slate-500'
                                            }
                                          >
                                            {rec.matchConfidenceLabel}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(nameTok, cleanName)}
                                      title={cleanName}
                                      aria-label={cleanName}
                                      className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                    >
                                      {copiedToken === nameTok ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-2 px-3.5">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(phoneTok, rec.e164)}
                                      className="font-mono tabular-nums font-semibold text-slate-900 hover:text-sky-700 whitespace-nowrap cursor-pointer"
                                    >
                                      {rec.internationalFormat}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => triggerCopy(phoneTok, rec.e164)}
                                      title={rec.e164}
                                      aria-label={rec.e164}
                                      className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                    >
                                      {copiedToken === phoneTok ? (
                                        <Check className="w-3 h-3 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                  <div className="text-[11px] text-slate-500 whitespace-nowrap">
                                    {rec.carrierGroup} · {rec.lineType}
                                  </div>
                                </td>
                                <td className="py-2 px-3.5 text-slate-700">
                                  {rec.streetAddress && (
                                    <div className="font-medium text-slate-900">
                                      {rec.streetAddress}
                                    </div>
                                  )}
                                  <div className="text-[11px] text-slate-600">
                                    {[rec.city, rec.regionCode].filter(Boolean).join(', ')}{' '}
                                    {rec.postalCode && (
                                      <span className="font-mono tabular-nums font-medium text-sky-800">
                                        {rec.postalCode}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2 px-3.5 font-medium text-slate-800 whitespace-nowrap">
                                  {rec.county || '—'}
                                </td>
                                <td className="py-2 px-3.5 text-slate-600 hidden xl:table-cell max-w-[240px]">
                                  {(rec.ownerTitle || rec.organizationName) && (
                                    <div className="truncate text-slate-800 font-medium">
                                      {[rec.ownerTitle, rec.organizationName]
                                        .filter(Boolean)
                                        .join(' · ')}
                                    </div>
                                  )}
                                  {rec.relativesPreview && rec.relativesPreview.length > 0 && (
                                    <div className="text-[11px] text-slate-500 truncate">
                                      Relatives: {rec.relativesPreview.join(', ')}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2 px-3.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => runPhoneLookup(rec.e164, rec.countryIso2)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                                  >
                                    <FileSearch className="w-3 h-3" />
                                    <span>Report</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <PaginationBar
                      totalItems={filteredPeopleResults.length}
                      pageSize={PEOPLE_PAGE_SIZE}
                      currentPage={peoplePage}
                      onPageChange={setPeoplePage}
                      itemLabel="matching individuals"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* SUB-MODE 3: BATCH EXISTENCE & E.164 VERIFICATION (PAGINATED) */}
        {subMode === 'batch' && (
          <div className="space-y-4">
            <form
              onSubmit={handleBatchVerify}
              className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Bulk Worldwide Phone Existence &amp; Carrier Checker
                  </h2>
                  <p className="text-xs text-slate-500">
                    Paste up to 500 phone numbers (one per line) to verify ITU-T E.164 existence, carrier operator, and public owner match.
                  </p>
                </div>

                <select
                  aria-label="Default Country"
                  value={batchCountry}
                  onChange={(e) => setBatchCountry(e.target.value)}
                  className="h-10 sm:h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 shrink-0"
                >
                  {GLOBAL_COUNTRY_OPTIONS.map((c) => (
                    <option key={c.iso2} value={c.iso2}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows={5}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="Paste US or international phone numbers here, one per line..."
                className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCheckingBatch || !batchText.trim()}
                  className="w-full sm:w-auto h-10 sm:h-9 px-5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCheckingBatch ? 'Verifying...' : 'Verify Numbers'}
                </button>
              </div>
            </form>

            {batchResults.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-700">
                    Checked{' '}
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {batchResults.length}
                    </span>{' '}
                    ·{' '}
                    <span className="font-semibold text-emerald-700 tabular-nums">
                      {batchResults.filter((r) => r.isValidE164).length} valid
                    </span>
                  </div>

                  {paginatedBatch.some((r) => r.isValidE164 && r.e164) && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {paginatedBatch.some((r) => r.ownerName) && (
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              'copy-batch-names',
                              paginatedBatch
                                .filter((r) => r.ownerName)
                                .map((r) => formatDirectoryFullName(r.ownerName!))
                                .join('\n')
                            )
                          }
                          title="Owner names on page"
                          aria-label="Owner names on page"
                          className="h-7 px-2 inline-flex items-center justify-center gap-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer"
                        >
                          <User className="w-3 h-3 text-slate-600" />
                          {copiedToken === 'copy-batch-names' ? (
                            <Check className="w-3 h-3 text-emerald-700" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-500" />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          triggerCopy(
                            'copy-batch-page',
                            paginatedBatch
                              .filter((r) => r.isValidE164 && r.e164)
                              .map((r) => r.e164!)
                              .join('\n')
                          )
                        }
                        title="Valid phone numbers on page"
                        aria-label="Valid phone numbers on page"
                        className="h-7 px-2 inline-flex items-center justify-center gap-1 text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors cursor-pointer"
                      >
                        <Phone className="w-3 h-3 text-sky-700" />
                        {copiedToken === 'copy-batch-page' ? (
                          <Check className="w-3 h-3 text-emerald-700" />
                        ) : (
                          <Copy className="w-3 h-3 text-sky-600" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Cards (< md) for Batch Verify */}
                <div className="md:hidden divide-y divide-slate-100">
                  {paginatedBatch.map((item, idx) => {
                    const tok = `batch-item-${idx}`;
                    return (
                      <div key={`${item.rawInput}-${idx}`} className="p-3.5 space-y-1 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono tabular-nums font-semibold text-slate-900">
                                {item.internationalFormat ?? item.rawInput}
                              </span>
                              {item.e164 && (
                                <button
                                  type="button"
                                  onClick={() => triggerCopy(tok, item.e164!)}
                                  title={item.e164}
                                  aria-label={item.e164}
                                  className="w-6 h-6 inline-flex items-center justify-center text-slate-600 bg-slate-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                >
                                  {copiedToken === tok ? (
                                    <Check className="w-3 h-3 text-emerald-700" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              <span
                                className={
                                  item.isValidE164
                                    ? 'font-semibold text-emerald-700'
                                    : 'font-semibold text-rose-700'
                                }
                              >
                                {item.isValidE164 ? 'Valid Line' : 'Invalid'}
                              </span>
                              {item.ownerName ? ` · ${formatDirectoryFullName(item.ownerName)}` : ''}
                              {item.carrierGroup ? ` · ${item.carrierGroup} (${item.lineType})` : ''}
                            </div>
                          </div>
                          {item.e164 && (
                            <button
                              type="button"
                              onClick={() =>
                                runPhoneLookup(item.e164!, item.countryIso2 ?? undefined)
                              }
                              className="px-2 py-1 text-[11px] font-medium text-sky-800 bg-sky-50 border border-sky-200 rounded shrink-0 cursor-pointer"
                            >
                              Report
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table (md+) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="py-2 px-3.5 font-semibold">Input / E.164</th>
                        <th className="py-2 px-3.5 font-semibold">Existence</th>
                        <th className="py-2 px-3.5 font-semibold">Public Owner</th>
                        <th className="py-2 px-3.5 font-semibold">Carrier &amp; Line</th>
                        <th className="py-2 px-3.5 font-semibold text-right">Dossier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedBatch.map((item, idx) => {
                        const tok = `batch-item-${idx}`;
                        return (
                          <tr key={`${item.rawInput}-${idx}`} className="hover:bg-slate-50">
                            <td className="py-2 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono tabular-nums font-medium text-slate-900 whitespace-nowrap">
                                  {item.internationalFormat ?? item.rawInput}
                                </span>
                                {item.e164 && (
                                  <button
                                    type="button"
                                    onClick={() => triggerCopy(tok, item.e164!)}
                                    title={item.e164}
                                    aria-label={item.e164}
                                    className="w-6 h-6 inline-flex items-center justify-center text-slate-600 hover:text-sky-800 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded shrink-0 cursor-pointer"
                                  >
                                    {copiedToken === tok ? (
                                      <Check className="w-3 h-3 text-emerald-700" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-3.5">
                              {item.isValidE164 ? (
                                <span className="font-semibold text-emerald-700">Valid Line</span>
                              ) : (
                                <span className="font-semibold text-rose-700">Invalid</span>
                              )}
                            </td>
                            <td className="py-2 px-3.5 text-slate-800">
                              {item.ownerName ? formatDirectoryFullName(item.ownerName) : 'Open Report'}
                            </td>
                            <td className="py-2 px-3.5 text-slate-600">
                              {item.carrierGroup} · {item.lineType}
                            </td>
                            <td className="py-2 px-3.5 text-right">
                              {item.e164 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    runPhoneLookup(item.e164!, item.countryIso2 ?? undefined)
                                  }
                                  className="px-2 py-1 text-[11px] font-medium text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-colors cursor-pointer"
                                >
                                  Report
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <PaginationBar
                  totalItems={batchResults.length}
                  pageSize={BATCH_PAGE_SIZE}
                  currentPage={batchPage}
                  onPageChange={setBatchPage}
                  itemLabel="checked numbers"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
