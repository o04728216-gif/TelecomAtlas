export type LineType = 'MOBILE' | 'LANDLINE' | 'VOIP' | 'TOLL_FREE';

export type ContinentCode = 'NA' | 'EU' | 'AS' | 'SA' | 'AF' | 'OC';

export interface ContinentRecord {
  code: ContinentCode;
  name: string;
  ituZone: string;
  countryCount?: number;
  numberCount?: number;
}

export interface CountryRecord {
  iso2: string;
  iso3: string;
  continentCode: ContinentCode;
  name: string;
  callingCode: string;
  nsnMinLength: number;
  nsnMaxLength: number;
  regulatoryAuthority: string;
  numberCount?: number;
}

export interface RegionRecord {
  id: string; // e.g., 'US-CA'
  countryIso2: string;
  code: string; // e.g., 'CA'
  name: string; // e.g., 'California'
  timezone: string;
  numberCount?: number;
}

export interface ZipCodeRecord {
  id: string; // e.g., 'US-90210'
  countryIso2: string;
  regionId: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
  numberCount?: number;
}

export interface PrefixCarrierAllocation {
  id: string;
  fullPrefix: string; // Digits only: CC + NDC/Block, e.g., '1310271'
  countryIso2: string;
  callingCode: string;
  ndcPrefix: string; // e.g., '310-271' or '7700'
  carrierName: string; // e.g., 'AT&T Mobility LLC'
  carrierGroup: string; // Normalized brand: 'AT&T', 'Verizon', 'Vodafone'
  ocnCode: string; // Operating Company Number / MNC-MCC
  lineType: LineType;
  regionId: string | null;
  zipId: string | null;
  allocationSource: string;
}

export interface PhoneNumberRecord {
  id: string;
  e164: string;
  nationalFormat: string;
  internationalFormat: string;
  ownerName: string;
  ownerTitle: string | null;
  organizationName?: string | null;
  specialtyOrCategory?: string | null;
  publicRegistryId?: string | null;
  streetAddress: string | null;
  mailingAddress?: string | null;
  secondaryPhones?: string[];
  isLiveWebVerified: boolean;
  continentCode: ContinentCode;
  continentName: string;
  countryIso2: string;
  countryName: string;
  callingCode: string;
  regionId: string | null;
  regionCode: string | null;
  regionName: string | null;
  zipId: string | null;
  postalCode: string | null;
  city: string | null;
  county?: string | null;
  estimatedAge?: number | null;
  matchConfidenceLabel?: string | null;
  relativesPreview?: string[];
  latitude: number | null;
  longitude: number | null;
  ndcPrefix: string;
  matchedFullPrefix: string;
  carrierName: string;
  carrierGroup: string;
  ocnCode: string;
  lineType: LineType;
  isValidE164: boolean;
  registrySource: string;
  indexedAt: string;
}

export interface PeopleSearchResponse {
  items: PhoneNumberRecord[];
  totalMatched: number;
  liveVerifiedCount: number;
  statesCovered: number;
  queryVariantsUsed: string[];
  durationMs: number;
}

export interface ParsedNumberIntelligence {
  rawInput: string;
  normalizedDigits: string;
  e164: string | null;
  nationalFormat: string | null;
  internationalFormat: string | null;
  ownerName: string | null;
  ownerTitle: string | null;
  streetAddress: string | null;
  isValidE164: boolean;
  validationReason: string;
  ituLengthCompliant: boolean;
  digitCount: number;
  callingCode: string | null;
  nationalSignificantNumber: string | null;
  continentCode: ContinentCode | null;
  continentName: string | null;
  countryIso2: string | null;
  countryName: string | null;
  regulatoryAuthority: string | null;
  regionCode: string | null;
  regionName: string | null;
  postalCode: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  matchedPrefix: string | null;
  ndcPrefix: string | null;
  carrierName: string;
  carrierGroup: string;
  ocnCode: string | null;
  lineType: LineType | 'UNKNOWN';
  detectionMethod: 'RADIX_TRIE_EXACT_BLOCK' | 'STRUCTURAL_ITU_RULE' | 'UNRESOLVED';
  lookupDurationUs: number;
}

export interface HierarchyFacetSummary {
  continents: Array<ContinentRecord & { count: number }>;
  countries: Array<CountryRecord & { count: number }>;
  regions: Array<RegionRecord & { count: number }>;
  zipCodes: Array<ZipCodeRecord & { count: number }>;
  carrierGroups: Array<{ name: string; count: number }>;
  lineTypes: Array<{ type: LineType; count: number }>;
  totalRegistryRecords: number;
  usTotalCount: number;
  liveWebVerifiedCount: number;
  totalPrefixAllocations: number;
}

export interface PhoneQueryResponse {
  items: PhoneNumberRecord[];
  totalMatched: number;
  offset: number;
  limit: number;
  queryDurationMs: number;
  appliedFilters: {
    continent?: string;
    country?: string;
    region?: string;
    zipCodes: string[];
    carriers: string[];
    lineTypes: LineType[];
    prefix?: string;
    search?: string;
    onlyLiveWeb?: boolean;
  };
}

export interface WebHarvestSummary {
  source: string;
  fetchedCount: number;
  newlyAddedCount: number;
  matchedRecords: PhoneNumberRecord[];
  durationMs: number;
}

export interface PublicWebMention {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface PublicContactAddress {
  index: number;
  label:
    | 'Current Residence'
    | 'Business / Practice Address'
    | 'Mailing Address'
    | 'Previous Address';
  street: string;
  unit?: string | null;
  city: string;
  state: string;
  postalCode: string;
  county?: string | null;
  country: string;
  yearsActive: string;
  coordinates?: string | null;
  phone?: string | null;
}

export interface EmploymentRecord {
  jobTitle: string;
  employer: string;
  departmentOrSpecialty: string;
  industry: string;
  status: 'Current' | 'Prior';
  years: string;
  location: string;
  workPhone?: string | null;
  sourceNote: string;
}

export interface ContactEmailRecord {
  address: string;
  type: 'Work' | 'Personal' | 'Public Web';
  domain: string;
  confidenceNote: string;
}

export interface VehicleOwnedRecord {
  year: number;
  make: string;
  model: string;
  bodyStyle: string;
  vinMasked: string;
  registrationState: string;
  ownershipType: string;
  status: 'Active Registration' | 'Historical Registration';
}

export interface RelativeContactRecord {
  name: string;
  age: number;
  relationship:
    | 'Possible Spouse / Partner'
    | 'Immediate Relative'
    | 'Parent / Senior Relative'
    | 'Sibling / Relative'
    | 'Household Member';
  cityState: string;
  phoneE164: string;
  phoneDisplay: string;
  carrier: string;
}

export interface ProfessionalLicenseRecord {
  licenseType: string;
  licenseNumber: string;
  issuingAuthority: string;
  status: string;
}

export interface EducationRecord {
  institution: string;
  degreeOrCredential: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface PropertyAndResidenceProfile {
  propertyType: string;
  ownershipStatus: string;
  estimatedValue: string;
  livingAreaSqFt: string;
  yearBuilt: number;
  lengthOfResidence: string;
  countyOrDistrict: string;
  localTimezone: string;
  coordinates: string | null;
}

export interface SocialWebProfile {
  platform: string;
  label: string;
  url: string;
}

export interface AssociatedContactItem {
  record: PhoneNumberRecord;
  relationship:
    | 'Same Address'
    | 'Same Surname & Area'
    | 'Same Organization'
    | 'Same Local Exchange';
}

export interface ContactFinderReport {
  queryPhone: string;
  existenceStatus:
    | 'CONFIRMED_PUBLIC_RECORD'
    | 'VALID_ALLOCATED_EXCHANGE'
    | 'INVALID_OR_UNASSIGNED';
  existenceSummary: string;
  intel: ParsedNumberIntelligence;
  primaryOwner: {
    name: string;
    age: number | null;
    birthYear: number | null;
    aliases: string[];
    jobTitle: string | null;
    employer: string | null;
    title: string | null;
    organization: string | null;
    category: string | null;
    registryId: string | null;
    verificationSource: string;
    lastUpdated: string | null;
  } | null;
  employmentHistory: EmploymentRecord[];
  emails: ContactEmailRecord[];
  addresses: PublicContactAddress[]; // Strictly up to 10 chronological addresses (Last 10 Addresses)
  vehiclesOwned: VehicleOwnedRecord[];
  relatives: RelativeContactRecord[];
  propertyProfile: PropertyAndResidenceProfile | null;
  educationHistory: EducationRecord[];
  professionalLicenses: ProfessionalLicenseRecord[];
  socialProfiles: SocialWebProfile[];
  associatedPhones: Array<{
    e164: string;
    display: string;
    lineType: string;
    carrier: string;
    label: string;
  }>;
  associates: AssociatedContactItem[];
  webMentions: PublicWebMention[];
  lookupDurationMs: number;
}

export interface IngestionJob {
  id: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  sourceLabel: string;
  totalSubmitted: number;
  processedCount: number;
  validInsertedCount: number;
  duplicateSkippedCount: number;
  invalidRejectedCount: number;
  startedAt: string;
  completedAt: string | null;
  rejections: Array<{ raw: string; reason: string }>;
}
