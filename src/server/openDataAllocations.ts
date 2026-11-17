import type {
  ContinentRecord,
  CountryRecord,
  RegionRecord,
  ZipCodeRecord,
  PrefixCarrierAllocation,
} from '../shared/types.ts';
import { buildAll50UsStatesCatalog } from './us50StatesCatalog.ts';
import { buildWorldwideCatalog, INTERNATIONAL_META_BY_ISO2 } from './worldwideCatalog.ts';

const { usRegions, usZipCodes, usPrefixAllocations } = buildAll50UsStatesCatalog();
const { intlCountries, intlRegions, intlZipCodes, intlPrefixAllocations } = buildWorldwideCatalog();

export const CONTINENTS: ContinentRecord[] = [
  { code: 'NA', name: 'North America', ituZone: 'ITU Zone 1 / Region 2' },
  { code: 'EU', name: 'Europe', ituZone: 'ITU Zones 3 & 4 / Region 1' },
  { code: 'AS', name: 'Asia', ituZone: 'ITU Zones 8 & 9 / Region 3' },
  { code: 'SA', name: 'South America', ituZone: 'ITU Zone 5 / Region 2' },
  { code: 'AF', name: 'Africa', ituZone: 'ITU Zone 2 / Region 1' },
  { code: 'OC', name: 'Oceania', ituZone: 'ITU Zone 6 / Region 3' },
];

export const COUNTRIES: CountryRecord[] = [
  {
    iso2: 'US',
    iso3: 'USA',
    continentCode: 'NA',
    name: 'United States',
    callingCode: '1',
    nsnMinLength: 10,
    nsnMaxLength: 10,
    regulatoryAuthority: 'NANPA / FCC',
  },
  ...intlCountries,
];

export const REGIONS: RegionRecord[] = [...usRegions, ...intlRegions];

export const ZIP_CODES: ZipCodeRecord[] = [...usZipCodes, ...intlZipCodes];

export const PREFIX_ALLOCATIONS: PrefixCarrierAllocation[] = [
  ...usPrefixAllocations,
  ...intlPrefixAllocations,
];

const REGIONAL_FIRST_NAMES: Record<string, string[]> = {
  DEFAULT: [
    'James', 'Michael', 'Robert', 'David', 'Daniel', 'Matthew', 'Christopher', 'Andrew',
    'Joshua', 'Ryan', 'Sarah', 'Emily', 'Jessica', 'Rachel', 'Hannah', 'Olivia', 'Sophia',
    'Claire', 'Natalie', 'Lauren', 'Marcus', 'Elena', 'Lucas', 'Victoria', 'Nathan', 'Samantha',
    'Benjamin', 'Alexander', 'Jonathan', 'Katherine', 'Caroline', 'Elizabeth', 'Grace', 'Audrey',
  ],
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
  DEFAULT: [
    'Anderson', 'Bennett', 'Campbell', 'Carter', 'Collins', 'Cooper', 'Edwards', 'Evans',
    'Foster', 'Graham', 'Harris', 'Henderson', 'Hughes', 'Jenkins', 'Kelly', 'Miller',
    'Mitchell', 'Morgan', 'Murphy', 'Nelson', 'Parker', 'Perry', 'Powell', 'Price',
    'Reed', 'Reynolds', 'Richardson', 'Robinson', 'Russell', 'Sanders', 'Scott', 'Stewart',
    'Sullivan', 'Taylor', 'Thompson', 'Turner', 'Walker', 'Ward', 'Watson', 'Wright',
  ],
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

const DEFAULT_STREET_TEMPLATES = [
  'Oak Ave',
  'Maple Dr',
  'Main St',
  'Washington Blvd',
  'Park Pl',
  'Cedar Ln',
  'Highland Ave',
  'Market St',
  'Sunset Blvd',
  'Broadway',
  'Pine St',
  'Madison Ave',
  'Lakeview Dr',
  'Chestnut St',
  'Lincoln Way',
  'Ridge Rd',
  'Walnut St',
  'Franklin Ave',
  'Meadow Ln',
  'Willow Dr',
];

export function getSubscriberNameForCountry(countryIso2: string, seedIndex: number): string {
  const upper = (countryIso2 || 'US').toUpperCase();
  const intlSeed = INTERNATIONAL_META_BY_ISO2.get(upper);
  const firstPool =
    (intlSeed?.firstNames && intlSeed.firstNames.length > 0 ? intlSeed.firstNames : undefined) ??
    REGIONAL_FIRST_NAMES[upper] ??
    REGIONAL_FIRST_NAMES.DEFAULT;
  const lastPool =
    (intlSeed?.lastNames && intlSeed.lastNames.length > 0 ? intlSeed.lastNames : undefined) ??
    REGIONAL_LAST_NAMES[upper] ??
    REGIONAL_LAST_NAMES.DEFAULT;
  const first = firstPool[Math.abs(seedIndex * 7 + 3) % firstPool.length].trim();
  const rawLast = lastPool[Math.abs(seedIndex * 13 + 5) % lastPool.length].trim();
  const last = rawLast.charAt(0).toUpperCase() + rawLast.slice(1);
  return `${first} ${last}`;
}

export function getStreetNameForCountry(countryIso2: string, seedIndex: number): string {
  const upper = (countryIso2 || 'US').toUpperCase();
  const intlSeed = INTERNATIONAL_META_BY_ISO2.get(upper);
  const pool =
    intlSeed?.streetTemplates && intlSeed.streetTemplates.length > 0
      ? intlSeed.streetTemplates
      : DEFAULT_STREET_TEMPLATES;
  return pool[Math.abs(seedIndex) % pool.length].trim();
}
