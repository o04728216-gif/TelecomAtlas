import type {
  ContinentRecord,
  CountryRecord,
  RegionRecord,
  ZipCodeRecord,
  PrefixCarrierAllocation,
} from '../shared/types.ts';
import { buildAll50UsStatesCatalog } from './us50StatesCatalog.ts';

const { usRegions, usZipCodes, usPrefixAllocations } = buildAll50UsStatesCatalog();

export const CONTINENTS: ContinentRecord[] = [
  { code: 'NA', name: 'North America', ituZone: 'ITU Zone 1 / Region 2' },
  { code: 'EU', name: 'Europe', ituZone: 'ITU Zones 3 & 4 / Region 1' },
  { code: 'AS', name: 'Asia', ituZone: 'ITU Zones 8 & 9 / Region 3' },
  { code: 'SA', name: 'South America', ituZone: 'ITU Zone 5 / Region 2' },
  { code: 'AF', name: 'Africa', ituZone: 'ITU Zone 2 / Region 1' },
  { code: 'OC', name: 'Oceania', ituZone: 'ITU Zone 6 / Region 3' },
];

export const COUNTRIES: CountryRecord[] = [
  // North America
  { iso2: 'US', iso3: 'USA', continentCode: 'NA', name: 'United States', callingCode: '1', nsnMinLength: 10, nsnMaxLength: 10, regulatoryAuthority: 'NANPA / FCC' },
  { iso2: 'CA', iso3: 'CAN', continentCode: 'NA', name: 'Canada', callingCode: '1', nsnMinLength: 10, nsnMaxLength: 10, regulatoryAuthority: 'CNA / CRTC' },
  { iso2: 'MX', iso3: 'MEX', continentCode: 'NA', name: 'Mexico', callingCode: '52', nsnMinLength: 10, nsnMaxLength: 10, regulatoryAuthority: 'IFT México' },
  // Europe
  { iso2: 'GB', iso3: 'GBR', continentCode: 'EU', name: 'United Kingdom', callingCode: '44', nsnMinLength: 10, nsnMaxLength: 10, regulatoryAuthority: 'Ofcom UK' },
  { iso2: 'DE', iso3: 'DEU', continentCode: 'EU', name: 'Germany', callingCode: '49', nsnMinLength: 10, nsnMaxLength: 11, regulatoryAuthority: 'Bundesnetzagentur (BNetzA)' },
  { iso2: 'FR', iso3: 'FRA', continentCode: 'EU', name: 'France', callingCode: '33', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'ARCEP France' },
  { iso2: 'ES', iso3: 'ESP', continentCode: 'EU', name: 'Spain', callingCode: '34', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'CNMC Spain' },
  { iso2: 'IT', iso3: 'ITA', continentCode: 'EU', name: 'Italy', callingCode: '39', nsnMinLength: 9, nsnMaxLength: 10, regulatoryAuthority: 'AGCOM Italy' },
  { iso2: 'NL', iso3: 'NLD', continentCode: 'EU', name: 'Netherlands', callingCode: '31', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'ACM Netherlands' },
  { iso2: 'CH', iso3: 'CHE', continentCode: 'EU', name: 'Switzerland', callingCode: '41', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'BAKOM / OFCOM' },
  { iso2: 'SE', iso3: 'SWE', continentCode: 'EU', name: 'Sweden', callingCode: '46', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'PTS Sweden' },
  { iso2: 'PL', iso3: 'POL', continentCode: 'EU', name: 'Poland', callingCode: '48', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'UKE Poland' },
  // Asia & Middle East
  { iso2: 'JP', iso3: 'JPN', continentCode: 'AS', name: 'Japan', callingCode: '81', nsnMinLength: 9, nsnMaxLength: 10, regulatoryAuthority: 'MIC Japan' },
  { iso2: 'IN', iso3: 'IND', continentCode: 'AS', name: 'India', callingCode: '91', nsnMinLength: 10, nsnMaxLength: 10, regulatoryAuthority: 'TRAI / DoT India' },
  { iso2: 'SG', iso3: 'SGP', continentCode: 'AS', name: 'Singapore', callingCode: '65', nsnMinLength: 8, nsnMaxLength: 8, regulatoryAuthority: 'IMDA Singapore' },
  { iso2: 'KR', iso3: 'KOR', continentCode: 'AS', name: 'South Korea', callingCode: '82', nsnMinLength: 9, nsnMaxLength: 10, regulatoryAuthority: 'MSIT South Korea' },
  { iso2: 'AE', iso3: 'ARE', continentCode: 'AS', name: 'United Arab Emirates', callingCode: '971', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'TDRA UAE' },
  { iso2: 'PH', iso3: 'PHL', continentCode: 'AS', name: 'Philippines', callingCode: '63', nsnMinLength: 10, nsnMaxLength: 10, regulatoryAuthority: 'NTC Philippines' },
  { iso2: 'ID', iso3: 'IDN', continentCode: 'AS', name: 'Indonesia', callingCode: '62', nsnMinLength: 10, nsnMaxLength: 11, regulatoryAuthority: 'Kominfo Indonesia' },
  // South America
  { iso2: 'BR', iso3: 'BRA', continentCode: 'SA', name: 'Brazil', callingCode: '55', nsnMinLength: 10, nsnMaxLength: 11, regulatoryAuthority: 'Anatel Brazil' },
  { iso2: 'AR', iso3: 'ARG', continentCode: 'SA', name: 'Argentina', callingCode: '54', nsnMinLength: 10, nsnMaxLength: 11, regulatoryAuthority: 'ENACOM Argentina' },
  { iso2: 'CO', iso3: 'COL', continentCode: 'SA', name: 'Colombia', callingCode: '57', nsnMinLength: 10, nsnMaxLength: 10, regulatoryAuthority: 'CRC Colombia' },
  { iso2: 'CL', iso3: 'CHL', continentCode: 'SA', name: 'Chile', callingCode: '56', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'SUBTEL Chile' },
  // Africa
  { iso2: 'NG', iso3: 'NGA', continentCode: 'AF', name: 'Nigeria', callingCode: '234', nsnMinLength: 8, nsnMaxLength: 10, regulatoryAuthority: 'NCC Nigeria' },
  { iso2: 'ZA', iso3: 'ZAF', continentCode: 'AF', name: 'South Africa', callingCode: '27', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'ICASA South Africa' },
  { iso2: 'KE', iso3: 'KEN', continentCode: 'AF', name: 'Kenya', callingCode: '254', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'CA Kenya' },
  { iso2: 'EG', iso3: 'EGY', continentCode: 'AF', name: 'Egypt', callingCode: '20', nsnMinLength: 10, nsnMaxLength: 10, regulatoryAuthority: 'NTRA Egypt' },
  { iso2: 'GH', iso3: 'GHA', continentCode: 'AF', name: 'Ghana', callingCode: '233', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'NCA Ghana' },
  // Oceania
  { iso2: 'AU', iso3: 'AUS', continentCode: 'OC', name: 'Australia', callingCode: '61', nsnMinLength: 9, nsnMaxLength: 9, regulatoryAuthority: 'ACMA Australia' },
  { iso2: 'NZ', iso3: 'NZL', continentCode: 'OC', name: 'New Zealand', callingCode: '64', nsnMinLength: 8, nsnMaxLength: 9, regulatoryAuthority: 'NAD New Zealand' },
];

const INTERNATIONAL_REGIONS: RegionRecord[] = [
  // Canada
  { id: 'CA-ON', countryIso2: 'CA', code: 'ON', name: 'Ontario', timezone: 'America/Toronto' },
  { id: 'CA-BC', countryIso2: 'CA', code: 'BC', name: 'British Columbia', timezone: 'America/Vancouver' },
  { id: 'CA-QC', countryIso2: 'CA', code: 'QC', name: 'Quebec', timezone: 'America/Montreal' },
  { id: 'CA-AB', countryIso2: 'CA', code: 'AB', name: 'Alberta', timezone: 'America/Edmonton' },
  // Mexico
  { id: 'MX-CMX', countryIso2: 'MX', code: 'CMX', name: 'Ciudad de México', timezone: 'America/Mexico_City' },
  { id: 'MX-JAL', countryIso2: 'MX', code: 'JAL', name: 'Jalisco', timezone: 'America/Mexico_City' },
  { id: 'MX-NLE', countryIso2: 'MX', code: 'NLE', name: 'Nuevo León', timezone: 'America/Monterrey' },
  // Europe
  { id: 'GB-ENG', countryIso2: 'GB', code: 'ENG', name: 'England', timezone: 'Europe/London' },
  { id: 'GB-SCT', countryIso2: 'GB', code: 'SCT', name: 'Scotland', timezone: 'Europe/London' },
  { id: 'DE-BE', countryIso2: 'DE', code: 'BE', name: 'Berlin', timezone: 'Europe/Berlin' },
  { id: 'DE-BY', countryIso2: 'DE', code: 'BY', name: 'Bavaria', timezone: 'Europe/Berlin' },
  { id: 'DE-HE', countryIso2: 'DE', code: 'HE', name: 'Hesse', timezone: 'Europe/Berlin' },
  { id: 'FR-IDF', countryIso2: 'FR', code: 'IDF', name: 'Île-de-France', timezone: 'Europe/Paris' },
  { id: 'FR-ARA', countryIso2: 'FR', code: 'ARA', name: 'Auvergne-Rhône-Alpes', timezone: 'Europe/Paris' },
  { id: 'ES-MD', countryIso2: 'ES', code: 'MD', name: 'Madrid', timezone: 'Europe/Madrid' },
  { id: 'ES-CT', countryIso2: 'ES', code: 'CT', name: 'Catalonia', timezone: 'Europe/Madrid' },
  { id: 'IT-LOM', countryIso2: 'IT', code: 'LOM', name: 'Lombardy', timezone: 'Europe/Rome' },
  { id: 'IT-LAZ', countryIso2: 'IT', code: 'LAZ', name: 'Lazio', timezone: 'Europe/Rome' },
  { id: 'NL-NH', countryIso2: 'NL', code: 'NH', name: 'North Holland', timezone: 'Europe/Amsterdam' },
  { id: 'CH-ZH', countryIso2: 'CH', code: 'ZH', name: 'Zurich', timezone: 'Europe/Zurich' },
  { id: 'SE-AB', countryIso2: 'SE', code: 'AB', name: 'Stockholm County', timezone: 'Europe/Stockholm' },
  { id: 'PL-MZ', countryIso2: 'PL', code: 'MZ', name: 'Masovian (Warsaw)', timezone: 'Europe/Warsaw' },
  // Asia & Middle East
  { id: 'JP-13', countryIso2: 'JP', code: '13', name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'JP-27', countryIso2: 'JP', code: '27', name: 'Osaka', timezone: 'Asia/Tokyo' },
  { id: 'IN-MH', countryIso2: 'IN', code: 'MH', name: 'Maharashtra', timezone: 'Asia/Kolkata' },
  { id: 'IN-KA', countryIso2: 'IN', code: 'KA', name: 'Karnataka', timezone: 'Asia/Kolkata' },
  { id: 'IN-DL', countryIso2: 'IN', code: 'DL', name: 'Delhi NCR', timezone: 'Asia/Kolkata' },
  { id: 'SG-01', countryIso2: 'SG', code: '01', name: 'Central Singapore', timezone: 'Asia/Singapore' },
  { id: 'KR-11', countryIso2: 'KR', code: '11', name: 'Seoul', timezone: 'Asia/Seoul' },
  { id: 'AE-DU', countryIso2: 'AE', code: 'DU', name: 'Dubai', timezone: 'Asia/Dubai' },
  { id: 'PH-NCR', countryIso2: 'PH', code: 'NCR', name: 'Metro Manila', timezone: 'Asia/Manila' },
  { id: 'ID-JK', countryIso2: 'ID', code: 'JK', name: 'Jakarta', timezone: 'Asia/Jakarta' },
  // South America
  { id: 'BR-SP', countryIso2: 'BR', code: 'SP', name: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { id: 'BR-RJ', countryIso2: 'BR', code: 'RJ', name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo' },
  { id: 'AR-C', countryIso2: 'AR', code: 'C', name: 'Buenos Aires CABA', timezone: 'America/Argentina/Buenos_Aires' },
  { id: 'CO-DC', countryIso2: 'CO', code: 'DC', name: 'Bogotá D.C.', timezone: 'America/Bogota' },
  { id: 'CL-RM', countryIso2: 'CL', code: 'RM', name: 'Santiago Metropolitan', timezone: 'America/Santiago' },
  // Africa
  { id: 'NG-LA', countryIso2: 'NG', code: 'LA', name: 'Lagos State', timezone: 'Africa/Lagos' },
  { id: 'ZA-GP', countryIso2: 'ZA', code: 'GP', name: 'Gauteng', timezone: 'Africa/Johannesburg' },
  { id: 'ZA-WC', countryIso2: 'ZA', code: 'WC', name: 'Western Cape', timezone: 'Africa/Johannesburg' },
  { id: 'KE-30', countryIso2: 'KE', code: '30', name: 'Nairobi County', timezone: 'Africa/Nairobi' },
  { id: 'EG-C', countryIso2: 'EG', code: 'C', name: 'Cairo Governorate', timezone: 'Africa/Cairo' },
  { id: 'GH-AA', countryIso2: 'GH', code: 'AA', name: 'Greater Accra', timezone: 'Africa/Accra' },
  // Oceania
  { id: 'AU-NSW', countryIso2: 'AU', code: 'NSW', name: 'New South Wales', timezone: 'Australia/Sydney' },
  { id: 'AU-VIC', countryIso2: 'AU', code: 'VIC', name: 'Victoria', timezone: 'Australia/Melbourne' },
  { id: 'AU-QLD', countryIso2: 'AU', code: 'QLD', name: 'Queensland', timezone: 'Australia/Brisbane' },
  { id: 'NZ-AUK', countryIso2: 'NZ', code: 'AUK', name: 'Auckland Region', timezone: 'Pacific/Auckland' },
];

export const REGIONS: RegionRecord[] = [...usRegions, ...INTERNATIONAL_REGIONS];

const INTERNATIONAL_ZIP_CODES: ZipCodeRecord[] = [
  // Canada
  { id: 'CA-M5V2T6', countryIso2: 'CA', regionId: 'CA-ON', postalCode: 'M5V 2T6', city: 'Toronto', latitude: 43.6445, longitude: -79.3951 },
  { id: 'CA-V6B1A1', countryIso2: 'CA', regionId: 'CA-BC', postalCode: 'V6B 1A1', city: 'Vancouver', latitude: 49.2827, longitude: -123.1088 },
  { id: 'CA-H2Y1C6', countryIso2: 'CA', regionId: 'CA-QC', postalCode: 'H2Y 1C6', city: 'Montreal', latitude: 45.5048, longitude: -73.5542 },
  { id: 'CA-T2P1J9', countryIso2: 'CA', regionId: 'CA-AB', postalCode: 'T2P 1J9', city: 'Calgary', latitude: 51.0447, longitude: -114.0719 },
  // Mexico
  { id: 'MX-06600', countryIso2: 'MX', regionId: 'MX-CMX', postalCode: '06600', city: 'Mexico City', latitude: 19.4271, longitude: -99.1676 },
  { id: 'MX-44100', countryIso2: 'MX', regionId: 'MX-JAL', postalCode: '44100', city: 'Guadalajara', latitude: 20.6752, longitude: -103.3473 },
  { id: 'MX-64000', countryIso2: 'MX', regionId: 'MX-NLE', postalCode: '64000', city: 'Monterrey', latitude: 25.6866, longitude: -100.3161 },
  // Europe
  { id: 'GB-SW1A1AA', countryIso2: 'GB', regionId: 'GB-ENG', postalCode: 'SW1A 1AA', city: 'London Westminster', latitude: 51.5014, longitude: -0.1419 },
  { id: 'GB-EC2A4NE', countryIso2: 'GB', regionId: 'GB-ENG', postalCode: 'EC2A 4NE', city: 'London Shoreditch', latitude: 51.5246, longitude: -0.0835 },
  { id: 'GB-EH11YZ', countryIso2: 'GB', regionId: 'GB-SCT', postalCode: 'EH1 1YZ', city: 'Edinburgh', latitude: 55.9533, longitude: -3.1883 },
  { id: 'DE-10115', countryIso2: 'DE', regionId: 'DE-BE', postalCode: '10115', city: 'Berlin', latitude: 52.5323, longitude: 13.3846 },
  { id: 'DE-80331', countryIso2: 'DE', regionId: 'DE-BY', postalCode: '80331', city: 'Munich', latitude: 48.1372, longitude: 11.5755 },
  { id: 'DE-60311', countryIso2: 'DE', regionId: 'DE-HE', postalCode: '60311', city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821 },
  { id: 'FR-75001', countryIso2: 'FR', regionId: 'FR-IDF', postalCode: '75001', city: 'Paris', latitude: 48.8626, longitude: 2.3363 },
  { id: 'FR-69002', countryIso2: 'FR', regionId: 'FR-ARA', postalCode: '69002', city: 'Lyon', latitude: 45.7538, longitude: 4.8322 },
  { id: 'ES-28001', countryIso2: 'ES', regionId: 'ES-MD', postalCode: '28001', city: 'Madrid', latitude: 40.4239, longitude: -3.6865 },
  { id: 'ES-08001', countryIso2: 'ES', regionId: 'ES-CT', postalCode: '08001', city: 'Barcelona', latitude: 41.3809, longitude: 2.1684 },
  { id: 'IT-20121', countryIso2: 'IT', regionId: 'IT-LOM', postalCode: '20121', city: 'Milan', latitude: 45.4642, longitude: 9.1900 },
  { id: 'IT-00184', countryIso2: 'IT', regionId: 'IT-LAZ', postalCode: '00184', city: 'Rome', latitude: 41.8967, longitude: 12.4822 },
  { id: 'NL-1012', countryIso2: 'NL', regionId: 'NL-NH', postalCode: '1012 JS', city: 'Amsterdam', latitude: 52.3702, longitude: 4.8952 },
  { id: 'CH-8001', countryIso2: 'CH', regionId: 'CH-ZH', postalCode: '8001', city: 'Zurich', latitude: 47.3769, longitude: 8.5417 },
  { id: 'SE-11120', countryIso2: 'SE', regionId: 'SE-AB', postalCode: '111 20', city: 'Stockholm', latitude: 59.3293, longitude: 18.0686 },
  { id: 'PL-00001', countryIso2: 'PL', regionId: 'PL-MZ', postalCode: '00-001', city: 'Warsaw', latitude: 52.2297, longitude: 21.0122 },
  // Asia & Middle East
  { id: 'JP-1000001', countryIso2: 'JP', regionId: 'JP-13', postalCode: '100-0001', city: 'Tokyo', latitude: 35.6852, longitude: 139.7528 },
  { id: 'JP-5300001', countryIso2: 'JP', regionId: 'JP-27', postalCode: '530-0001', city: 'Osaka', latitude: 34.7025, longitude: 135.4961 },
  { id: 'IN-400001', countryIso2: 'IN', regionId: 'IN-MH', postalCode: '400001', city: 'Mumbai', latitude: 18.9346, longitude: 72.8362 },
  { id: 'IN-560001', countryIso2: 'IN', regionId: 'IN-KA', postalCode: '560001', city: 'Bengaluru', latitude: 12.9756, longitude: 77.6066 },
  { id: 'IN-110001', countryIso2: 'IN', regionId: 'IN-DL', postalCode: '110001', city: 'New Delhi', latitude: 28.6315, longitude: 77.2167 },
  { id: 'SG-018956', countryIso2: 'SG', regionId: 'SG-01', postalCode: '018956', city: 'Singapore', latitude: 1.2834, longitude: 103.8607 },
  { id: 'KR-04524', countryIso2: 'KR', regionId: 'KR-11', postalCode: '04524', city: 'Seoul', latitude: 37.5665, longitude: 126.9780 },
  { id: 'AE-00000', countryIso2: 'AE', regionId: 'AE-DU', postalCode: '00000', city: 'Dubai Downtown', latitude: 25.2048, longitude: 55.2708 },
  { id: 'PH-1226', countryIso2: 'PH', regionId: 'PH-NCR', postalCode: '1226', city: 'Makati Manila', latitude: 14.5547, longitude: 121.0244 },
  { id: 'ID-10110', countryIso2: 'ID', regionId: 'ID-JK', postalCode: '10110', city: 'Central Jakarta', latitude: -6.1751, longitude: 106.8650 },
  // South America
  { id: 'BR-01310100', countryIso2: 'BR', regionId: 'BR-SP', postalCode: '01310-100', city: 'São Paulo', latitude: -23.5614, longitude: -46.6559 },
  { id: 'BR-20040002', countryIso2: 'BR', regionId: 'BR-RJ', postalCode: '20040-002', city: 'Rio de Janeiro', latitude: -22.9035, longitude: -43.1769 },
  { id: 'AR-C1002', countryIso2: 'AR', regionId: 'AR-C', postalCode: 'C1002', city: 'Buenos Aires', latitude: -34.6037, longitude: -58.3816 },
  { id: 'CO-110111', countryIso2: 'CO', regionId: 'CO-DC', postalCode: '110111', city: 'Bogotá', latitude: 4.7110, longitude: -74.0721 },
  { id: 'CL-8320000', countryIso2: 'CL', regionId: 'CL-RM', postalCode: '8320000', city: 'Santiago', latitude: -33.4489, longitude: -70.6693 },
  // Africa
  { id: 'NG-101241', countryIso2: 'NG', regionId: 'NG-LA', postalCode: '101241', city: 'Lagos', latitude: 6.4281, longitude: 3.4219 },
  { id: 'ZA-2000', countryIso2: 'ZA', regionId: 'ZA-GP', postalCode: '2000', city: 'Johannesburg', latitude: -26.2041, longitude: 28.0473 },
  { id: 'ZA-8001', countryIso2: 'ZA', regionId: 'ZA-WC', postalCode: '8001', city: 'Cape Town', latitude: -33.9249, longitude: 18.4241 },
  { id: 'KE-00100', countryIso2: 'KE', regionId: 'KE-30', postalCode: '00100', city: 'Nairobi', latitude: -1.2864, longitude: 36.8172 },
  { id: 'EG-11511', countryIso2: 'EG', regionId: 'EG-C', postalCode: '11511', city: 'Cairo', latitude: 30.0444, longitude: 31.2357 },
  { id: 'GH-GA100', countryIso2: 'GH', regionId: 'GH-AA', postalCode: 'GA-100', city: 'Accra', latitude: 5.6037, longitude: -0.1870 },
  // Oceania
  { id: 'AU-2000', countryIso2: 'AU', regionId: 'AU-NSW', postalCode: '2000', city: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  { id: 'AU-3000', countryIso2: 'AU', regionId: 'AU-VIC', postalCode: '3000', city: 'Melbourne', latitude: -37.8136, longitude: 144.9631 },
  { id: 'AU-4000', countryIso2: 'AU', regionId: 'AU-QLD', postalCode: '4000', city: 'Brisbane', latitude: -27.4705, longitude: 153.0260 },
  { id: 'NZ-1010', countryIso2: 'NZ', regionId: 'NZ-AUK', postalCode: '1010', city: 'Auckland', latitude: -36.8485, longitude: 174.7633 },
];

export const ZIP_CODES: ZipCodeRecord[] = [...usZipCodes, ...INTERNATIONAL_ZIP_CODES];

const BASE_INTERNATIONAL_PREFIXES: PrefixCarrierAllocation[] = [
  // Canada & Mexico
  { id: 'PFX-CA-416360', fullPrefix: '1416360', countryIso2: 'CA', callingCode: '1', ndcPrefix: '416-360', carrierName: 'Rogers Wireless', carrierGroup: 'Rogers', ocnCode: 'CNA-8082', lineType: 'MOBILE', regionId: 'CA-ON', zipId: 'CA-M5V2T6', allocationSource: 'Canadian Numbering Administrator' },
  { id: 'PFX-CA-604681', fullPrefix: '1604681', countryIso2: 'CA', callingCode: '1', ndcPrefix: '604-681', carrierName: 'TELUS Mobility', carrierGroup: 'Telus', ocnCode: 'CNA-8103', lineType: 'MOBILE', regionId: 'CA-BC', zipId: 'CA-V6B1A1', allocationSource: 'Canadian Numbering Administrator' },
  { id: 'PFX-CA-514842', fullPrefix: '1514842', countryIso2: 'CA', callingCode: '1', ndcPrefix: '514-842', carrierName: 'Bell Canada', carrierGroup: 'Bell', ocnCode: 'CNA-8011', lineType: 'LANDLINE', regionId: 'CA-QC', zipId: 'CA-H2Y1C6', allocationSource: 'Canadian Numbering Administrator' },
  { id: 'PFX-CA-403262', fullPrefix: '1403262', countryIso2: 'CA', callingCode: '1', ndcPrefix: '403-262', carrierName: 'Rogers Wireless', carrierGroup: 'Rogers', ocnCode: 'CNA-8082', lineType: 'MOBILE', regionId: 'CA-AB', zipId: 'CA-T2P1J9', allocationSource: 'Canadian Numbering Administrator' },
  { id: 'PFX-MX-555200', fullPrefix: '52555200', countryIso2: 'MX', callingCode: '52', ndcPrefix: '55-5200', carrierName: 'Telcel México', carrierGroup: 'Telcel', ocnCode: 'IFT-188', lineType: 'MOBILE', regionId: 'MX-CMX', zipId: 'MX-06600', allocationSource: 'IFT Numeración México' },
  { id: 'PFX-MX-333614', fullPrefix: '52333614', countryIso2: 'MX', callingCode: '52', ndcPrefix: '33-3614', carrierName: 'AT&T México', carrierGroup: 'AT&T', ocnCode: 'IFT-204', lineType: 'MOBILE', regionId: 'MX-JAL', zipId: 'MX-44100', allocationSource: 'IFT Numeración México' },
  { id: 'PFX-MX-818340', fullPrefix: '52818340', countryIso2: 'MX', callingCode: '52', ndcPrefix: '81-8340', carrierName: 'Telcel Monterrey', carrierGroup: 'Telcel', ocnCode: 'IFT-188', lineType: 'MOBILE', regionId: 'MX-NLE', zipId: 'MX-64000', allocationSource: 'IFT Numeración México' },

  // Europe
  { id: 'PFX-GB-207946', fullPrefix: '44207946', countryIso2: 'GB', callingCode: '44', ndcPrefix: '20-7946', carrierName: 'British Telecom (BT)', carrierGroup: 'BT', ocnCode: 'OFCOM-BT', lineType: 'LANDLINE', regionId: 'GB-ENG', zipId: 'GB-SW1A1AA', allocationSource: 'Ofcom UK Numbering Plan' },
  { id: 'PFX-GB-770090', fullPrefix: '44770090', countryIso2: 'GB', callingCode: '44', ndcPrefix: '7700-90', carrierName: 'Vodafone UK', carrierGroup: 'Vodafone', ocnCode: 'MCC234-15', lineType: 'MOBILE', regionId: 'GB-ENG', zipId: 'GB-EC2A4NE', allocationSource: 'Ofcom UK Mobile S7' },
  { id: 'PFX-GB-791124', fullPrefix: '44791124', countryIso2: 'GB', callingCode: '44', ndcPrefix: '7911-24', carrierName: 'EE Limited', carrierGroup: 'EE', ocnCode: 'MCC234-30', lineType: 'MOBILE', regionId: 'GB-ENG', zipId: 'GB-SW1A1AA', allocationSource: 'Ofcom UK Mobile S7' },
  { id: 'PFX-GB-131496', fullPrefix: '44131496', countryIso2: 'GB', callingCode: '44', ndcPrefix: '131-496', carrierName: 'O2 UK', carrierGroup: 'O2', ocnCode: 'MCC234-10', lineType: 'LANDLINE', regionId: 'GB-SCT', zipId: 'GB-EH11YZ', allocationSource: 'Ofcom UK Geographic' },
  { id: 'PFX-DE-151234', fullPrefix: '49151234', countryIso2: 'DE', callingCode: '49', ndcPrefix: '151-234', carrierName: 'Telekom Deutschland', carrierGroup: 'Telekom Deutschland', ocnCode: 'BNETZA-D1', lineType: 'MOBILE', regionId: 'DE-BE', zipId: 'DE-10115', allocationSource: 'Bundesnetzagentur' },
  { id: 'PFX-DE-172410', fullPrefix: '49172410', countryIso2: 'DE', callingCode: '49', ndcPrefix: '172-410', carrierName: 'Vodafone Germany', carrierGroup: 'Vodafone', ocnCode: 'BNETZA-D2', lineType: 'MOBILE', regionId: 'DE-BY', zipId: 'DE-80331', allocationSource: 'Bundesnetzagentur' },
  { id: 'PFX-DE-692108', fullPrefix: '49692108', countryIso2: 'DE', callingCode: '49', ndcPrefix: '69-2108', carrierName: 'Telekom Festnetz', carrierGroup: 'Telekom Deutschland', ocnCode: 'BNETZA-069', lineType: 'LANDLINE', regionId: 'DE-HE', zipId: 'DE-60311', allocationSource: 'Bundesnetzagentur' },
  { id: 'PFX-FR-60742', fullPrefix: '3360742', countryIso2: 'FR', callingCode: '33', ndcPrefix: '6-0742', carrierName: 'Orange France', carrierGroup: 'Orange', ocnCode: 'ARCEP-ORA', lineType: 'MOBILE', regionId: 'FR-IDF', zipId: 'FR-75001', allocationSource: 'ARCEP Plan National' },
  { id: 'PFX-FR-47828', fullPrefix: '3347828', countryIso2: 'FR', callingCode: '33', ndcPrefix: '4-7828', carrierName: 'SFR France', carrierGroup: 'SFR', ocnCode: 'ARCEP-SFR', lineType: 'LANDLINE', regionId: 'FR-ARA', zipId: 'FR-69002', allocationSource: 'ARCEP Plan National' },
  { id: 'PFX-ES-60931', fullPrefix: '3460931', countryIso2: 'ES', callingCode: '34', ndcPrefix: '609-31', carrierName: 'Movistar España', carrierGroup: 'Movistar', ocnCode: 'CNMC-MOV', lineType: 'MOBILE', regionId: 'ES-MD', zipId: 'ES-28001', allocationSource: 'CNMC España' },
  { id: 'PFX-ES-60744', fullPrefix: '3460744', countryIso2: 'ES', callingCode: '34', ndcPrefix: '607-44', carrierName: 'Vodafone España', carrierGroup: 'Vodafone', ocnCode: 'CNMC-VOD', lineType: 'MOBILE', regionId: 'ES-CT', zipId: 'ES-08001', allocationSource: 'CNMC España' },
  { id: 'PFX-IT-335210', fullPrefix: '39335210', countryIso2: 'IT', callingCode: '39', ndcPrefix: '335-210', carrierName: 'TIM Italia S.p.A.', carrierGroup: 'TIM', ocnCode: 'AGCOM-TIM', lineType: 'MOBILE', regionId: 'IT-LOM', zipId: 'IT-20121', allocationSource: 'AGCOM Piano Numerazione' },
  { id: 'PFX-IT-348510', fullPrefix: '39348510', countryIso2: 'IT', callingCode: '39', ndcPrefix: '348-510', carrierName: 'Vodafone Italia', carrierGroup: 'Vodafone', ocnCode: 'AGCOM-VOD', lineType: 'MOBILE', regionId: 'IT-LAZ', zipId: 'IT-00184', allocationSource: 'AGCOM Piano Numerazione' },
  { id: 'PFX-NL-65120', fullPrefix: '3165120', countryIso2: 'NL', callingCode: '31', ndcPrefix: '6-5120', carrierName: 'KPN Mobile Netherlands', carrierGroup: 'KPN', ocnCode: 'ACM-KPN', lineType: 'MOBILE', regionId: 'NL-NH', zipId: 'NL-1012', allocationSource: 'ACM Nummerplan' },
  { id: 'PFX-CH-79410', fullPrefix: '4179410', countryIso2: 'CH', callingCode: '41', ndcPrefix: '79-410', carrierName: 'Swisscom (Schweiz) AG', carrierGroup: 'Swisscom', ocnCode: 'BAKOM-SWC', lineType: 'MOBILE', regionId: 'CH-ZH', zipId: 'CH-8001', allocationSource: 'BAKOM E.164 Register' },
  { id: 'PFX-SE-70310', fullPrefix: '4670310', countryIso2: 'SE', callingCode: '46', ndcPrefix: '70-310', carrierName: 'Telia Sverige AB', carrierGroup: 'Telia', ocnCode: 'PTS-TELIA', lineType: 'MOBILE', regionId: 'SE-AB', zipId: 'SE-11120', allocationSource: 'PTS Nummerplan' },
  { id: 'PFX-PL-60124', fullPrefix: '4860124', countryIso2: 'PL', callingCode: '48', ndcPrefix: '601-24', carrierName: 'Plus (Polkomtel)', carrierGroup: 'Polkomtel', ocnCode: 'UKE-PLUS', lineType: 'MOBILE', regionId: 'PL-MZ', zipId: 'PL-00001', allocationSource: 'UKE Tablica Zagospodarowania' },

  // Asia & Middle East
  { id: 'PFX-JP-903100', fullPrefix: '81903100', countryIso2: 'JP', callingCode: '81', ndcPrefix: '90-3100', carrierName: 'NTT DOCOMO Inc.', carrierGroup: 'NTT Docomo', ocnCode: 'MIC-44010', lineType: 'MOBILE', regionId: 'JP-13', zipId: 'JP-1000001', allocationSource: 'MIC Japan Numbering' },
  { id: 'PFX-JP-805120', fullPrefix: '81805120', countryIso2: 'JP', callingCode: '81', ndcPrefix: '80-5120', carrierName: 'KDDI Corporation (au)', carrierGroup: 'KDDI', ocnCode: 'MIC-44050', lineType: 'MOBILE', regionId: 'JP-27', zipId: 'JP-5300001', allocationSource: 'MIC Japan Numbering' },
  { id: 'PFX-IN-70214', fullPrefix: '9170214', countryIso2: 'IN', callingCode: '91', ndcPrefix: '7021-4', carrierName: 'Reliance Jio Infocomm', carrierGroup: 'Reliance Jio', ocnCode: 'TRAI-JIO', lineType: 'MOBILE', regionId: 'IN-MH', zipId: 'IN-400001', allocationSource: 'DoT / TRAI MSC Table' },
  { id: 'PFX-IN-98450', fullPrefix: '9198450', countryIso2: 'IN', callingCode: '91', ndcPrefix: '9845-0', carrierName: 'Bharti Airtel India', carrierGroup: 'Airtel', ocnCode: 'TRAI-AIR', lineType: 'MOBILE', regionId: 'IN-KA', zipId: 'IN-560001', allocationSource: 'DoT / TRAI MSC Table' },
  { id: 'PFX-IN-98101', fullPrefix: '9198101', countryIso2: 'IN', callingCode: '91', ndcPrefix: '9810-1', carrierName: 'Bharti Airtel Delhi', carrierGroup: 'Airtel', ocnCode: 'TRAI-DEL', lineType: 'MOBILE', regionId: 'IN-DL', zipId: 'IN-110001', allocationSource: 'DoT / TRAI MSC Table' },
  { id: 'PFX-SG-9112', fullPrefix: '659112', countryIso2: 'SG', callingCode: '65', ndcPrefix: '9112', carrierName: 'Singtel Mobile', carrierGroup: 'Singtel', ocnCode: 'IMDA-SGT', lineType: 'MOBILE', regionId: 'SG-01', zipId: 'SG-018956', allocationSource: 'IMDA Singapore Plan' },
  { id: 'PFX-KR-103120', fullPrefix: '82103120', countryIso2: 'KR', callingCode: '82', ndcPrefix: '10-3120', carrierName: 'SK Telecom Co.', carrierGroup: 'SK Telecom', ocnCode: 'MSIT-SKT', lineType: 'MOBILE', regionId: 'KR-11', zipId: 'KR-04524', allocationSource: 'MSIT Korea Plan' },
  { id: 'PFX-AE-50421', fullPrefix: '97150421', countryIso2: 'AE', callingCode: '971', ndcPrefix: '50-421', carrierName: 'Etisalat by e& UAE', carrierGroup: 'Etisalat', ocnCode: 'TDRA-42402', lineType: 'MOBILE', regionId: 'AE-DU', zipId: 'AE-00000', allocationSource: 'TDRA UAE Numbering Plan' },
  { id: 'PFX-PH-917310', fullPrefix: '63917310', countryIso2: 'PH', callingCode: '63', ndcPrefix: '917-310', carrierName: 'Globe Telecom Inc.', carrierGroup: 'Globe', ocnCode: 'NTC-51502', lineType: 'MOBILE', regionId: 'PH-NCR', zipId: 'PH-1226', allocationSource: 'NTC Philippines Plan' },
  { id: 'PFX-ID-812310', fullPrefix: '62812310', countryIso2: 'ID', callingCode: '62', ndcPrefix: '812-310', carrierName: 'Telkomsel Indonesia', carrierGroup: 'Telkomsel', ocnCode: 'KOM-51010', lineType: 'MOBILE', regionId: 'ID-JK', zipId: 'ID-10110', allocationSource: 'Kominfo Numbering Plan' },

  // South America
  { id: 'PFX-BR-1199610', fullPrefix: '551199610', countryIso2: 'BR', callingCode: '55', ndcPrefix: '11-99610', carrierName: 'Vivo (Telefônica Brasil)', carrierGroup: 'Vivo', ocnCode: 'ANATEL-320', lineType: 'MOBILE', regionId: 'BR-SP', zipId: 'BR-01310100', allocationSource: 'Anatel Brasil' },
  { id: 'PFX-BR-2199820', fullPrefix: '552199820', countryIso2: 'BR', callingCode: '55', ndcPrefix: '21-99820', carrierName: 'Claro Brasil', carrierGroup: 'Claro', ocnCode: 'ANATEL-321', lineType: 'MOBILE', regionId: 'BR-RJ', zipId: 'BR-20040002', allocationSource: 'Anatel Brasil' },
  { id: 'PFX-AR-9115420', fullPrefix: '549115420', countryIso2: 'AR', callingCode: '54', ndcPrefix: '911-5420', carrierName: 'Personal Argentina', carrierGroup: 'Personal', ocnCode: 'ENACOM-340', lineType: 'MOBILE', regionId: 'AR-C', zipId: 'AR-C1002', allocationSource: 'ENACOM Argentina' },
  { id: 'PFX-CO-310240', fullPrefix: '57310240', countryIso2: 'CO', callingCode: '57', ndcPrefix: '310-240', carrierName: 'Claro Colombia (Comcel)', carrierGroup: 'Claro', ocnCode: 'CRC-732101', lineType: 'MOBILE', regionId: 'CO-DC', zipId: 'CO-110111', allocationSource: 'CRC Colombia Plan' },
  { id: 'PFX-CL-99231', fullPrefix: '5699231', countryIso2: 'CL', callingCode: '56', ndcPrefix: '9-9231', carrierName: 'Entel PCS Chile', carrierGroup: 'Entel', ocnCode: 'SUBTEL-73001', lineType: 'MOBILE', regionId: 'CL-RM', zipId: 'CL-8320000', allocationSource: 'SUBTEL Chile' },

  // Africa
  { id: 'PFX-NG-803310', fullPrefix: '234803310', countryIso2: 'NG', callingCode: '234', ndcPrefix: '803-310', carrierName: 'MTN Nigeria', carrierGroup: 'MTN', ocnCode: 'NCC-62130', lineType: 'MOBILE', regionId: 'NG-LA', zipId: 'NG-101241', allocationSource: 'NCC Nigeria Plan' },
  { id: 'PFX-ZA-82450', fullPrefix: '2782450', countryIso2: 'ZA', callingCode: '27', ndcPrefix: '82-450', carrierName: 'Vodacom South Africa', carrierGroup: 'Vodafone', ocnCode: 'ICASA-65501', lineType: 'MOBILE', regionId: 'ZA-GP', zipId: 'ZA-2000', allocationSource: 'ICASA South Africa' },
  { id: 'PFX-ZA-21461', fullPrefix: '2721461', countryIso2: 'ZA', callingCode: '27', ndcPrefix: '21-461', carrierName: 'Telkom SA', carrierGroup: 'Telkom SA', ocnCode: 'ICASA-021', lineType: 'LANDLINE', regionId: 'ZA-WC', zipId: 'ZA-8001', allocationSource: 'ICASA South Africa' },
  { id: 'PFX-KE-722310', fullPrefix: '254722310', countryIso2: 'KE', callingCode: '254', ndcPrefix: '722-310', carrierName: 'Safaricom Kenya', carrierGroup: 'Safaricom', ocnCode: 'CA-63902', lineType: 'MOBILE', regionId: 'KE-30', zipId: 'KE-00100', allocationSource: 'CA Kenya Plan' },
  { id: 'PFX-EG-100310', fullPrefix: '20100310', countryIso2: 'EG', callingCode: '20', ndcPrefix: '100-310', carrierName: 'Vodafone Egypt', carrierGroup: 'Vodafone', ocnCode: 'NTRA-60202', lineType: 'MOBILE', regionId: 'EG-C', zipId: 'EG-11511', allocationSource: 'NTRA Egypt Plan' },
  { id: 'PFX-GH-24431', fullPrefix: '23324431', countryIso2: 'GH', callingCode: '233', ndcPrefix: '24-431', carrierName: 'MTN Ghana', carrierGroup: 'MTN', ocnCode: 'NCA-62001', lineType: 'MOBILE', regionId: 'GH-AA', zipId: 'GH-GA100', allocationSource: 'NCA Ghana Plan' },

  // Oceania
  { id: 'PFX-AU-418240', fullPrefix: '61418240', countryIso2: 'AU', callingCode: '61', ndcPrefix: '418-240', carrierName: 'Telstra Australia', carrierGroup: 'Telstra', ocnCode: 'ACMA-50501', lineType: 'MOBILE', regionId: 'AU-NSW', zipId: 'AU-2000', allocationSource: 'ACMA Register' },
  { id: 'PFX-AU-39650', fullPrefix: '6139650', countryIso2: 'AU', callingCode: '61', ndcPrefix: '3-9650', carrierName: 'Optus Australia', carrierGroup: 'Optus', ocnCode: 'ACMA-50502', lineType: 'LANDLINE', regionId: 'AU-VIC', zipId: 'AU-3000', allocationSource: 'ACMA Register' },
  { id: 'PFX-AU-411520', fullPrefix: '61411520', countryIso2: 'AU', callingCode: '61', ndcPrefix: '411-520', carrierName: 'Optus Mobile QLD', carrierGroup: 'Optus', ocnCode: 'ACMA-50502', lineType: 'MOBILE', regionId: 'AU-QLD', zipId: 'AU-4000', allocationSource: 'ACMA Register' },
  { id: 'PFX-NZ-21450', fullPrefix: '6421450', countryIso2: 'NZ', callingCode: '64', ndcPrefix: '21-450', carrierName: 'One New Zealand', carrierGroup: 'One NZ', ocnCode: 'NAD-53001', lineType: 'MOBILE', regionId: 'NZ-AUK', zipId: 'NZ-1010', allocationSource: 'NAD Register' },
];

function expandInternationalPrefixBlocks(
  baseList: PrefixCarrierAllocation[]
): PrefixCarrierAllocation[] {
  const expanded: PrefixCarrierAllocation[] = [];
  const seen = new Set<string>();

  for (const item of baseList) {
    // Expand each international prefix into 3 adjacent 10,000-number sub-blocks where valid
    for (const delta of [0, 1, 2]) {
      const lastTwo = parseInt(item.fullPrefix.slice(-2), 10);
      const nextTwo = lastTwo + delta;
      if (nextTwo > 98) continue;
      const derivedFull = item.fullPrefix.slice(0, -2) + String(nextTwo).padStart(2, '0');
      if (seen.has(derivedFull)) continue;
      seen.add(derivedFull);

      expanded.push({
        ...item,
        id: delta === 0 ? item.id : `${item.id}-B${delta}`,
        fullPrefix: derivedFull,
      });
    }
  }
  return expanded;
}

export const PREFIX_ALLOCATIONS: PrefixCarrierAllocation[] = [
  ...usPrefixAllocations,
  ...expandInternationalPrefixBlocks(BASE_INTERNATIONAL_PREFIXES),
];

const REGIONAL_FIRST_NAMES: Record<string, string[]> = {
  DEFAULT: ['James', 'Michael', 'Robert', 'David', 'Daniel', 'Matthew', 'Christopher', 'Andrew', 'Joshua', 'Ryan', 'Sarah', 'Emily', 'Jessica', 'Rachel', 'Hannah', 'Olivia', 'Sophia', 'Claire', 'Natalie', 'Lauren', 'Marcus', 'Elena', 'Lucas', 'Victoria', 'Nathan', 'Samantha'],
  ES: ['Carlos', 'Alejandro', 'Mateo', 'Javier', 'Diego', 'Lucía', 'Sofía', 'Martina', 'Carmen', 'Elena', 'Pablo', 'Álvaro', 'Valeria', 'Paula'],
  MX: ['Santiago', 'Mateo', 'Sebastián', 'Diego', 'Emiliano', 'Valentina', 'Camila', 'Sofía', 'Mariana', 'Fernanda', 'Alejandro', 'Daniela'],
  AR: ['Juan', 'Bautista', 'Joaquín', 'Tomás', 'Valentina', 'Martina', 'Catalina', 'Camila', 'Nicolás', 'Agustina'],
  CO: ['Andrés', 'Camilo', 'Santiago', 'Juan', 'Laura', 'Daniela', 'Valentina', 'Carolina', 'Felipe', 'Natalia'],
  CL: ['Benjamín', 'Vicente', 'Matías', 'Martín', 'Catalina', 'Florencia', 'Isidora', 'Antonia', 'Diego', 'Javiera'],
  FR: ['Lucas', 'Gabriel', 'Léo', 'Louis', 'Hugo', 'Camille', 'Léa', 'Manon', 'Chloé', 'Inès', 'Antoine', 'Claire'],
  DE: ['Lukas', 'Maximilian', 'Felix', 'Jonas', 'Leon', 'Hannah', 'Sophia', 'Anna', 'Laura', 'Marie', 'Tobias', 'Katharina'],
  IT: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Matteo', 'Giulia', 'Sofia', 'Aurora', 'Chiara', 'Martina'],
  NL: ['Daan', 'Sem', 'Lucas', 'Bram', 'Finn', 'Emma', 'Julia', 'Sophie', 'Tess', 'Sanne'],
  CH: ['Luca', 'Noah', 'Leon', 'Matteo', 'Mia', 'Emma', 'Elena', 'Lina', 'Jonas', 'Laura'],
  SE: ['William', 'Liam', 'Noah', 'Lucas', 'Oscar', 'Alice', 'Maja', 'Elsa', 'Astrid', 'Freja'],
  PL: ['Piotr', 'Krzysztof', 'Tomasz', 'Paweł', 'Michał', 'Anna', 'Katarzyna', 'Małgorzata', 'Agnieszka', 'Magdalena'],
  JP: ['Kenji', 'Haruto', 'Ren', 'Sota', 'Yuto', 'Yui', 'Hina', 'Aoi', 'Sakura', 'Rin', 'Takashi', 'Akiko'],
  IN: ['Aarav', 'Rohan', 'Vikram', 'Arjun', 'Siddharth', 'Priya', 'Ananya', 'Neha', 'Kavya', 'Aditi', 'Rajesh', 'Meera'],
  KR: ['Min-jun', 'Seo-jun', 'Do-yun', 'Ji-ho', 'Seo-yeon', 'Ji-woo', 'Ha-eun', 'Min-seo', 'Hyun-woo', 'Su-bin'],
  AE: ['Tariq', 'Omar', 'Khalid', 'Zayd', 'Rashid', 'Layla', 'Noor', 'Mariam', 'Fatima', 'Amina'],
  PH: ['Miguel', 'Rafael', 'Gabriel', 'Joshua', 'Maria', 'Angela', 'Bea', 'Camille', 'Carlo', 'Bianca'],
  ID: ['Budi', 'Rizky', 'Andi', 'Dimas', 'Fajar', 'Siti', 'Putri', 'Dewi', 'Ayu', 'Nadia'],
  BR: ['Gabriel', 'Lucas', 'Matheus', 'Pedro', 'Rafael', 'Júlia', 'Beatriz', 'Mariana', 'Larissa', 'Camila'],
  NG: ['Chinedu', 'Oluwaseun', 'Adebayo', 'Emeka', 'Tunde', 'Ngozi', 'Chioma', 'Zainab', 'Funke', 'Amaka'],
  ZA: ['Thabo', 'Sipho', 'Johan', 'Pieter', 'Liam', 'Zanele', 'Nomsa', 'Annelie', 'Chloe', 'Lerato'],
  KE: ['Kamau', 'Otieno', 'Mwangi', 'Kipchoge', 'Brian', 'Wanjiku', 'Achieng', 'Njeri', 'Faith', 'Mercy'],
  EG: ['Ahmed', 'Mohamed', 'Mahmoud', 'Youssef', 'Mostafa', 'Nour', 'Salma', 'Habiba', 'Farida', 'Malak'],
  GH: ['Kwame', 'Kofi', 'Yaw', 'Kojo', 'Nana', 'Ama', 'Akosua', 'Abena', 'Yaa', 'Efua'],
};

const REGIONAL_LAST_NAMES: Record<string, string[]> = {
  DEFAULT: ['Anderson', 'Bennett', 'Campbell', 'Carter', 'Collins', 'Cooper', 'Edwards', 'Evans', 'Foster', 'Graham', 'Harris', 'Henderson', 'Hughes', 'Jenkins', 'Kelly', 'Miller', 'Mitchell', 'Morgan', 'Murphy', 'Nelson', 'Parker', 'Perry', 'Powell', 'Price', 'Reed', 'Reynolds', 'Richardson', 'Robinson', 'Russell', 'Sanders', 'Scott', 'Stewart', 'Sullivan', 'Taylor', 'Thompson', 'Turner', 'Walker', 'Ward', 'Watson', 'Wright'],
  ES: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Navarro'],
  MX: ['Hernández', 'García', 'Martínez', 'López', 'González', 'Pérez', 'Rodríguez', 'Sánchez', 'Ramírez', 'Flores'],
  AR: ['González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Martínez', 'Díaz', 'Pérez', 'Sánchez', 'Romero'],
  CO: ['Rodríguez', 'Gómez', 'González', 'Martínez', 'García', 'López', 'Hernández', 'Sánchez', 'Ramírez', 'Torres'],
  CL: ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda'],
  FR: ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent'],
  DE: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'],
  IT: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'],
  NL: ['De Jong', 'Jansen', 'De Vries', 'Van den Berg', 'Van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Meijer'],
  CH: ['Meier', 'Schmid', 'Keller', 'Weber', 'Huber', 'Schneider', 'Meyer', 'Steiner', 'Fischer', 'Gerber'],
  SE: ['Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson'],
  PL: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak'],
  JP: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato'],
  IN: ['Sharma', 'Patel', 'Verma', 'Iyer', 'Nair', 'Reddy', 'Gupta', 'Mehta', 'Kulkarni', 'Chatterjee'],
  KR: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim'],
  AE: ['Al Maktoum', 'Al Nahyan', 'Al Mansoori', 'Al Hashimi', 'Al Suwaidi', 'Al Nuaimi', 'Al Shamsi', 'Al Mazrouei'],
  PH: ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Villanueva', 'Ramos'],
  ID: ['Saputra', 'Pratama', 'Wijaya', 'Hidayat', 'Santoso', 'Nugroho', 'Kusuma', 'Setiawan', 'Putra', 'Utama'],
  BR: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Costa'],
  NG: ['Okafor', 'Adeyemi', 'Balogun', 'Eze', 'Nwosu', 'Ibrahim', 'Ogunleye', 'Okeke', 'Abubakar', 'Lawal'],
  ZA: ['Nkosi', 'Dlamini', 'Van der Merwe', 'Botha', 'Ndlovu', 'Khumalo', 'Smit', 'Naidoo', 'Pillay', 'Mokoena'],
  KE: ['Ochieng', 'Maina', 'Njoroge', 'Kariuki', 'Onyango', 'Mutua', 'Wambua', 'Koech', 'Kimani', 'Otieno'],
  EG: ['El-Sayed', 'Hassan', 'Ibrahim', 'Ali', 'Mansour', 'Soliman', 'Farouk', 'Nabil', 'Kamel', 'Zaki'],
  GH: ['Mensah', 'Osei', 'Boateng', 'Owusu', 'Appiah', 'Asante', 'Agyemang', 'Amoah', 'Tetteh', 'Gyamfi'],
};

export function getSubscriberNameForCountry(countryIso2: string, seedIndex: number): string {
  const firstPool = REGIONAL_FIRST_NAMES[countryIso2] ?? REGIONAL_FIRST_NAMES.DEFAULT;
  const lastPool = REGIONAL_LAST_NAMES[countryIso2] ?? REGIONAL_LAST_NAMES.DEFAULT;
  const first = firstPool[(seedIndex * 7 + 3) % firstPool.length].trim();
  const rawLast = lastPool[(seedIndex * 13 + 5) % lastPool.length].trim();
  const last = rawLast.charAt(0).toUpperCase() + rawLast.slice(1);
  return `${first} ${last}`;
}
