import type {
  ContinentCode,
  CountryRecord,
  LineType,
  PrefixCarrierAllocation,
  RegionRecord,
  ZipCodeRecord,
} from '../shared/types.ts';

export interface WorldwideCountrySeed {
  iso2: string;
  iso3: string;
  continentCode: ContinentCode;
  name: string;
  callingCode: string;
  nsnMinLength: number;
  nsnMaxLength: number;
  regulatoryAuthority: string;
  currencySymbol: string;
  basePropertyValue: number;
  streetTemplates: string[];
  employers: string[];
  universities: string[];
  firstNames?: string[];
  lastNames?: string[];
  hubs: Array<{
    regionCode: string;
    regionName: string;
    timezone: string;
    city: string;
    postalCode: string;
    lat: number;
    lon: number;
    prefixes: Array<{
      ndc: string;
      fullPrefix: string;
      carrierGroup: string;
      carrierName: string;
      lineType: LineType;
      ocn: string;
    }>;
  }>;
}

/**
 * 79 International Countries (+ United States in us50StatesCatalog = 80 Countries Across All 6 Continents).
 * Built using real ITU-T E.164 country codes, national telecom regulators, geographic postal hubs,
 * and mobile/fixed carrier NDC ranges.
 */
export const WORLDWIDE_COUNTRIES_SEED: WorldwideCountrySeed[] = [
  // ================= NORTH AMERICA & CARIBBEAN =================
  {
    iso2: 'CA', iso3: 'CAN', continentCode: 'NA', name: 'Canada', callingCode: '1', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'CNA / CRTC Canada', currencySymbol: 'CA$', basePropertyValue: 785000,
    streetTemplates: ['King St W', 'Yonge St', 'Robson St', 'Rue Sainte-Catherine', 'Stephen Ave SW', 'Wellington St'],
    employers: ['Royal Bank of Canada (RBC)', 'Shopify Inc.', 'Brookfield Corporation', 'TELUS Digital', 'Magna International', 'Air Canada'],
    universities: ['University of Toronto', 'McGill University', 'University of British Columbia', 'University of Waterloo'],
    hubs: [
      { regionCode: 'ON', regionName: 'Ontario', timezone: 'America/Toronto', city: 'Toronto', postalCode: 'M5V 2T6', lat: 43.6445, lon: -79.3951, prefixes: [
        { ndc: '416-360', fullPrefix: '1416360', carrierGroup: 'Rogers', carrierName: 'Rogers Wireless Inc.', lineType: 'MOBILE', ocn: 'CNA-8082' },
        { ndc: '647-280', fullPrefix: '1647280', carrierGroup: 'Bell', carrierName: 'Bell Mobility Canada', lineType: 'MOBILE', ocn: 'CNA-8011' },
        { ndc: '416-862', fullPrefix: '1416862', carrierGroup: 'Bell', carrierName: 'Bell Canada Wireline', lineType: 'LANDLINE', ocn: 'CNA-8010' },
      ]},
      { regionCode: 'BC', regionName: 'British Columbia', timezone: 'America/Vancouver', city: 'Vancouver', postalCode: 'V6B 1A1', lat: 49.2827, lon: -123.1088, prefixes: [
        { ndc: '604-681', fullPrefix: '1604681', carrierGroup: 'Telus', carrierName: 'TELUS Mobility', lineType: 'MOBILE', ocn: 'CNA-8103' },
        { ndc: '778-320', fullPrefix: '1778320', carrierGroup: 'Rogers', carrierName: 'Rogers Wireless BC', lineType: 'MOBILE', ocn: 'CNA-8082' },
      ]},
      { regionCode: 'QC', regionName: 'Quebec', timezone: 'America/Montreal', city: 'Montreal', postalCode: 'H2Y 1C6', lat: 45.5048, lon: -73.5542, prefixes: [
        { ndc: '514-842', fullPrefix: '1514842', carrierGroup: 'Bell', carrierName: 'Bell Canada', lineType: 'LANDLINE', ocn: 'CNA-8011' },
        { ndc: '438-390', fullPrefix: '1438390', carrierGroup: 'Videotron', carrierName: 'Vidéotron Ltée', lineType: 'MOBILE', ocn: 'CNA-8204' },
      ]},
      { regionCode: 'AB', regionName: 'Alberta', timezone: 'America/Edmonton', city: 'Calgary', postalCode: 'T2P 1J9', lat: 51.0447, lon: -114.0719, prefixes: [
        { ndc: '403-262', fullPrefix: '1403262', carrierGroup: 'Rogers', carrierName: 'Rogers Wireless AB', lineType: 'MOBILE', ocn: 'CNA-8082' },
        { ndc: '587-350', fullPrefix: '1587350', carrierGroup: 'Telus', carrierName: 'TELUS Communications', lineType: 'MOBILE', ocn: 'CNA-8103' },
      ]},
    ],
  },
  {
    iso2: 'MX', iso3: 'MEX', continentCode: 'NA', name: 'Mexico', callingCode: '52', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'IFT México', currencySymbol: 'MX$', basePropertyValue: 4250000,
    streetTemplates: ['Av. Paseo de la Reforma', 'Av. Insurgentes Sur', 'Calle Madero', 'Av. Vallarta', 'Calz. San Pedro'],
    employers: ['América Móvil', 'Grupo Bimbo', 'FEMSA Corporativo', 'BBVA México', 'Cemex S.A.B.', 'Grupo Financiero Banorte'],
    universities: ['UNAM Ciudad de México', 'Tecnológico de Monterrey (ITESM)', 'Universidad de Guadalajara'],
    firstNames: ['Santiago', 'Mateo', 'Sebastián', 'Diego', 'Emiliano', 'Alejandro', 'Valentina', 'Camila', 'Sofía', 'Mariana', 'Fernanda', 'Daniela'],
    lastNames: ['Hernández', 'García', 'Martínez', 'López', 'González', 'Pérez', 'Rodríguez', 'Sánchez', 'Ramírez', 'Flores'],
    hubs: [
      { regionCode: 'CMX', regionName: 'Ciudad de México', timezone: 'America/Mexico_City', city: 'Mexico City', postalCode: '06600', lat: 19.4271, lon: -99.1676, prefixes: [
        { ndc: '55-5200', fullPrefix: '52555200', carrierGroup: 'Telcel', carrierName: 'Telcel (Radiomóvil Dipsa)', lineType: 'MOBILE', ocn: 'IFT-188' },
        { ndc: '55-5410', fullPrefix: '52555410', carrierGroup: 'AT&T', carrierName: 'AT&T Comunicaciones Digitales', lineType: 'MOBILE', ocn: 'IFT-204' },
      ]},
      { regionCode: 'JAL', regionName: 'Jalisco', timezone: 'America/Mexico_City', city: 'Guadalajara', postalCode: '44100', lat: 20.6752, lon: -103.3473, prefixes: [
        { ndc: '33-3614', fullPrefix: '52333614', carrierGroup: 'Telcel', carrierName: 'Telcel Occidente', lineType: 'MOBILE', ocn: 'IFT-188' },
      ]},
      { regionCode: 'NLE', regionName: 'Nuevo León', timezone: 'America/Monterrey', city: 'Monterrey', postalCode: '64000', lat: 25.6866, lon: -100.3161, prefixes: [
        { ndc: '81-8340', fullPrefix: '52818340', carrierGroup: 'Telcel', carrierName: 'Telcel Norte', lineType: 'MOBILE', ocn: 'IFT-188' },
      ]},
    ],
  },
  {
    iso2: 'DO', iso3: 'DOM', continentCode: 'NA', name: 'Dominican Republic', callingCode: '1', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'INDOTEL', currencySymbol: 'RD$', basePropertyValue: 9800000,
    streetTemplates: ['Av. Winston Churchill', 'Av. Abraham Lincoln', 'Calle El Conde', 'Av. 27 de Febrero'],
    employers: ['Banco Popular Dominicano', 'Grupo Ramos', 'Claro Dominicana', 'Cervecería Nacional'],
    universities: ['Pontificia Universidad Católica Madre y Maestra', 'INTEC Santo Domingo'],
    firstNames: ['Carlos', 'Luis', 'José', 'Miguel', 'Juan', 'María', 'Ana', 'Carmen', 'Laura', 'Gabriela'],
    lastNames: ['Rodríguez', 'Pérez', 'Martínez', 'García', 'Reyes', 'Sánchez', 'Díaz', 'Peña'],
    hubs: [
      { regionCode: 'DN', regionName: 'Distrito Nacional', timezone: 'America/Santo_Domingo', city: 'Santo Domingo', postalCode: '10101', lat: 18.4861, lon: -69.9312, prefixes: [
        { ndc: '809-540', fullPrefix: '1809540', carrierGroup: 'Claro', carrierName: 'Claro Dominicana', lineType: 'MOBILE', ocn: 'IND-809' },
        { ndc: '829-340', fullPrefix: '1829340', carrierGroup: 'Altice', carrierName: 'Altice Dominicana', lineType: 'MOBILE', ocn: 'IND-829' },
      ]},
    ],
  },
  {
    iso2: 'CR', iso3: 'CRI', continentCode: 'NA', name: 'Costa Rica', callingCode: '506', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'SUTEL Costa Rica', currencySymbol: '₡', basePropertyValue: 115000000,
    streetTemplates: ['Avenida Central', 'Paseo Colón', 'Boulevard Rohrmoser', 'Calle 24 Escazú'],
    employers: ['Grupo ICE', 'BAC Credomatic Costa Rica', 'Intel Costa Rica', 'Dos Pinos'],
    universities: ['Universidad de Costa Rica (UCR)', 'Tecnológico de Costa Rica'],
    firstNames: ['Andrés', 'Esteban', 'Diego', 'José', 'Valeria', 'Mariana', 'Sofía', 'Natalia'],
    lastNames: ['Mora', 'Vargas', 'Jiménez', 'Rojas', 'Castro', 'anchía', 'Solís', 'Chinchilla'],
    hubs: [
      { regionCode: 'SJ', regionName: 'San José', timezone: 'America/Costa_Rica', city: 'San José', postalCode: '10101', lat: 9.9281, lon: -84.0907, prefixes: [
        { ndc: '8310', fullPrefix: '5068310', carrierGroup: 'Kölbi', carrierName: 'Kölbi (ICE Móvil)', lineType: 'MOBILE', ocn: 'SUTEL-ICE' },
        { ndc: '7012', fullPrefix: '5067012', carrierGroup: 'Claro', carrierName: 'Claro Costa Rica', lineType: 'MOBILE', ocn: 'SUTEL-CLR' },
      ]},
    ],
  },
  {
    iso2: 'PA', iso3: 'PAN', continentCode: 'NA', name: 'Panama', callingCode: '507', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'ASEP Panamá', currencySymbol: 'B/.', basePropertyValue: 265000,
    streetTemplates: ['Av. Balboa', 'Calle 50', 'Vía España', 'Boulevard Costa del Este'],
    employers: ['Autoridad del Canal de Panamá', 'Copa Airlines', 'Banco General', 'Cable & Wireless Panamá'],
    universities: ['Universidad de Panamá', 'Universidad Tecnológica de Panamá'],
    firstNames: ['Ricardo', 'Javier', 'Carlos', 'Roberto', 'Ana', 'Patricia', 'Camila', 'Daniela'],
    lastNames: ['González', 'Rodríguez', 'Castillo', 'De León', 'Vega', 'Morales'],
    hubs: [
      { regionCode: 'PAN', regionName: 'Panamá Province', timezone: 'America/Panama', city: 'Panama City', postalCode: '0801', lat: 8.9824, lon: -79.5199, prefixes: [
        { ndc: '6612', fullPrefix: '5076612', carrierGroup: 'Más Móvil', carrierName: 'Cable & Wireless Más Móvil', lineType: 'MOBILE', ocn: 'ASEP-CWP' },
        { ndc: '6210', fullPrefix: '5076210', carrierGroup: 'Tigo', carrierName: 'Tigo Panamá', lineType: 'MOBILE', ocn: 'ASEP-TIG' },
      ]},
    ],
  },
  {
    iso2: 'GT', iso3: 'GTM', continentCode: 'NA', name: 'Guatemala', callingCode: '502', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'SIT Guatemala', currencySymbol: 'Q', basePropertyValue: 1450000,
    streetTemplates: ['Avenida La Reforma', '6a Avenida Zona 10', 'Boulevard Los Próceres'],
    employers: ['Corporación Multi Inversiones', 'Banco Industrial', 'Tigo Guatemala', 'Cementos Progreso'],
    universities: ['Universidad Francisco Marroquín', 'Universidad del Valle de Guatemala'],
    firstNames: ['Jorge', 'Carlos', 'Luis', 'Fernando', 'María', 'Andrea', 'Gabriela', 'Lucía'],
    lastNames: ['López', 'García', 'Morales', 'Hernández', 'Pérez', 'Castillo'],
    hubs: [
      { regionCode: 'GU', regionName: 'Guatemala Department', timezone: 'America/Guatemala', city: 'Guatemala City', postalCode: '01010', lat: 14.6099, lon: -90.5252, prefixes: [
        { ndc: '5210', fullPrefix: '5025210', carrierGroup: 'Tigo', carrierName: 'Tigo Guatemala (Comcel)', lineType: 'MOBILE', ocn: 'SIT-TIGO' },
        { ndc: '4120', fullPrefix: '5024120', carrierGroup: 'Claro', carrierName: 'Claro Guatemala', lineType: 'MOBILE', ocn: 'SIT-CLR' },
      ]},
    ],
  },
  {
    iso2: 'JM', iso3: 'JAM', continentCode: 'NA', name: 'Jamaica', callingCode: '1', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'OUR Jamaica', currencySymbol: 'J$', basePropertyValue: 38000000,
    streetTemplates: ['Knutsford Blvd', 'Hope Rd', 'Trafalgar Rd', 'Constant Spring Rd'],
    employers: ['NCB Financial Group', 'GraceKennedy Ltd.', 'Digicel Group', 'Scotiabank Jamaica'],
    universities: ['University of the West Indies (Mona)', 'University of Technology Jamaica'],
    firstNames: ['Damian', 'Andre', 'Devon', 'Kemar', 'Shanice', 'Tashana', 'Kerry-Ann', 'Simone'],
    lastNames: ['Campbell', 'Brown', 'Williams', 'Clarke', 'Powell', 'Daley', 'Grant'],
    hubs: [
      { regionCode: 'KIN', regionName: 'Kingston Parish', timezone: 'America/Jamaica', city: 'Kingston', postalCode: 'JMAKN01', lat: 18.0179, lon: -76.8099, prefixes: [
        { ndc: '876-320', fullPrefix: '1876320', carrierGroup: 'Digicel', carrierName: 'Digicel Jamaica', lineType: 'MOBILE', ocn: 'OUR-DIG' },
        { ndc: '876-920', fullPrefix: '1876920', carrierGroup: 'Flow', carrierName: 'Flow Jamaica (C&W)', lineType: 'MOBILE', ocn: 'OUR-FLW' },
      ]},
    ],
  },
  {
    iso2: 'TT', iso3: 'TTO', continentCode: 'NA', name: 'Trinidad and Tobago', callingCode: '1', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'TATT Trinidad', currencySymbol: 'TT$', basePropertyValue: 2100000,
    streetTemplates: ['Ariapita Ave', 'Frederick St', 'Queen Park West', 'Wrightson Rd'],
    employers: ['Republic Bank Limited', 'ANSA McAL', 'TSTT bmobile', 'Massy Group'],
    universities: ['University of the West Indies (St. Augustine)', 'University of Trinidad and Tobago'],
    hubs: [
      { regionCode: 'POS', regionName: 'Port of Spain', timezone: 'America/Port_of_Spain', city: 'Port of Spain', postalCode: '100102', lat: 10.6549, lon: -61.5019, prefixes: [
        { ndc: '868-620', fullPrefix: '1868620', carrierGroup: 'bmobile', carrierName: 'TSTT bmobile', lineType: 'MOBILE', ocn: 'TATT-BM' },
        { ndc: '868-310', fullPrefix: '1868310', carrierGroup: 'Digicel', carrierName: 'Digicel Trinidad', lineType: 'MOBILE', ocn: 'TATT-DG' },
      ]},
    ],
  },
  {
    iso2: 'BS', iso3: 'BHS', continentCode: 'NA', name: 'Bahamas', callingCode: '1', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'URCA Bahamas', currencySymbol: 'B$', basePropertyValue: 460000,
    streetTemplates: ['Bay St', 'Shirley St', 'West Bay St', 'Cable Beach Rd'],
    employers: ['BTC Bahamas', 'Commonwealth Bank', 'Baha Mar Resort', 'Fidelity Bank Bahamas'],
    universities: ['University of The Bahamas'],
    hubs: [
      { regionCode: 'NP', regionName: 'New Providence', timezone: 'America/Nassau', city: 'Nassau', postalCode: 'N-3008', lat: 25.0443, lon: -77.3504, prefixes: [
        { ndc: '242-357', fullPrefix: '1242357', carrierGroup: 'BTC', carrierName: 'Bahamas Telecom (BTC)', lineType: 'MOBILE', ocn: 'URCA-BTC' },
      ]},
    ],
  },

  // ================= EUROPE (25 COUNTRIES) =================
  {
    iso2: 'GB', iso3: 'GBR', continentCode: 'EU', name: 'United Kingdom', callingCode: '44', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'Ofcom UK', currencySymbol: '£', basePropertyValue: 545000,
    streetTemplates: ['Kensington High St', 'Bishopsgate', 'Victoria Embankment', 'Deansgate', 'George St', 'Broad St'],
    employers: ['Barclays PLC', 'HSBC UK', 'NHS England', 'AstraZeneca PLC', 'Unilever UK', 'Rolls-Royce Holdings', 'Deloitte LLP UK'],
    universities: ['University of Oxford', 'Imperial College London', 'University College London (UCL)', 'University of Edinburgh', 'University of Manchester'],
    firstNames: ['Oliver', 'George', 'Arthur', 'Harry', 'Jack', 'Charlie', 'Amelia', 'Olivia', 'Isla', 'Charlotte', 'Freya', 'Sophie'],
    lastNames: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Davies', 'Evans', 'Thomas', 'Roberts'],
    hubs: [
      { regionCode: 'ENG', regionName: 'England', timezone: 'Europe/London', city: 'London', postalCode: 'SW1A 1AA', lat: 51.5014, lon: -0.1419, prefixes: [
        { ndc: '20-7946', fullPrefix: '44207946', carrierGroup: 'BT', carrierName: 'British Telecom (BT)', lineType: 'LANDLINE', ocn: 'OFCOM-BT' },
        { ndc: '7700-90', fullPrefix: '44770090', carrierGroup: 'Vodafone', carrierName: 'Vodafone UK Ltd', lineType: 'MOBILE', ocn: 'MCC234-15' },
        { ndc: '7911-24', fullPrefix: '44791124', carrierGroup: 'EE', carrierName: 'EE Limited (BT Group)', lineType: 'MOBILE', ocn: 'MCC234-30' },
        { ndc: '7802-40', fullPrefix: '44780240', carrierGroup: 'O2', carrierName: 'VMED O2 UK Ltd', lineType: 'MOBILE', ocn: 'MCC234-10' },
      ]},
      { regionCode: 'MAN', regionName: 'Greater Manchester', timezone: 'Europe/London', city: 'Manchester', postalCode: 'M1 1AE', lat: 53.4808, lon: -2.2426, prefixes: [
        { ndc: '161-496', fullPrefix: '44161496', carrierGroup: 'BT', carrierName: 'BT North West', lineType: 'LANDLINE', ocn: 'OFCOM-BT' },
        { ndc: '7400-21', fullPrefix: '44740021', carrierGroup: 'Three', carrierName: 'Three UK (Hutchison)', lineType: 'MOBILE', ocn: 'MCC234-20' },
      ]},
      { regionCode: 'SCT', regionName: 'Scotland', timezone: 'Europe/London', city: 'Edinburgh', postalCode: 'EH1 1YZ', lat: 55.9533, lon: -3.1883, prefixes: [
        { ndc: '131-496', fullPrefix: '44131496', carrierGroup: 'O2', carrierName: 'O2 UK Scotland', lineType: 'LANDLINE', ocn: 'MCC234-10' },
        { ndc: '7712-30', fullPrefix: '44771230', carrierGroup: 'Vodafone', carrierName: 'Vodafone Scotland', lineType: 'MOBILE', ocn: 'MCC234-15' },
      ]},
    ],
  },
  {
    iso2: 'DE', iso3: 'DEU', continentCode: 'EU', name: 'Germany', callingCode: '49', nsnMinLength: 10, nsnMaxLength: 11,
    regulatoryAuthority: 'Bundesnetzagentur (BNetzA)', currencySymbol: '€', basePropertyValue: 495000,
    streetTemplates: ['Friedrichstraße', 'Maximilianstraße', 'Zeil', 'Königsallee', 'Kurfürstendamm', 'Jungfernstieg'],
    employers: ['Siemens AG', 'SAP SE', 'Allianz SE', 'Deutsche Telekom AG', 'BMW Group', 'Mercedes-Benz Group', 'Bosch GmbH'],
    universities: ['Technical University of Munich (TUM)', 'LMU Munich', 'Humboldt University of Berlin', 'RWTH Aachen'],
    firstNames: ['Lukas', 'Maximilian', 'Felix', 'Jonas', 'Leon', 'Tobias', 'Hannah', 'Sophia', 'Anna', 'Laura', 'Marie', 'Katharina'],
    lastNames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'],
    hubs: [
      { regionCode: 'BE', regionName: 'Berlin', timezone: 'Europe/Berlin', city: 'Berlin', postalCode: '10115', lat: 52.5323, lon: 13.3846, prefixes: [
        { ndc: '151-234', fullPrefix: '49151234', carrierGroup: 'Telekom Deutschland', carrierName: 'Telekom Deutschland GmbH', lineType: 'MOBILE', ocn: 'BNETZA-D1' },
        { ndc: '30-2408', fullPrefix: '49302408', carrierGroup: 'Telekom Deutschland', carrierName: 'Telekom Festnetz Berlin', lineType: 'LANDLINE', ocn: 'BNETZA-030' },
      ]},
      { regionCode: 'BY', regionName: 'Bavaria', timezone: 'Europe/Berlin', city: 'Munich', postalCode: '80331', lat: 48.1372, lon: 11.5755, prefixes: [
        { ndc: '172-410', fullPrefix: '49172410', carrierGroup: 'Vodafone', carrierName: 'Vodafone GmbH Germany', lineType: 'MOBILE', ocn: 'BNETZA-D2' },
        { ndc: '176-320', fullPrefix: '49176320', carrierGroup: 'O2', carrierName: 'Telefónica Germany (O2)', lineType: 'MOBILE', ocn: 'BNETZA-O2' },
      ]},
      { regionCode: 'HE', regionName: 'Hesse', timezone: 'Europe/Berlin', city: 'Frankfurt', postalCode: '60311', lat: 50.1109, lon: 8.6821, prefixes: [
        { ndc: '69-2108', fullPrefix: '49692108', carrierGroup: 'Telekom Deutschland', carrierName: 'Telekom Frankfurt', lineType: 'LANDLINE', ocn: 'BNETZA-069' },
      ]},
    ],
  },
  {
    iso2: 'FR', iso3: 'FRA', continentCode: 'EU', name: 'France', callingCode: '33', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ARCEP France', currencySymbol: '€', basePropertyValue: 470000,
    streetTemplates: ['Rue de Rivoli', 'Boulevard Haussmann', 'Avenue des Champs-Élysées', 'Rue de la République', 'Cours Mirabeau'],
    employers: ['BNP Paribas', 'Sanofi S.A.', 'Capgemini SE', 'LVMH Group', 'Airbus France', 'Orange S.A.', 'TotalEnergies'],
    universities: ['Sorbonne Université', 'École Polytechnique', 'Sciences Po Paris', 'Université PSL'],
    firstNames: ['Lucas', 'Gabriel', 'Léo', 'Louis', 'Hugo', 'Antoine', 'Camille', 'Léa', 'Manon', 'Chloé', 'Inès', 'Claire'],
    lastNames: ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent'],
    hubs: [
      { regionCode: 'IDF', regionName: 'Île-de-France', timezone: 'Europe/Paris', city: 'Paris', postalCode: '75001', lat: 48.8626, lon: 2.3363, prefixes: [
        { ndc: '6-0742', fullPrefix: '3360742', carrierGroup: 'Orange', carrierName: 'Orange France Mobile', lineType: 'MOBILE', ocn: 'ARCEP-ORA' },
        { ndc: '6-1420', fullPrefix: '3361420', carrierGroup: 'SFR', carrierName: 'Société Française du Radiotéléphone', lineType: 'MOBILE', ocn: 'ARCEP-SFR' },
        { ndc: '1-4260', fullPrefix: '3314260', carrierGroup: 'Orange', carrierName: 'Orange Fixe Paris', lineType: 'LANDLINE', ocn: 'ARCEP-PAR' },
      ]},
      { regionCode: 'ARA', regionName: 'Auvergne-Rhône-Alpes', timezone: 'Europe/Paris', city: 'Lyon', postalCode: '69002', lat: 45.7538, lon: 4.8322, prefixes: [
        { ndc: '4-7828', fullPrefix: '3347828', carrierGroup: 'SFR', carrierName: 'SFR Auvergne-Rhône', lineType: 'LANDLINE', ocn: 'ARCEP-SFR' },
        { ndc: '6-6031', fullPrefix: '3366031', carrierGroup: 'Bouygues', carrierName: 'Bouygues Telecom', lineType: 'MOBILE', ocn: 'ARCEP-BYT' },
      ]},
    ],
  },
  {
    iso2: 'ES', iso3: 'ESP', continentCode: 'EU', name: 'Spain', callingCode: '34', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'CNMC Spain', currencySymbol: '€', basePropertyValue: 365000,
    streetTemplates: ['Calle Serrano', 'Paseo de la Castellana', 'Gran Vía', 'Passeig de Gràcia', 'Avinguda Diagonal'],
    employers: ['Banco Santander', 'Telefónica S.A.', 'Iberdrola', 'Inditex Group', 'BBVA España', 'Repsol S.A.'],
    universities: ['Universidad Complutense de Madrid', 'Universitat de Barcelona', 'IE University'],
    firstNames: ['Carlos', 'Alejandro', 'Mateo', 'Javier', 'Diego', 'Pablo', 'Lucía', 'Sofía', 'Martina', 'Carmen', 'Elena', 'Paula'],
    lastNames: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Navarro'],
    hubs: [
      { regionCode: 'MD', regionName: 'Madrid', timezone: 'Europe/Madrid', city: 'Madrid', postalCode: '28001', lat: 40.4239, lon: -3.6865, prefixes: [
        { ndc: '609-31', fullPrefix: '3460931', carrierGroup: 'Movistar', carrierName: 'Telefónica Movistar España', lineType: 'MOBILE', ocn: 'CNMC-MOV' },
        { ndc: '91-521', fullPrefix: '3491521', carrierGroup: 'Movistar', carrierName: 'Telefónica Fijo Madrid', lineType: 'LANDLINE', ocn: 'CNMC-MAD' },
      ]},
      { regionCode: 'CT', regionName: 'Catalonia', timezone: 'Europe/Madrid', city: 'Barcelona', postalCode: '08001', lat: 41.3809, lon: 2.1684, prefixes: [
        { ndc: '607-44', fullPrefix: '3460744', carrierGroup: 'Vodafone', carrierName: 'Vodafone España S.A.U.', lineType: 'MOBILE', ocn: 'CNMC-VOD' },
        { ndc: '654-20', fullPrefix: '3465420', carrierGroup: 'Orange', carrierName: 'MasOrange España', lineType: 'MOBILE', ocn: 'CNMC-ORA' },
      ]},
    ],
  },
  {
    iso2: 'IT', iso3: 'ITA', continentCode: 'EU', name: 'Italy', callingCode: '39', nsnMinLength: 9, nsnMaxLength: 10,
    regulatoryAuthority: 'AGCOM Italy', currencySymbol: '€', basePropertyValue: 380000,
    streetTemplates: ['Via Monte Napoleone', 'Via del Corso', 'Corso Buenos Aires', 'Piazza della Repubblica', 'Via Veneto'],
    employers: ['Intesa Sanpaolo', 'UniCredit S.p.A.', 'Enel Group', 'Generali Italia', 'Leonardo S.p.A.', 'Ferrari N.V.'],
    universities: ['Politecnico di Milano', 'Università Bocconi', 'Sapienza Università di Roma', 'Alma Mater Bologna'],
    firstNames: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Matteo', 'Andrea', 'Giulia', 'Sofia', 'Aurora', 'Chiara', 'Martina'],
    lastNames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'],
    hubs: [
      { regionCode: 'LOM', regionName: 'Lombardy', timezone: 'Europe/Rome', city: 'Milan', postalCode: '20121', lat: 45.4642, lon: 9.19, prefixes: [
        { ndc: '335-210', fullPrefix: '39335210', carrierGroup: 'TIM', carrierName: 'TIM Italia S.p.A.', lineType: 'MOBILE', ocn: 'AGCOM-TIM' },
        { ndc: '347-410', fullPrefix: '39347410', carrierGroup: 'Vodafone', carrierName: 'Vodafone Italia', lineType: 'MOBILE', ocn: 'AGCOM-VOD' },
      ]},
      { regionCode: 'LAZ', regionName: 'Lazio', timezone: 'Europe/Rome', city: 'Rome', postalCode: '00184', lat: 41.8967, lon: 12.4822, prefixes: [
        { ndc: '348-510', fullPrefix: '39348510', carrierGroup: 'Vodafone', carrierName: 'Vodafone Roma', lineType: 'MOBILE', ocn: 'AGCOM-VOD' },
        { ndc: '328-310', fullPrefix: '39328310', carrierGroup: 'WindTre', carrierName: 'Wind Tre S.p.A.', lineType: 'MOBILE', ocn: 'AGCOM-W3' },
      ]},
    ],
  },
  {
    iso2: 'NL', iso3: 'NLD', continentCode: 'EU', name: 'Netherlands', callingCode: '31', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ACM Netherlands', currencySymbol: '€', basePropertyValue: 510000,
    streetTemplates: ['Keizersgracht', 'Herengracht', 'Zuidas Mahlerlaan', 'Coolsingel', 'Kalverstraat'],
    employers: ['ASML Holding', 'ING Group', 'Philips N.V.', 'Adyen N.V.', 'Heineken International', 'Booking.com'],
    universities: ['University of Amsterdam', 'Delft University of Technology (TU Delft)', 'Erasmus University Rotterdam'],
    firstNames: ['Daan', 'Sem', 'Lucas', 'Bram', 'Finn', 'Emma', 'Julia', 'Sophie', 'Tess', 'Sanne'],
    lastNames: ['De Jong', 'Jansen', 'De Vries', 'Van den Berg', 'Van Dijk', 'Bakker', 'Visser', 'Smit', 'Meijer'],
    hubs: [
      { regionCode: 'NH', regionName: 'North Holland', timezone: 'Europe/Amsterdam', city: 'Amsterdam', postalCode: '1012 JS', lat: 52.3702, lon: 4.8952, prefixes: [
        { ndc: '6-5120', fullPrefix: '3165120', carrierGroup: 'KPN', carrierName: 'KPN Mobile Netherlands', lineType: 'MOBILE', ocn: 'ACM-KPN' },
        { ndc: '6-2410', fullPrefix: '3162410', carrierGroup: 'VodafoneZiggo', carrierName: 'Vodafone Libertel B.V.', lineType: 'MOBILE', ocn: 'ACM-VOD' },
      ]},
    ],
  },
  {
    iso2: 'CH', iso3: 'CHE', continentCode: 'EU', name: 'Switzerland', callingCode: '41', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'BAKOM / OFCOM', currencySymbol: 'CHF ', basePropertyValue: 1180000,
    streetTemplates: ['Bahnhofstrasse', 'Rue du Rhône', 'Limmatquai', 'Aeschenvorstadt', 'Bundesplatz'],
    employers: ['UBS Group AG', 'Novartis International', 'Roche Holding', 'Nestlé S.A.', 'Zurich Insurance Group', 'Swisscom AG'],
    universities: ['ETH Zurich', 'EPFL Lausanne', 'University of Zurich', 'University of St. Gallen'],
    firstNames: ['Luca', 'Noah', 'Leon', 'Matteo', 'Jonas', 'Mia', 'Emma', 'Elena', 'Lina', 'Laura'],
    lastNames: ['Meier', 'Schmid', 'Keller', 'Weber', 'Huber', 'Schneider', 'Steiner', 'Fischer', 'Gerber'],
    hubs: [
      { regionCode: 'ZH', regionName: 'Zurich', timezone: 'Europe/Zurich', city: 'Zurich', postalCode: '8001', lat: 47.3769, lon: 8.5417, prefixes: [
        { ndc: '79-410', fullPrefix: '4179410', carrierGroup: 'Swisscom', carrierName: 'Swisscom (Schweiz) AG', lineType: 'MOBILE', ocn: 'BAKOM-SWC' },
        { ndc: '76-320', fullPrefix: '4176320', carrierGroup: 'Sunrise', carrierName: 'Sunrise GmbH', lineType: 'MOBILE', ocn: 'BAKOM-SUN' },
      ]},
      { regionCode: 'GE', regionName: 'Geneva', timezone: 'Europe/Zurich', city: 'Geneva', postalCode: '1204', lat: 46.2044, lon: 6.1432, prefixes: [
        { ndc: '78-610', fullPrefix: '4178610', carrierGroup: 'Salt', carrierName: 'Salt Mobile SA', lineType: 'MOBILE', ocn: 'BAKOM-SLT' },
      ]},
    ],
  },
  {
    iso2: 'SE', iso3: 'SWE', continentCode: 'EU', name: 'Sweden', callingCode: '46', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'PTS Sweden', currencySymbol: 'SEK ', basePropertyValue: 5400000,
    streetTemplates: ['Strandvägen', 'Kungsgatan', 'Birger Jarlsgatan', 'Avenyn', 'Sveavägen'],
    employers: ['Ericsson AB', 'Spotify Technology', 'Volvo Group', 'SEB Bank', 'H&M Group', 'Klarna Bank'],
    universities: ['KTH Royal Institute of Technology', 'Karolinska Institutet', 'Lund University'],
    firstNames: ['William', 'Liam', 'Noah', 'Lucas', 'Oscar', 'Alice', 'Maja', 'Elsa', 'Astrid', 'Freja'],
    lastNames: ['Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Svensson'],
    hubs: [
      { regionCode: 'AB', regionName: 'Stockholm County', timezone: 'Europe/Stockholm', city: 'Stockholm', postalCode: '111 20', lat: 59.3293, lon: 18.0686, prefixes: [
        { ndc: '70-310', fullPrefix: '4670310', carrierGroup: 'Telia', carrierName: 'Telia Sverige AB', lineType: 'MOBILE', ocn: 'PTS-TELIA' },
        { ndc: '73-520', fullPrefix: '4673520', carrierGroup: 'Tele2', carrierName: 'Tele2 Sverige AB', lineType: 'MOBILE', ocn: 'PTS-TEL2' },
      ]},
    ],
  },
  {
    iso2: 'PL', iso3: 'POL', continentCode: 'EU', name: 'Poland', callingCode: '48', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'UKE Poland', currencySymbol: 'PLN ', basePropertyValue: 1120000,
    streetTemplates: ['ul. Marszałkowska', 'Al. Jerozolimskie', 'ul. Nowy Świat', 'ul. Floriańska'],
    employers: ['PKO Bank Polski', 'ORLEN S.A.', 'Allegro.eu', 'CD Projekt', 'PZU Group'],
    universities: ['University of Warsaw', 'Jagiellonian University', 'Warsaw University of Technology'],
    firstNames: ['Piotr', 'Krzysztof', 'Tomasz', 'Paweł', 'Michał', 'Anna', 'Katarzyna', 'Małgorzata', 'Agnieszka', 'Magdalena'],
    lastNames: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński'],
    hubs: [
      { regionCode: 'MZ', regionName: 'Masovian', timezone: 'Europe/Warsaw', city: 'Warsaw', postalCode: '00-001', lat: 52.2297, lon: 21.0122, prefixes: [
        { ndc: '601-24', fullPrefix: '4860124', carrierGroup: 'Polkomtel', carrierName: 'Plus (Polkomtel)', lineType: 'MOBILE', ocn: 'UKE-PLUS' },
        { ndc: '501-32', fullPrefix: '4850132', carrierGroup: 'Orange', carrierName: 'Orange Polska', lineType: 'MOBILE', ocn: 'UKE-ORA' },
      ]},
    ],
  },
  {
    iso2: 'BE', iso3: 'BEL', continentCode: 'EU', name: 'Belgium', callingCode: '32', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'BIPT Belgium', currencySymbol: '€', basePropertyValue: 410000,
    streetTemplates: ['Avenue Louise', 'Rue de la Loi', 'Meir', 'Boulevard Anspach'],
    employers: ['KBC Group', 'AB InBev', 'Proximus Group', 'UCB Pharma', 'BNP Paribas Fortis'],
    universities: ['KU Leuven', 'Ghent University', 'Université Libre de Bruxelles'],
    firstNames: ['Arthur', 'Noah', 'Jules', 'Louis', 'Liam', 'Emma', 'Olivia', 'Louise', 'Mila', 'Alice'],
    lastNames: ['Peeters', 'Janssens', 'Maes', 'Jacobs', 'Mertens', 'Willems', 'Claes', 'Dubois'],
    hubs: [
      { regionCode: 'BRU', regionName: 'Brussels-Capital', timezone: 'Europe/Brussels', city: 'Brussels', postalCode: '1000', lat: 50.8503, lon: 4.3517, prefixes: [
        { ndc: '475-21', fullPrefix: '3247521', carrierGroup: 'Proximus', carrierName: 'Proximus PLC', lineType: 'MOBILE', ocn: 'BIPT-PRX' },
        { ndc: '495-32', fullPrefix: '3249532', carrierGroup: 'Orange', carrierName: 'Orange Belgium', lineType: 'MOBILE', ocn: 'BIPT-ORA' },
      ]},
    ],
  },
  {
    iso2: 'AT', iso3: 'AUT', continentCode: 'EU', name: 'Austria', callingCode: '43', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'RTR Austria', currencySymbol: '€', basePropertyValue: 485000,
    streetTemplates: ['Kärntner Straße', 'Mariahilfer Straße', 'Graben', 'Ringstraße'],
    employers: ['Erste Group Bank', 'OMV AG', 'Raiffeisen Bank International', 'Red Bull GmbH', 'A1 Telekom Austria'],
    universities: ['University of Vienna', 'TU Wien', 'Vienna University of Economics (WU)'],
    firstNames: ['Paul', 'Jakob', 'Maximilian', 'Elias', 'David', 'Marie', 'Emilia', 'Anna', 'Emma', 'Lena'],
    lastNames: ['Gruber', 'Huber', 'Bauer', 'Wagner', 'Müller', 'Pichler', 'Steiner', 'Moser'],
    hubs: [
      { regionCode: 'W', regionName: 'Vienna', timezone: 'Europe/Vienna', city: 'Vienna', postalCode: '1010', lat: 48.2082, lon: 16.3738, prefixes: [
        { ndc: '664-210', fullPrefix: '43664210', carrierGroup: 'A1 Telekom', carrierName: 'A1 Telekom Austria', lineType: 'MOBILE', ocn: 'RTR-A1' },
        { ndc: '676-410', fullPrefix: '43676410', carrierGroup: 'Magenta', carrierName: 'Magenta Telekom (T-Mobile)', lineType: 'MOBILE', ocn: 'RTR-MAG' },
      ]},
    ],
  },
  {
    iso2: 'NO', iso3: 'NOR', continentCode: 'EU', name: 'Norway', callingCode: '47', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'Nkom Norway', currencySymbol: 'NOK ', basePropertyValue: 6200000,
    streetTemplates: ['Karl Johans gate', 'Aker Brygge', 'Bogstadveien', 'Dronningens gate'],
    employers: ['Equinor ASA', 'DNB Bank ASA', 'Telenor Group', 'Yara International', 'Kongsberg Gruppen'],
    universities: ['University of Oslo', 'NTNU Trondheim', 'NHH Norwegian School of Economics'],
    firstNames: ['Jakob', 'Emil', 'Noah', 'Oliver', 'Filip', 'Nora', 'Emma', 'Olivia', 'Ella', 'Sofie'],
    lastNames: ['Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen'],
    hubs: [
      { regionCode: '03', regionName: 'Oslo', timezone: 'Europe/Oslo', city: 'Oslo', postalCode: '0150', lat: 59.9139, lon: 10.7522, prefixes: [
        { ndc: '9012', fullPrefix: '479012', carrierGroup: 'Telenor', carrierName: 'Telenor Norge AS', lineType: 'MOBILE', ocn: 'NKOM-TLN' },
        { ndc: '4120', fullPrefix: '474120', carrierGroup: 'Telia', carrierName: 'Telia Norge AS', lineType: 'MOBILE', ocn: 'NKOM-TLA' },
      ]},
    ],
  },
  {
    iso2: 'DK', iso3: 'DNK', continentCode: 'EU', name: 'Denmark', callingCode: '45', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'SDFI Denmark', currencySymbol: 'DKK ', basePropertyValue: 4150000,
    streetTemplates: ['Strøget', 'Bredgade', 'Østerbrogade', 'Nyhavn', 'Vesterbrogade'],
    employers: ['Novo Nordisk A/S', 'A.P. Moller - Maersk', 'Danske Bank', 'Carlsberg Group', 'Ørsted A/S'],
    universities: ['University of Copenhagen', 'Technical University of Denmark (DTU)', 'Copenhagen Business School'],
    firstNames: ['William', 'Oscar', 'Carl', 'Malthe', 'Emil', 'Alma', 'Ida', 'Clara', 'Ella', 'Freja'],
    lastNames: ['Nielsen', 'Jensen', 'Hansen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen', 'Sørensen'],
    hubs: [
      { regionCode: '84', regionName: 'Capital Region', timezone: 'Europe/Copenhagen', city: 'Copenhagen', postalCode: '1050', lat: 55.6761, lon: 12.5683, prefixes: [
        { ndc: '2014', fullPrefix: '452014', carrierGroup: 'TDC Nuuday', carrierName: 'TDC Mobil (YouSee)', lineType: 'MOBILE', ocn: 'DK-TDC' },
        { ndc: '4021', fullPrefix: '454021', carrierGroup: 'Telenor', carrierName: 'Telenor Denmark', lineType: 'MOBILE', ocn: 'DK-TLN' },
      ]},
    ],
  },
  {
    iso2: 'FI', iso3: 'FIN', continentCode: 'EU', name: 'Finland', callingCode: '358', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'Traficom Finland', currencySymbol: '€', basePropertyValue: 395000,
    streetTemplates: ['Mannerheimintie', 'Aleksanterinkatu', 'Esplanadi', 'Bulevardi'],
    employers: ['Nokia Corporation', 'KONE Oyj', 'Nordea Bank Abp', 'Elisa Oyj', 'Fortum'],
    universities: ['University of Helsinki', 'Aalto University', 'Tampere University'],
    firstNames: ['Leo', 'Elias', 'Oliver', 'Eino', 'Väinö', 'Aino', 'Olivia', 'Aada', 'Lilja', 'Eevi'],
    lastNames: ['Korhonen', 'Virtanen', 'Mäkinen', 'Nieminen', 'Mäkelä', 'Hämäläinen', 'Laine', 'Heikkinen'],
    hubs: [
      { regionCode: 'UU', regionName: 'Uusimaa', timezone: 'Europe/Helsinki', city: 'Helsinki', postalCode: '00100', lat: 60.1699, lon: 24.9384, prefixes: [
        { ndc: '40-512', fullPrefix: '35840512', carrierGroup: 'Telia', carrierName: 'Telia Finland Oyj', lineType: 'MOBILE', ocn: 'FIN-TLA' },
        { ndc: '50-321', fullPrefix: '35850321', carrierGroup: 'Elisa', carrierName: 'Elisa Oyj Mobile', lineType: 'MOBILE', ocn: 'FIN-ELI' },
      ]},
    ],
  },
  {
    iso2: 'IE', iso3: 'IRL', continentCode: 'EU', name: 'Ireland', callingCode: '353', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ComReg Ireland', currencySymbol: '€', basePropertyValue: 480000,
    streetTemplates: ['Grafton St', 'Baggot St Upper', 'Grand Canal Dock', 'O’Connell St', 'Merrion Sq'],
    employers: ['Bank of Ireland', 'AIB Group', 'Accenture Ireland', 'CRH plc', 'Ryanair DAC', 'Kerry Group'],
    universities: ['Trinity College Dublin', 'University College Dublin (UCD)', 'University of Galway'],
    firstNames: ['Jack', 'Noah', 'James', 'Rían', 'Cillian', 'Emily', 'Grace', 'Fiadh', 'Sophie', 'Éabha'],
    lastNames: ['Murphy', 'Kelly', 'O’Sullivan', 'Walsh', 'Smith', 'O’Brien', 'Byrne', 'Ryan', 'O’Connor'],
    hubs: [
      { regionCode: 'D', regionName: 'County Dublin', timezone: 'Europe/Dublin', city: 'Dublin', postalCode: 'D02 AF30', lat: 53.3498, lon: -6.2603, prefixes: [
        { ndc: '87-231', fullPrefix: '35387231', carrierGroup: 'Vodafone', carrierName: 'Vodafone Ireland', lineType: 'MOBILE', ocn: 'COM-VOD' },
        { ndc: '86-410', fullPrefix: '35386410', carrierGroup: 'Three', carrierName: 'Three Ireland (Hutchison)', lineType: 'MOBILE', ocn: 'COM-3IE' },
      ]},
    ],
  },
  {
    iso2: 'PT', iso3: 'PRT', continentCode: 'EU', name: 'Portugal', callingCode: '351', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ANACOM Portugal', currencySymbol: '€', basePropertyValue: 345000,
    streetTemplates: ['Avenida da Liberdade', 'Rua Augusta', 'Avenida da Boavista', 'Rua de Santa Catarina'],
    employers: ['EDP Energias de Portugal', 'Galp Energia', 'Millennium bcp', 'Jerónimo Martins', 'MEO Altice'],
    universities: ['Universidade de Lisboa', 'Universidade do Porto', 'Nova School of Business & Economics'],
    firstNames: ['Francisco', 'Afonso', 'João', 'Tomás', 'Duarte', 'Maria', 'Alice', 'Leonor', 'Matilde', 'Benedita'],
    lastNames: ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Sousa'],
    hubs: [
      { regionCode: '11', regionName: 'Lisbon', timezone: 'Europe/Lisbon', city: 'Lisbon', postalCode: '1250-096', lat: 38.7223, lon: -9.1393, prefixes: [
        { ndc: '91-420', fullPrefix: '35191420', carrierGroup: 'Vodafone', carrierName: 'Vodafone Portugal', lineType: 'MOBILE', ocn: 'ANA-VOD' },
        { ndc: '96-310', fullPrefix: '35196310', carrierGroup: 'MEO', carrierName: 'MEO (Altice Portugal)', lineType: 'MOBILE', ocn: 'ANA-MEO' },
      ]},
    ],
  },
  {
    iso2: 'GR', iso3: 'GRC', continentCode: 'EU', name: 'Greece', callingCode: '30', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'EETT Greece', currencySymbol: '€', basePropertyValue: 275000,
    streetTemplates: ['Leoforos Vasilissis Sofias', 'Ermou St', 'Stadiou St', 'Tsimiski Ave'],
    employers: ['National Bank of Greece', 'OTE Group (Cosmote)', 'Eurobank Ergasias', 'Public Power Corp (PPC)'],
    universities: ['National and Kapodistrian University of Athens', 'National Technical University of Athens'],
    firstNames: ['Georgios', 'Dimitrios', 'Konstantinos', 'Ioannis', 'Nikolaos', 'Maria', 'Eleni', 'Aikaterini', 'Sofia'],
    lastNames: ['Papadopoulos', 'Vlachos', 'Angelopoulos', 'Nikolaidis', 'Georgiou', 'Athanasiadis'],
    hubs: [
      { regionCode: 'I', regionName: 'Attica', timezone: 'Europe/Athens', city: 'Athens', postalCode: '105 63', lat: 37.9838, lon: 23.7275, prefixes: [
        { ndc: '697-310', fullPrefix: '30697310', carrierGroup: 'Cosmote', carrierName: 'Cosmote Mobile Greece', lineType: 'MOBILE', ocn: 'EETT-COS' },
        { ndc: '694-420', fullPrefix: '30694420', carrierGroup: 'Vodafone', carrierName: 'Vodafone Panafon Greece', lineType: 'MOBILE', ocn: 'EETT-VOD' },
      ]},
    ],
  },
  {
    iso2: 'CZ', iso3: 'CZE', continentCode: 'EU', name: 'Czechia', callingCode: '420', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'CTU Czechia', currencySymbol: 'CZK ', basePropertyValue: 8600000,
    streetTemplates: ['Václavské náměstí', 'Pařížská', 'Národní třída', 'Vinohradská'],
    employers: ['Škoda Auto', 'ČEZ Group', 'ČSOB Bank', 'Avast / Gen Digital', 'O2 Czech Republic'],
    universities: ['Charles University Prague', 'Czech Technical University (ČVUT)'],
    firstNames: ['Jakub', 'Jan', 'Tomáš', 'Matyáš', 'Adam', 'Eliška', 'Viktorie', 'Anna', 'Sofie', 'Natálie'],
    lastNames: ['Novák', 'Svoboda', 'Novotný', 'Dvořák', 'Černý', 'Procházka', 'Kučera', 'Veselý'],
    hubs: [
      { regionCode: '10', regionName: 'Prague', timezone: 'Europe/Prague', city: 'Prague', postalCode: '110 00', lat: 50.0755, lon: 14.4378, prefixes: [
        { ndc: '602-31', fullPrefix: '42060231', carrierGroup: 'O2', carrierName: 'O2 Czech Republic', lineType: 'MOBILE', ocn: 'CTU-O2' },
        { ndc: '603-42', fullPrefix: '42060342', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile Czech Republic', lineType: 'MOBILE', ocn: 'CTU-TMO' },
      ]},
    ],
  },
  {
    iso2: 'RO', iso3: 'ROU', continentCode: 'EU', name: 'Romania', callingCode: '40', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ANCOM Romania', currencySymbol: '€', basePropertyValue: 195000,
    streetTemplates: ['Calea Victoriei', 'Bulevardul Unirii', 'Bulevardul Magheru', 'Strada Lipscani'],
    employers: ['OMV Petrom', 'Banca Transilvania', 'UiPath Romania', 'Dacia Groupe Renault', 'Digi Communications'],
    universities: ['University of Bucharest', 'Politehnica University of Bucharest', 'Babeș-Bolyai University'],
    firstNames: ['Andrei', 'Alexandru', 'Ștefan', 'David', 'Matei', 'Maria', 'Elena', 'Ioana', 'Sofia', 'Antonia'],
    lastNames: ['Popa', 'Popescu', 'Radu', 'Ionescu', 'Dumitru', 'Stoica', 'Gheorghe', 'Stan'],
    hubs: [
      { regionCode: 'B', regionName: 'Bucharest', timezone: 'Europe/Bucharest', city: 'Bucharest', postalCode: '010071', lat: 44.4268, lon: 26.1025, prefixes: [
        { ndc: '722-31', fullPrefix: '4072231', carrierGroup: 'Vodafone', carrierName: 'Vodafone Romania', lineType: 'MOBILE', ocn: 'ANC-VOD' },
        { ndc: '744-21', fullPrefix: '4074421', carrierGroup: 'Orange', carrierName: 'Orange Romania', lineType: 'MOBILE', ocn: 'ANC-ORA' },
      ]},
    ],
  },
  {
    iso2: 'HU', iso3: 'HUN', continentCode: 'EU', name: 'Hungary', callingCode: '36', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'NMHH Hungary', currencySymbol: 'HUF ', basePropertyValue: 92000000,
    streetTemplates: ['Andrássy út', 'Váci utca', 'Rákóczi út', 'Bartók Béla út'],
    employers: ['OTP Bank Nyrt.', 'MOL Group', 'Gedeon Richter Plc', 'Magyar Telekom'],
    universities: ['Eötvös Loránd University (ELTE)', 'Budapest University of Technology (BME)'],
    firstNames: ['Bence', 'Máté', 'Dominik', 'Levente', 'Noel', 'Hanna', 'Zoé', 'Anna', 'Léna', 'Luca'],
    lastNames: ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Kiss', 'Molnár'],
    hubs: [
      { regionCode: 'BU', regionName: 'Budapest', timezone: 'Europe/Budapest', city: 'Budapest', postalCode: '1051', lat: 47.4979, lon: 19.0402, prefixes: [
        { ndc: '30-310', fullPrefix: '3630310', carrierGroup: 'Telekom', carrierName: 'Magyar Telekom', lineType: 'MOBILE', ocn: 'NMHH-TM' },
        { ndc: '20-420', fullPrefix: '3620420', carrierGroup: 'Yettel', carrierName: 'Yettel Hungary', lineType: 'MOBILE', ocn: 'NMHH-YET' },
      ]},
    ],
  },
  {
    iso2: 'UA', iso3: 'UKR', continentCode: 'EU', name: 'Ukraine', callingCode: '380', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'NCEC Ukraine', currencySymbol: '$', basePropertyValue: 135000,
    streetTemplates: ['Khreshchatyk St', 'Volodymyrska St', 'Saksahanskoho St', 'Shevchenka Ave'],
    employers: ['Kyivstar PJSC', 'EPAM Systems Ukraine', 'SoftServe', 'PrivatBank', 'Genesis Tech'],
    universities: ['Taras Shevchenko National University of Kyiv', 'Igor Sikorsky Kyiv Polytechnic'],
    firstNames: ['Oleksandr', 'Maksym', 'Artem', 'Dmytro', 'Andriy', 'Sofiia', 'Anna', 'Mariia', 'Viktoriia', 'Daria'],
    lastNames: ['Melnyk', 'Shevchenko', 'Boyko', 'Kovalenko', 'Bondarenko', 'Tkachenko', 'Kravchenko'],
    hubs: [
      { regionCode: '30', regionName: 'Kyiv City', timezone: 'Europe/Kyiv', city: 'Kyiv', postalCode: '01001', lat: 50.4501, lon: 30.5234, prefixes: [
        { ndc: '67-231', fullPrefix: '38067231', carrierGroup: 'Kyivstar', carrierName: 'Kyivstar GSM', lineType: 'MOBILE', ocn: 'UA-KST' },
        { ndc: '50-310', fullPrefix: '38050310', carrierGroup: 'Vodafone', carrierName: 'Vodafone Ukraine', lineType: 'MOBILE', ocn: 'UA-VOD' },
      ]},
    ],
  },
  {
    iso2: 'TR', iso3: 'TUR', continentCode: 'EU', name: 'Turkey', callingCode: '90', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'BTK Turkey', currencySymbol: '₺', basePropertyValue: 8900000,
    streetTemplates: ['Bağdat Caddesi', 'Büyükdere Caddesi', 'İstiklal Caddesi', 'Atatürk Bulvarı'],
    employers: ['Koç Holding', 'Sabancı Holding', 'Turkish Airlines', 'Turkcell İletişim', 'Garanti BBVA'],
    universities: ['Boğaziçi University', 'Middle East Technical University (METU)', 'Istanbul Technical University'],
    firstNames: ['Yusuf', 'Alparslan', 'Mirza', 'Ömer', 'Kerem', 'Zeynep', 'Elif', 'Defne', 'Asel', 'Azra'],
    lastNames: ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın'],
    hubs: [
      { regionCode: '34', regionName: 'Istanbul', timezone: 'Europe/Istanbul', city: 'Istanbul', postalCode: '34394', lat: 41.0082, lon: 28.9784, prefixes: [
        { ndc: '532-310', fullPrefix: '90532310', carrierGroup: 'Turkcell', carrierName: 'Turkcell İletişim A.Ş.', lineType: 'MOBILE', ocn: 'BTK-TKC' },
        { ndc: '542-410', fullPrefix: '90542410', carrierGroup: 'Vodafone', carrierName: 'Vodafone Türkiye', lineType: 'MOBILE', ocn: 'BTK-VOD' },
      ]},
    ],
  },
  {
    iso2: 'HR', iso3: 'HRV', continentCode: 'EU', name: 'Croatia', callingCode: '385', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'HAKOM Croatia', currencySymbol: '€', basePropertyValue: 285000,
    streetTemplates: ['Ilica', 'Vukovarska ulica', 'Trg bana Jelačića', 'Riva Split'],
    employers: ['Hrvatski Telekom', 'Rimac Technology', 'Infobip', 'Zagrebačka banka'],
    universities: ['University of Zagreb', 'University of Split'],
    firstNames: ['Luka', 'Jakov', 'David', 'Mateo', 'Ivan', 'Mia', 'Lucija', 'Nika', 'Rita', 'Ema'],
    lastNames: ['Horvat', 'Kovačević', 'Babić', 'Marić', 'Jurić', 'Novak', 'Kovačić'],
    hubs: [
      { regionCode: '21', regionName: 'City of Zagreb', timezone: 'Europe/Zagreb', city: 'Zagreb', postalCode: '10000', lat: 45.815, lon: 15.9819, prefixes: [
        { ndc: '98-310', fullPrefix: '38598310', carrierGroup: 'Hrvatski Telekom', carrierName: 'Hrvatski Telekom (T-Mobile)', lineType: 'MOBILE', ocn: 'HAK-HT' },
      ]},
    ],
  },
  {
    iso2: 'IS', iso3: 'ISL', continentCode: 'EU', name: 'Iceland', callingCode: '354', nsnMinLength: 7, nsnMaxLength: 7,
    regulatoryAuthority: 'ECOI Iceland', currencySymbol: 'ISK ', basePropertyValue: 82000000,
    streetTemplates: ['Laugavegur', 'Borgartún', 'Skólavörðustígur', 'Austurstræti'],
    employers: ['Síminn hf.', 'Landsbankinn', 'Icelandair Group', 'Marel hf.'],
    universities: ['University of Iceland', 'Reykjavik University'],
    firstNames: ['Aron', 'Jón', 'Guðmundur', 'Sigurður', 'Gunnar', 'Emilía', 'Sara', 'katrín', 'Anna'],
    lastNames: ['Jónsson', 'Sigurðsson', 'Guðmundsson', 'Gunnarsson', 'Ólafsson', 'Jónsdóttir'],
    hubs: [
      { regionCode: '1', regionName: 'Capital Region', timezone: 'Atlantic/Reykjavik', city: 'Reykjavik', postalCode: '101', lat: 64.1466, lon: -21.9426, prefixes: [
        { ndc: '892', fullPrefix: '354892', carrierGroup: 'Síminn', carrierName: 'Síminn Mobile', lineType: 'MOBILE', ocn: 'IS-SIM' },
      ]},
    ],
  },
  {
    iso2: 'LU', iso3: 'LUX', continentCode: 'EU', name: 'Luxembourg', callingCode: '352', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ILR Luxembourg', currencySymbol: '€', basePropertyValue: 940000,
    streetTemplates: ['Avenue John F. Kennedy', 'Boulevard Royal', 'Grand-Rue'],
    employers: ['ArcelorMittal', 'POST Luxembourg', 'Amazon EU S.à r.l.', 'Banque Internationale à Luxembourg'],
    universities: ['University of Luxembourg'],
    hubs: [
      { regionCode: 'LU', regionName: 'Luxembourg District', timezone: 'Europe/Luxembourg', city: 'Luxembourg City', postalCode: 'L-1855', lat: 49.6116, lon: 6.1319, prefixes: [
        { ndc: '621-31', fullPrefix: '35262131', carrierGroup: 'POST', carrierName: 'POST Luxembourg Mobile', lineType: 'MOBILE', ocn: 'ILR-PST' },
      ]},
    ],
  },

  // ================= ASIA & MIDDLE EAST (22 COUNTRIES) =================
  {
    iso2: 'JP', iso3: 'JPN', continentCode: 'AS', name: 'Japan', callingCode: '81', nsnMinLength: 9, nsnMaxLength: 10,
    regulatoryAuthority: 'MIC Japan', currencySymbol: '¥', basePropertyValue: 74000000,
    streetTemplates: ['Marunouchi Chiyoda-ku', 'Roppongi Minato-ku', 'Shinjuku-dori', 'Ginza Chuo-ku', 'Umeda Kita-ku'],
    employers: ['Toyota Motor Corp', 'Sony Group Corporation', 'Mitsubishi UFJ Financial', 'SoftBank Corp.', 'NTT DOCOMO Inc.', 'Hitachi Ltd.'],
    universities: ['The University of Tokyo', 'Kyoto University', 'Keio University', 'Waseda University', 'Osaka University'],
    firstNames: ['Kenji', 'Haruto', 'Ren', 'Sota', 'Yuto', 'Takashi', 'Yui', 'Hina', 'Aoi', 'Sakura', 'Rin', 'Akiko'],
    lastNames: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato'],
    hubs: [
      { regionCode: '13', regionName: 'Tokyo', timezone: 'Asia/Tokyo', city: 'Tokyo', postalCode: '100-0001', lat: 35.6852, lon: 139.7528, prefixes: [
        { ndc: '90-3100', fullPrefix: '81903100', carrierGroup: 'NTT Docomo', carrierName: 'NTT DOCOMO Inc.', lineType: 'MOBILE', ocn: 'MIC-44010' },
        { ndc: '80-4120', fullPrefix: '81804120', carrierGroup: 'SoftBank', carrierName: 'SoftBank Corp. Mobile', lineType: 'MOBILE', ocn: 'MIC-44020' },
        { ndc: '3-3210', fullPrefix: '8133210', carrierGroup: 'NTT Docomo', carrierName: 'NTT East Tokyo Fixed', lineType: 'LANDLINE', ocn: 'MIC-NTT03' },
      ]},
      { regionCode: '27', regionName: 'Osaka', timezone: 'Asia/Tokyo', city: 'Osaka', postalCode: '530-0001', lat: 34.7025, lon: 135.4961, prefixes: [
        { ndc: '80-5120', fullPrefix: '81805120', carrierGroup: 'KDDI', carrierName: 'KDDI Corporation (au)', lineType: 'MOBILE', ocn: 'MIC-44050' },
      ]},
    ],
  },
  {
    iso2: 'IN', iso3: 'IND', continentCode: 'AS', name: 'India', callingCode: '91', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'TRAI / DoT India', currencySymbol: '₹', basePropertyValue: 18500000,
    streetTemplates: ['Nariman Point', 'MG Road Indiranagar', 'Connaught Place', 'Bandra Kurla Complex', 'Cyber City DLF'],
    employers: ['Tata Consultancy Services (TCS)', 'Infosys Limited', 'HDFC Bank Ltd.', 'Reliance Industries', 'ICICI Bank', 'Bharti Airtel'],
    universities: ['IIT Bombay', 'IIT Delhi', 'Indian Institute of Science (IISc) Bengaluru', 'University of Delhi'],
    firstNames: ['Aarav', 'Rohan', 'Vikram', 'Arjun', 'Siddharth', 'Rajesh', 'Priya', 'Ananya', 'Neha', 'Kavya', 'Aditi', 'Meera'],
    lastNames: ['Sharma', 'Patel', 'Verma', 'Iyer', 'Nair', 'Reddy', 'Gupta', 'Mehta', 'Kulkarni', 'Chatterjee'],
    hubs: [
      { regionCode: 'MH', regionName: 'Maharashtra', timezone: 'Asia/Kolkata', city: 'Mumbai', postalCode: '400001', lat: 18.9346, lon: 72.8362, prefixes: [
        { ndc: '7021-42', fullPrefix: '91702142', carrierGroup: 'Reliance Jio', carrierName: 'Reliance Jio Infocomm', lineType: 'MOBILE', ocn: 'TRAI-JIO' },
        { ndc: '9820-12', fullPrefix: '91982012', carrierGroup: 'Vodafone Idea', carrierName: 'Vi (Vodafone Idea Mumbai)', lineType: 'MOBILE', ocn: 'TRAI-VIM' },
      ]},
      { regionCode: 'KA', regionName: 'Karnataka', timezone: 'Asia/Kolkata', city: 'Bengaluru', postalCode: '560001', lat: 12.9756, lon: 77.6066, prefixes: [
        { ndc: '9845-02', fullPrefix: '91984502', carrierGroup: 'Airtel', carrierName: 'Bharti Airtel Karnataka', lineType: 'MOBILE', ocn: 'TRAI-AIR' },
        { ndc: '9900-14', fullPrefix: '91990014', carrierGroup: 'Reliance Jio', carrierName: 'Reliance Jio Bengaluru', lineType: 'MOBILE', ocn: 'TRAI-JIOK' },
      ]},
      { regionCode: 'DL', regionName: 'Delhi NCR', timezone: 'Asia/Kolkata', city: 'New Delhi', postalCode: '110001', lat: 28.6315, lon: 77.2167, prefixes: [
        { ndc: '9810-12', fullPrefix: '91981012', carrierGroup: 'Airtel', carrierName: 'Bharti Airtel Delhi', lineType: 'MOBILE', ocn: 'TRAI-DEL' },
      ]},
    ],
  },
  {
    iso2: 'CN', iso3: 'CHN', continentCode: 'AS', name: 'China', callingCode: '86', nsnMinLength: 11, nsnMaxLength: 11,
    regulatoryAuthority: 'MIIT China', currencySymbol: '¥', basePropertyValue: 5800000,
    streetTemplates: ['Jianguomenwai Ave', 'Nanjing West Rd', 'Century Ave Pudong', 'Shennan Blvd'],
    employers: ['Tencent Holdings', 'Alibaba Group', 'ICBC Bank', 'Huawei Technologies', 'BYD Company', 'China Mobile Ltd'],
    universities: ['Tsinghua University', 'Peking University', 'Fudan University', 'Shanghai Jiao Tong University'],
    firstNames: ['Wei', 'Hao', 'Yi', 'Jun', 'Ming', 'Bo', 'Jing', 'Yan', 'Li', 'Xin', 'Yue', 'Lin'],
    lastNames: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou'],
    hubs: [
      { regionCode: 'SH', regionName: 'Shanghai', timezone: 'Asia/Shanghai', city: 'Shanghai', postalCode: '200001', lat: 31.2304, lon: 121.4737, prefixes: [
        { ndc: '139-1600', fullPrefix: '861391600', carrierGroup: 'China Mobile', carrierName: 'China Mobile Shanghai', lineType: 'MOBILE', ocn: 'MIIT-CMCC' },
        { ndc: '186-2100', fullPrefix: '861862100', carrierGroup: 'China Unicom', carrierName: 'China Unicom Ltd', lineType: 'MOBILE', ocn: 'MIIT-CUCC' },
      ]},
      { regionCode: 'BJ', regionName: 'Beijing', timezone: 'Asia/Shanghai', city: 'Beijing', postalCode: '100000', lat: 39.9042, lon: 116.4074, prefixes: [
        { ndc: '138-1000', fullPrefix: '861381000', carrierGroup: 'China Mobile', carrierName: 'China Mobile Beijing', lineType: 'MOBILE', ocn: 'MIIT-CMBJ' },
      ]},
    ],
  },
  {
    iso2: 'SG', iso3: 'SGP', continentCode: 'AS', name: 'Singapore', callingCode: '65', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'IMDA Singapore', currencySymbol: 'S$', basePropertyValue: 1650000,
    streetTemplates: ['Marina Blvd', 'Raffles Place', 'Orchard Rd', 'Robinson Rd', 'Anson Rd'],
    employers: ['DBS Bank Ltd', 'Singtel Group', 'Sea Limited', 'Grab Holdings', 'OCBC Bank', 'CapitaLand'],
    universities: ['National University of Singapore (NUS)', 'Nanyang Technological University (NTU)', 'SMU Singapore'],
    firstNames: ['Wei Jie', 'Jun Hao', 'Ethan', 'Marcus', 'Ryan', 'Rachel', 'Chloe', 'Hui Min', 'Jia Yi', 'Sarah'],
    lastNames: ['Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Wong', 'Goh', 'Chua', 'Chan', 'Koh'],
    hubs: [
      { regionCode: '01', regionName: 'Central Singapore', timezone: 'Asia/Singapore', city: 'Singapore', postalCode: '018956', lat: 1.2834, lon: 103.8607, prefixes: [
        { ndc: '9112', fullPrefix: '659112', carrierGroup: 'Singtel', carrierName: 'Singtel Mobile Singapore', lineType: 'MOBILE', ocn: 'IMDA-SGT' },
        { ndc: '9620', fullPrefix: '659620', carrierGroup: 'StarHub', carrierName: 'StarHub Mobile Pte Ltd', lineType: 'MOBILE', ocn: 'IMDA-STH' },
        { ndc: '8124', fullPrefix: '658124', carrierGroup: 'M1', carrierName: 'M1 Limited', lineType: 'MOBILE', ocn: 'IMDA-M1' },
      ]},
    ],
  },
  {
    iso2: 'KR', iso3: 'KOR', continentCode: 'AS', name: 'South Korea', callingCode: '82', nsnMinLength: 9, nsnMaxLength: 10,
    regulatoryAuthority: 'MSIT South Korea', currencySymbol: '₩', basePropertyValue: 1150000000,
    streetTemplates: ['Teheran-ro Gangnam-gu', 'Sejong-daero Jung-gu', 'Yeouidaero', 'itaewon-ro'],
    employers: ['Samsung Electronics', 'Hyundai Motor Company', 'SK Hynix', 'LG Electronics', 'Naver Corp', 'Kakao Corp'],
    universities: ['Seoul National University (SNU)', 'KAIST', 'Yonsei University', 'Korea University'],
    firstNames: ['Min-jun', 'Seo-jun', 'Do-yun', 'Ji-ho', 'Hyun-woo', 'Seo-yeon', 'Ji-woo', 'Ha-eun', 'Min-seo', 'Su-bin'],
    lastNames: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim'],
    hubs: [
      { regionCode: '11', regionName: 'Seoul', timezone: 'Asia/Seoul', city: 'Seoul', postalCode: '04524', lat: 37.5665, lon: 126.978, prefixes: [
        { ndc: '10-3120', fullPrefix: '82103120', carrierGroup: 'SK Telecom', carrierName: 'SK Telecom Co. Ltd.', lineType: 'MOBILE', ocn: 'MSIT-SKT' },
        { ndc: '10-7210', fullPrefix: '82107210', carrierGroup: 'KT', carrierName: 'KT Corporation', lineType: 'MOBILE', ocn: 'MSIT-KTC' },
      ]},
    ],
  },
  {
    iso2: 'AE', iso3: 'ARE', continentCode: 'AS', name: 'United Arab Emirates', callingCode: '971', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'TDRA UAE', currencySymbol: 'AED ', basePropertyValue: 2650000,
    streetTemplates: ['Sheikh Zayed Rd', 'Mohammed Bin Rashid Blvd', 'Al Maryah Island', 'Jumeirah Beach Rd'],
    employers: ['Emirates Group', 'ADNOC', 'First Abu Dhabi Bank (FAB)', 'Emaar Properties', 'e& (Etisalat)', 'DP World'],
    universities: ['Khalifa University', 'American University of Sharjah', 'UAE University'],
    firstNames: ['Tariq', 'Omar', 'Khalid', 'Zayd', 'Rashid', 'Hamdan', 'Layla', 'Noor', 'Mariam', 'Fatima', 'Amina'],
    lastNames: ['Al Maktoum', 'Al Nahyan', 'Al Mansoori', 'Al Hashimi', 'Al Suwaidi', 'Al Nuaimi', 'Al Shamsi'],
    hubs: [
      { regionCode: 'DU', regionName: 'Dubai', timezone: 'Asia/Dubai', city: 'Dubai', postalCode: '00000', lat: 25.2048, lon: 55.2708, prefixes: [
        { ndc: '50-421', fullPrefix: '97150421', carrierGroup: 'Etisalat', carrierName: 'Etisalat by e& UAE', lineType: 'MOBILE', ocn: 'TDRA-42402' },
        { ndc: '55-310', fullPrefix: '97155310', carrierGroup: 'du', carrierName: 'Emirates Integrated Telecom (du)', lineType: 'MOBILE', ocn: 'TDRA-42403' },
      ]},
      { regionCode: 'AZ', regionName: 'Abu Dhabi', timezone: 'Asia/Dubai', city: 'Abu Dhabi', postalCode: '51133', lat: 24.4539, lon: 54.3773, prefixes: [
        { ndc: '56-210', fullPrefix: '97156210', carrierGroup: 'Etisalat', carrierName: 'Etisalat Abu Dhabi', lineType: 'MOBILE', ocn: 'TDRA-42402' },
      ]},
    ],
  },
  {
    iso2: 'SA', iso3: 'SAU', continentCode: 'AS', name: 'Saudi Arabia', callingCode: '966', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'CST Saudi Arabia', currencySymbol: 'SAR ', basePropertyValue: 1850000,
    streetTemplates: ['King Fahd Rd', 'Olaya St', 'Tahlia St', 'Corniche Rd Jeddah'],
    employers: ['Saudi Aramco', 'Al Rajhi Bank', 'stc Group', 'SABIC', 'Saudi National Bank'],
    universities: ['King Saud University', 'KAUST', 'King Fahd University of Petroleum & Minerals'],
    firstNames: ['Abdullah', 'Fahad', 'Salman', 'Faisal', 'Turki', 'Noura', 'Sara', 'Maha', 'Reem', 'Lama'],
    lastNames: ['Al Saud', 'Al Qahtani', 'Al Otaibi', 'Al Ghamdi', 'Al Shehri', 'Al Dosari', 'Al Harbi'],
    hubs: [
      { regionCode: '01', regionName: 'Riyadh Province', timezone: 'Asia/Riyadh', city: 'Riyadh', postalCode: '11564', lat: 24.7136, lon: 46.6753, prefixes: [
        { ndc: '50-510', fullPrefix: '96650510', carrierGroup: 'stc', carrierName: 'Saudi Telecom Company (stc)', lineType: 'MOBILE', ocn: 'CST-STC' },
        { ndc: '54-320', fullPrefix: '96654320', carrierGroup: 'Mobily', carrierName: 'Etihad Etisalat (Mobily)', lineType: 'MOBILE', ocn: 'CST-MOB' },
      ]},
    ],
  },
  {
    iso2: 'IL', iso3: 'ISR', continentCode: 'AS', name: 'Israel', callingCode: '972', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'MoC Israel', currencySymbol: '₪', basePropertyValue: 3200000,
    streetTemplates: ['Rothschild Blvd', 'Dizengoff St', 'Ibn Gabirol St', 'Jaffa Rd'],
    employers: ['Check Point Software', 'Wix.com Ltd.', 'Bank Leumi', 'Teva Pharmaceutical', 'Mobileye'],
    universities: ['Tel Aviv University', 'Technion – Israel Institute of Technology', 'Hebrew University of Jerusalem'],
    firstNames: ['Noam', 'Uri', 'Itai', 'David', 'Yosef', 'Maya', 'Tamar', 'Noa', 'Yael', 'Shira'],
    lastNames: ['Cohen', 'Levi', 'Mizrachi', 'Peretz', 'Biton', 'Dahan', 'Avraham', 'Friedman'],
    hubs: [
      { regionCode: 'TA', regionName: 'Tel Aviv District', timezone: 'Asia/Jerusalem', city: 'Tel Aviv', postalCode: '66881', lat: 32.0853, lon: 34.7818, prefixes: [
        { ndc: '52-310', fullPrefix: '97252310', carrierGroup: 'Cellcom', carrierName: 'Cellcom Israel Ltd.', lineType: 'MOBILE', ocn: 'MOC-CEL' },
        { ndc: '54-420', fullPrefix: '97254420', carrierGroup: 'Partner', carrierName: 'Partner Communications', lineType: 'MOBILE', ocn: 'MOC-PRT' },
      ]},
    ],
  },
  {
    iso2: 'QA', iso3: 'QAT', continentCode: 'AS', name: 'Qatar', callingCode: '974', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'CRA Qatar', currencySymbol: 'QAR ', basePropertyValue: 2400000,
    streetTemplates: ['Corniche Promenade', 'Lusail Blvd', 'Al Sadd St', 'West Bay Diplomatic St'],
    employers: ['QatarEnergy', 'Qatar Airways', 'Qatar National Bank (QNB)', 'Ooredoo Q.P.S.C.'],
    universities: ['Qatar University', 'Hamad Bin Khalifa University'],
    hubs: [
      { regionCode: 'DA', regionName: 'Ad Dawhah', timezone: 'Asia/Qatar', city: 'Doha', postalCode: '22123', lat: 25.2854, lon: 51.531, prefixes: [
        { ndc: '5512', fullPrefix: '9745512', carrierGroup: 'Ooredoo', carrierName: 'Ooredoo Qatar', lineType: 'MOBILE', ocn: 'CRA-OOR' },
        { ndc: '3021', fullPrefix: '9743021', carrierGroup: 'Vodafone', carrierName: 'Vodafone Qatar', lineType: 'MOBILE', ocn: 'CRA-VOD' },
      ]},
    ],
  },
  {
    iso2: 'KW', iso3: 'KWT', continentCode: 'AS', name: 'Kuwait', callingCode: '965', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'CITRA Kuwait', currencySymbol: 'KWD ', basePropertyValue: 210000,
    streetTemplates: ['Arabian Gulf St', 'Fahad Al-Salem St', 'Salem Al-Mubarak St'],
    employers: ['National Bank of Kuwait (NBK)', 'Zain Group', 'Kuwait Finance House', 'Agility Public Warehousing'],
    universities: ['Kuwait University', 'American University of Kuwait'],
    hubs: [
      { regionCode: 'KU', regionName: 'Al Asimah', timezone: 'Asia/Kuwait', city: 'Kuwait City', postalCode: '13001', lat: 29.3759, lon: 47.9774, prefixes: [
        { ndc: '9912', fullPrefix: '9659912', carrierGroup: 'Zain', carrierName: 'Zain Kuwait', lineType: 'MOBILE', ocn: 'CIT-ZAI' },
      ]},
    ],
  },
  {
    iso2: 'JO', iso3: 'JOR', continentCode: 'AS', name: 'Jordan', callingCode: '962', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'TRC Jordan', currencySymbol: 'JOD ', basePropertyValue: 185000,
    streetTemplates: ['Zahran St', 'Rainbow St', 'Abdali Blvd', 'Mecca St'],
    employers: ['Arab Bank', 'Zain Jordan', 'Royal Jordanian', 'Hikma Pharmaceuticals'],
    universities: ['University of Jordan', 'Jordan University of Science & Technology'],
    hubs: [
      { regionCode: 'AM', regionName: 'Amman', timezone: 'Asia/Amman', city: 'Amman', postalCode: '11181', lat: 31.9454, lon: 35.9284, prefixes: [
        { ndc: '79-510', fullPrefix: '96279510', carrierGroup: 'Zain', carrierName: 'Zain Jordan', lineType: 'MOBILE', ocn: 'TRC-ZAI' },
      ]},
    ],
  },
  {
    iso2: 'PH', iso3: 'PHL', continentCode: 'AS', name: 'Philippines', callingCode: '63', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'NTC Philippines', currencySymbol: '₱', basePropertyValue: 16500000,
    streetTemplates: ['Ayala Ave Makati', 'Bonifacio High St BGC', 'Ortigas Ave', 'Roxas Blvd'],
    employers: ['Ayala Corporation', 'SM Investments', 'BDO Unibank', 'PLDT Inc.', 'Globe Telecom', 'Jollibee Foods Corp'],
    universities: ['University of the Philippines Diliman', 'Ateneo de Manila University', 'De La Salle University'],
    firstNames: ['Miguel', 'Rafael', 'Gabriel', 'Joshua', 'Carlo', 'Maria', 'Angela', 'Bea', 'Camille', 'Bianca'],
    lastNames: ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Villanueva', 'Ramos'],
    hubs: [
      { regionCode: 'NCR', regionName: 'Metro Manila', timezone: 'Asia/Manila', city: 'Makati Manila', postalCode: '1226', lat: 14.5547, lon: 121.0244, prefixes: [
        { ndc: '917-310', fullPrefix: '63917310', carrierGroup: 'Globe', carrierName: 'Globe Telecom Inc.', lineType: 'MOBILE', ocn: 'NTC-51502' },
        { ndc: '918-420', fullPrefix: '63918420', carrierGroup: 'Smart', carrierName: 'Smart Communications (PLDT)', lineType: 'MOBILE', ocn: 'NTC-51503' },
      ]},
    ],
  },
  {
    iso2: 'ID', iso3: 'IDN', continentCode: 'AS', name: 'Indonesia', callingCode: '62', nsnMinLength: 10, nsnMaxLength: 11,
    regulatoryAuthority: 'Kominfo Indonesia', currencySymbol: 'Rp ', basePropertyValue: 3200000000,
    streetTemplates: ['Jl. Jenderal Sudirman', 'Jl. M.H. Thamrin', 'Jl. Gatot Subroto', 'SCBD Lot 9'],
    employers: ['Bank Central Asia (BCA)', 'Telkom Indonesia', 'GoTo Group', 'Bank Mandiri', 'Astra International'],
    universities: ['Universitas Indonesia (UI)', 'Institut Teknologi Bandung (ITB)', 'Universitas Gadjah Mada'],
    firstNames: ['Budi', 'Rizky', 'Andi', 'Dimas', 'Fajar', 'Siti', 'Putri', 'Dewi', 'Ayu', 'Nadia'],
    lastNames: ['Saputra', 'Pratama', 'Wijaya', 'Hidayat', 'Santoso', 'Nugroho', 'Kusuma', 'Setiawan'],
    hubs: [
      { regionCode: 'JK', regionName: 'Jakarta', timezone: 'Asia/Jakarta', city: 'Jakarta', postalCode: '10110', lat: -6.1751, lon: 106.865, prefixes: [
        { ndc: '812-3100', fullPrefix: '628123100', carrierGroup: 'Telkomsel', carrierName: 'PT Telkomsel Indonesia', lineType: 'MOBILE', ocn: 'KOM-51010' },
        { ndc: '815-4200', fullPrefix: '628154200', carrierGroup: 'Indosat', carrierName: 'Indosat Ooredoo Hutchison', lineType: 'MOBILE', ocn: 'KOM-51001' },
      ]},
    ],
  },
  {
    iso2: 'TH', iso3: 'THA', continentCode: 'AS', name: 'Thailand', callingCode: '66', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'NBTC Thailand', currencySymbol: '฿', basePropertyValue: 9800000,
    streetTemplates: ['Sukhumvit Rd', 'Silom Rd', 'Sathorn Tai Rd', 'Ratchadamri Rd'],
    employers: ['PTT Public Company', 'SCB X', 'Advanced Info Service (AIS)', 'CP Group', 'Kasikornbank'],
    universities: ['Chulalongkorn University', 'Mahidol University', 'Thammasat University'],
    firstNames: ['Somchai', 'Nattapong', 'Kittisak', 'Thanawat', 'Ploy', 'Kanya', 'Siriporn', 'Pimchanok'],
    lastNames: ['Saetang', 'Srisai', 'Charoenpura', 'Wongsuwan', 'Suwannarat', 'Rattanaporn'],
    hubs: [
      { regionCode: '10', regionName: 'Bangkok', timezone: 'Asia/Bangkok', city: 'Bangkok', postalCode: '10110', lat: 13.7563, lon: 100.5018, prefixes: [
        { ndc: '81-310', fullPrefix: '6681310', carrierGroup: 'AIS', carrierName: 'AIS Mobile Thailand', lineType: 'MOBILE', ocn: 'NBTC-AIS' },
        { ndc: '89-420', fullPrefix: '6689420', carrierGroup: 'TrueMove', carrierName: 'True Corp Thailand', lineType: 'MOBILE', ocn: 'NBTC-TRU' },
      ]},
    ],
  },
  {
    iso2: 'VN', iso3: 'VNM', continentCode: 'AS', name: 'Vietnam', callingCode: '84', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'VNTA Vietnam', currencySymbol: '₫', basePropertyValue: 6500000000,
    streetTemplates: ['Nguyễn Huệ Blvd', 'Lê Lợi St', 'Tràng Tiền', 'Điện Biên Phủ'],
    employers: ['Viettel Group', 'FPT Corporation', 'Vingroup', 'Vietcombank', 'VNG Corporation'],
    universities: ['Vietnam National University', 'Hanoi University of Science & Technology'],
    firstNames: ['Minh', 'Anh', 'Hùng', 'Tuấn', 'Đức', 'Linh', 'Trang', 'Hương', 'Thảo', 'Lan'],
    lastNames: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi'],
    hubs: [
      { regionCode: 'SG', regionName: 'Ho Chi Minh City', timezone: 'Asia/Ho_Chi_Minh', city: 'Ho Chi Minh City', postalCode: '700000', lat: 10.8231, lon: 106.6297, prefixes: [
        { ndc: '98-310', fullPrefix: '8498310', carrierGroup: 'Viettel', carrierName: 'Viettel Telecom', lineType: 'MOBILE', ocn: 'VN-VTL' },
        { ndc: '90-420', fullPrefix: '8490420', carrierGroup: 'MobiFone', carrierName: 'MobiFone Vietnam', lineType: 'MOBILE', ocn: 'VN-MBF' },
      ]},
    ],
  },
  {
    iso2: 'MY', iso3: 'MYS', continentCode: 'AS', name: 'Malaysia', callingCode: '60', nsnMinLength: 9, nsnMaxLength: 10,
    regulatoryAuthority: 'MCMC Malaysia', currencySymbol: 'RM ', basePropertyValue: 920000,
    streetTemplates: ['Jalan Ampang', 'Jalan Bukit Bintang', 'Persiaran KLCC', 'Jalan Tun Razak'],
    employers: ['Maybank', 'Petronas', 'CIMB Group', 'CelcomDigi', 'Maxis Berhad', 'Tenaga Nasional'],
    universities: ['Universiti Malaya (UM)', 'Universiti Kebangsaan Malaysia', 'Universiti Sains Malaysia'],
    firstNames: ['Ahmad', 'Muhammad', 'Daniel', 'Wei Liang', 'Arjun', 'Nurul', 'Aisyah', 'Mei Ling', 'Priya'],
    lastNames: ['Abdullah', 'Ismail', 'Ibrahim', 'Tan', 'Lim', 'Wong', 'Subramaniam'],
    hubs: [
      { regionCode: '14', regionName: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', city: 'Kuala Lumpur', postalCode: '50088', lat: 3.139, lon: 101.6869, prefixes: [
        { ndc: '12-310', fullPrefix: '6012310', carrierGroup: 'Maxis', carrierName: 'Maxis Mobile Malaysia', lineType: 'MOBILE', ocn: 'MCMC-MXS' },
        { ndc: '19-420', fullPrefix: '6019420', carrierGroup: 'CelcomDigi', carrierName: 'CelcomDigi Berhad', lineType: 'MOBILE', ocn: 'MCMC-CLD' },
      ]},
    ],
  },
  {
    iso2: 'TW', iso3: 'TWN', continentCode: 'AS', name: 'Taiwan', callingCode: '886', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'NCC Taiwan', currencySymbol: 'NT$', basePropertyValue: 26500000,
    streetTemplates: ['Xinyi Rd Sec 5', 'Zhongxiao East Rd', 'Dunhua South Rd', 'Ren’ai Rd'],
    employers: ['TSMC (Taiwan Semiconductor)', 'Foxconn Hon Hai', 'MediaTek Inc.', 'Cathay Financial', 'Chunghwa Telecom'],
    universities: ['National Taiwan University (NTU)', 'National Tsing Hua University', 'NYCU Taiwan'],
    firstNames: ['Chia-Hao', 'Kuan-Yu', 'Cheng-Han', 'Yu-Ting', 'Yi-Chun', 'Ya-Ting', '怡君', '宗翰'],
    lastNames: ['Chen', 'Lin', 'Huang', 'Chang', 'Lee', 'Wang', 'Wu', 'Liu', 'Tsai', 'Yang'],
    hubs: [
      { regionCode: 'TPE', regionName: 'Taipei', timezone: 'Asia/Taipei', city: 'Taipei', postalCode: '110', lat: 25.033, lon: 121.5654, prefixes: [
        { ndc: '910-31', fullPrefix: '88691031', carrierGroup: 'Chunghwa', carrierName: 'Chunghwa Telecom Mobile', lineType: 'MOBILE', ocn: 'NCC-CHT' },
        { ndc: '920-42', fullPrefix: '88692042', carrierGroup: 'Taiwan Mobile', carrierName: 'Taiwan Mobile Co.', lineType: 'MOBILE', ocn: 'NCC-TWM' },
      ]},
    ],
  },
  {
    iso2: 'HK', iso3: 'HKG', continentCode: 'AS', name: 'Hong Kong', callingCode: '852', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'OFCA Hong Kong', currencySymbol: 'HK$', basePropertyValue: 11200000,
    streetTemplates: ['Queen’s Road Central', 'Des Voeux Rd', 'Hennessy Rd', 'Nathan Rd'],
    employers: ['HSBC Hong Kong', 'AIA Group', 'HKEX', 'CK Hutchison', 'Cathay Pacific', 'HKT CSL'],
    universities: ['University of Hong Kong (HKU)', 'HKUST', 'Chinese University of Hong Kong'],
    firstNames: ['Ka Ho', 'Chun Kit', 'Kelvin', 'Anson', 'Wing Yan', 'Tsz Ching', 'Tiffany', 'Carmen'],
    lastNames: ['Chan', 'Lee', 'Wong', 'Cheung', 'Lau', 'Ng', 'Ho', 'Leung', 'Kwok'],
    hubs: [
      { regionCode: 'HKI', regionName: 'Hong Kong Island', timezone: 'Asia/Hong_Kong', city: 'Central Hong Kong', postalCode: '999077', lat: 22.2819, lon: 114.1582, prefixes: [
        { ndc: '9012', fullPrefix: '8529012', carrierGroup: 'CSL', carrierName: 'CSL Mobile (HKT)', lineType: 'MOBILE', ocn: 'OFCA-CSL' },
        { ndc: '6120', fullPrefix: '8526120', carrierGroup: '3 HK', carrierName: 'Hutchison 3 Hong Kong', lineType: 'MOBILE', ocn: 'OFCA-3HK' },
      ]},
    ],
  },
  {
    iso2: 'PK', iso3: 'PAK', continentCode: 'AS', name: 'Pakistan', callingCode: '92', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'PTA Pakistan', currencySymbol: 'PKR ', basePropertyValue: 38000000,
    streetTemplates: ['I.I. Chundrigar Rd', 'Main Boulevard Gulberg', 'Jinnah Ave Blue Area', 'Clifton Block 4'],
    employers: ['Habib Bank Limited (HBL)', 'Systems Limited', 'Jazz (PMCL)', 'Engro Corporation', 'Meezan Bank'],
    universities: ['LUMS Lahore', 'NUST Islamabad', 'IBA Karachi'],
    firstNames: ['Bilal', 'Usman', 'Hamza', 'Ali', 'Hassan', 'Ayesha', 'Fatima', 'Zainab', 'Hira', 'Sana'],
    lastNames: ['Khan', 'Ahmed', 'Malik', 'Hussain', 'Sheikh', 'Siddiqui', 'Chaudhry', 'Qureshi'],
    hubs: [
      { regionCode: 'SD', regionName: 'Sindh', timezone: 'Asia/Karachi', city: 'Karachi', postalCode: '75500', lat: 24.8607, lon: 67.0011, prefixes: [
        { ndc: '300-210', fullPrefix: '92300210', carrierGroup: 'Jazz', carrierName: 'Jazz Pakistan Mobile', lineType: 'MOBILE', ocn: 'PTA-JAZ' },
        { ndc: '333-310', fullPrefix: '92333310', carrierGroup: 'Ufone', carrierName: 'PTML Ufone', lineType: 'MOBILE', ocn: 'PTA-UFN' },
      ]},
    ],
  },
  {
    iso2: 'BD', iso3: 'BGD', continentCode: 'AS', name: 'Bangladesh', callingCode: '880', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'BTRC Bangladesh', currencySymbol: '৳', basePropertyValue: 22000000,
    streetTemplates: ['Gulshan Ave', 'Banani Rd 11', 'Motijheel C/A', 'Dhanmondi Rd 27'],
    employers: ['Grameenphone Ltd', 'BRAC Bank', 'bKash Limited', 'Square Pharmaceuticals', 'Robi Axiata'],
    universities: ['University of Dhaka', 'BUET Dhaka', 'North South University'],
    firstNames: ['Tanvir', 'Rahim', 'Shakib', 'Farhan', 'Nafis', 'Nusrat', 'Tasnim', 'Sadia', 'Farzana'],
    lastNames: ['Rahman', 'Islam', 'Ahmed', 'Hossain', 'Chowdhury', 'Uddin', 'Khan', 'Akter'],
    hubs: [
      { regionCode: 'C', regionName: 'Dhaka Division', timezone: 'Asia/Dhaka', city: 'Dhaka', postalCode: '1212', lat: 23.8103, lon: 90.4125, prefixes: [
        { ndc: '1711-31', fullPrefix: '880171131', carrierGroup: 'Grameenphone', carrierName: 'Grameenphone (Telenor)', lineType: 'MOBILE', ocn: 'BTRC-GP' },
        { ndc: '1819-21', fullPrefix: '880181921', carrierGroup: 'Robi', carrierName: 'Robi Axiata Bangladesh', lineType: 'MOBILE', ocn: 'BTRC-RBI' },
      ]},
    ],
  },
  {
    iso2: 'LK', iso3: 'LKA', continentCode: 'AS', name: 'Sri Lanka', callingCode: '94', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'TRCSL Sri Lanka', currencySymbol: 'LKR ', basePropertyValue: 45000000,
    streetTemplates: ['Galle Rd Colombo 03', 'Duplication Rd', 'Union Place', 'Ward Place'],
    employers: ['Dialog Axiata PLC', 'John Keells Holdings', 'Commercial Bank of Ceylon', 'MAS Holdings'],
    universities: ['University of Colombo', 'University of Moratuwa'],
    hubs: [
      { regionCode: '1', regionName: 'Western Province', timezone: 'Asia/Colombo', city: 'Colombo', postalCode: '00100', lat: 6.9271, lon: 79.8612, prefixes: [
        { ndc: '77-310', fullPrefix: '9477310', carrierGroup: 'Dialog', carrierName: 'Dialog Axiata Mobile', lineType: 'MOBILE', ocn: 'SL-DLG' },
      ]},
    ],
  },
  {
    iso2: 'KZ', iso3: 'KAZ', continentCode: 'AS', name: 'Kazakhstan', callingCode: '7', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'MDDIAI Kazakhstan', currencySymbol: '₸', basePropertyValue: 68000000,
    streetTemplates: ['Al-Farabi Ave', 'Dostyk Ave', 'Mangilik El Ave', 'Abay Ave'],
    employers: ['Kaspi.kz', 'Halyk Bank', 'Kcell JSC', 'KazMunayGas'],
    universities: ['Nazarbayev University', 'Al-Farabi Kazakh National University'],
    hubs: [
      { regionCode: 'ALA', regionName: 'Almaty', timezone: 'Asia/Almaty', city: 'Almaty', postalCode: '050000', lat: 43.222, lon: 76.8512, prefixes: [
        { ndc: '701-310', fullPrefix: '7701310', carrierGroup: 'Kcell', carrierName: 'Kcell JSC Kazakhstan', lineType: 'MOBILE', ocn: 'KZ-KCL' },
      ]},
    ],
  },

  // ================= SOUTH AMERICA (10 COUNTRIES) =================
  {
    iso2: 'BR', iso3: 'BRA', continentCode: 'SA', name: 'Brazil', callingCode: '55', nsnMinLength: 10, nsnMaxLength: 11,
    regulatoryAuthority: 'Anatel Brazil', currencySymbol: 'R$ ', basePropertyValue: 1450000,
    streetTemplates: ['Avenida Paulista', 'Av. Brigadeiro Faria Lima', 'Av. Atlântica Copacabana', 'Rua Oscar Freire'],
    employers: ['Itaú Unibanco', 'Nubank', 'Petrobras', 'Vale S.A.', 'Embraer S.A.', 'Telefônica Vivo'],
    universities: ['Universidade de São Paulo (USP)', 'UNICAMP', 'UFRJ Rio de Janeiro', 'FGV São Paulo'],
    firstNames: ['Gabriel', 'Lucas', 'Matheus', 'Pedro', 'Rafael', 'Bruno', 'Júlia', 'Beatriz', 'Mariana', 'Larissa', 'Camila', 'Fernanda'],
    lastNames: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Costa'],
    hubs: [
      { regionCode: 'SP', regionName: 'São Paulo', timezone: 'America/Sao_Paulo', city: 'São Paulo', postalCode: '01310-100', lat: -23.5614, lon: -46.6559, prefixes: [
        { ndc: '11-99610', fullPrefix: '551199610', carrierGroup: 'Vivo', carrierName: 'Vivo (Telefônica Brasil)', lineType: 'MOBILE', ocn: 'ANATEL-320' },
        { ndc: '11-98120', fullPrefix: '551198120', carrierGroup: 'TIM', carrierName: 'TIM S.A. Brasil', lineType: 'MOBILE', ocn: 'ANATEL-341' },
      ]},
      { regionCode: 'RJ', regionName: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', city: 'Rio de Janeiro', postalCode: '20040-002', lat: -22.9035, lon: -43.1769, prefixes: [
        { ndc: '21-99820', fullPrefix: '552199820', carrierGroup: 'Claro', carrierName: 'Claro S.A. Brasil', lineType: 'MOBILE', ocn: 'ANATEL-321' },
      ]},
    ],
  },
  {
    iso2: 'AR', iso3: 'ARG', continentCode: 'SA', name: 'Argentina', callingCode: '54', nsnMinLength: 10, nsnMaxLength: 11,
    regulatoryAuthority: 'ENACOM Argentina', currencySymbol: 'US$', basePropertyValue: 235000,
    streetTemplates: ['Av. del Libertador', 'Av. Corrientes', 'Av. Santa Fe Palermo', 'Juana Manso Puerto Madero'],
    employers: ['Mercado Libre', 'Globant', 'YPF S.A.', 'Banco Galicia', 'Telecom Personal'],
    universities: ['Universidad de Buenos Aires (UBA)', 'Universidad Torcuato Di Tella', 'Universidad Austral'],
    firstNames: ['Juan', 'Bautista', 'Joaquín', 'Tomás', 'Nicolás', 'Valentina', 'Martina', 'Catalina', 'Camila', 'Agustina'],
    lastNames: ['González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Martínez', 'Díaz', 'Pérez', 'Romero'],
    hubs: [
      { regionCode: 'C', regionName: 'Buenos Aires CABA', timezone: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', postalCode: 'C1002', lat: -34.6037, lon: -58.3816, prefixes: [
        { ndc: '911-5420', fullPrefix: '549115420', carrierGroup: 'Personal', carrierName: 'Telecom Personal Argentina', lineType: 'MOBILE', ocn: 'ENACOM-340' },
        { ndc: '911-6210', fullPrefix: '549116210', carrierGroup: 'Claro', carrierName: 'AMX Claro Argentina', lineType: 'MOBILE', ocn: 'ENACOM-310' },
      ]},
    ],
  },
  {
    iso2: 'CO', iso3: 'COL', continentCode: 'SA', name: 'Colombia', callingCode: '57', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'CRC Colombia', currencySymbol: 'COP ', basePropertyValue: 680000000,
    streetTemplates: ['Carrera 7 Chapinero', 'Calle 93 Parque', 'Avenida El Poblado', 'Carrera 15 Norte'],
    employers: ['Bancolombia', 'Ecopetrol S.A.', 'Rappi Colombia', 'Grupo Aval', 'Claro Colombia'],
    universities: ['Universidad de los Andes', 'Universidad Nacional de Colombia', 'EAFIT Medellín'],
    firstNames: ['Andrés', 'Camilo', 'Santiago', 'Juan', 'Felipe', 'Laura', 'Daniela', 'Valentina', 'Carolina', 'Natalia'],
    lastNames: ['Rodríguez', 'Gómez', 'González', 'Martínez', 'García', 'López', 'Hernández', 'Ramírez', 'Torres'],
    hubs: [
      { regionCode: 'DC', regionName: 'Bogotá D.C.', timezone: 'America/Bogota', city: 'Bogotá', postalCode: '110111', lat: 4.711, lon: -74.0721, prefixes: [
        { ndc: '310-240', fullPrefix: '57310240', carrierGroup: 'Claro', carrierName: 'Claro Colombia (Comcel)', lineType: 'MOBILE', ocn: 'CRC-732101' },
        { ndc: '300-310', fullPrefix: '57300310', carrierGroup: 'Tigo', carrierName: 'Colombia Móvil (Tigo)', lineType: 'MOBILE', ocn: 'CRC-732103' },
      ]},
    ],
  },
  {
    iso2: 'CL', iso3: 'CHL', continentCode: 'SA', name: 'Chile', callingCode: '56', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'SUBTEL Chile', currencySymbol: 'CLP ', basePropertyValue: 215000000,
    streetTemplates: ['Av. Apoquindo Las Condes', 'Av. Providencia', 'Av. Vitacura', 'Alameda Bernardo O’Higgins'],
    employers: ['LATAM Airlines Group', 'Banco de Chile', 'Falabella S.A.', 'Cencosud', 'Entel Chile'],
    universities: ['Pontificia Universidad Católica de Chile', 'Universidad de Chile'],
    firstNames: ['Benjamín', 'Vicente', 'Matías', 'Martín', 'Diego', 'Catalina', 'Florencia', 'Isidora', 'Antonia', 'Javiera'],
    lastNames: ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Sepúlveda'],
    hubs: [
      { regionCode: 'RM', regionName: 'Santiago Metropolitan', timezone: 'America/Santiago', city: 'Santiago', postalCode: '8320000', lat: -33.4489, lon: -70.6693, prefixes: [
        { ndc: '9-9231', fullPrefix: '5699231', carrierGroup: 'Entel', carrierName: 'Entel PCS Telecomunicaciones', lineType: 'MOBILE', ocn: 'SUBTEL-73001' },
        { ndc: '9-8410', fullPrefix: '5698410', carrierGroup: 'Movistar', carrierName: 'Movistar Chile', lineType: 'MOBILE', ocn: 'SUBTEL-73002' },
      ]},
    ],
  },
  {
    iso2: 'PE', iso3: 'PER', continentCode: 'SA', name: 'Peru', callingCode: '51', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'OSIPTEL Peru', currencySymbol: 'S/ ', basePropertyValue: 780000,
    streetTemplates: ['Av. Javier Prado Este', 'Av. José Larco Miraflores', 'Calle Las Begonias San Isidro'],
    employers: ['Credicorp / BCP', 'Interbank Peru', 'Alicorp', 'América Móvil Perú (Claro)'],
    universities: ['Pontificia Universidad Católica del Perú (PUCP)', 'Universidad Nacional Mayor de San Marcos'],
    firstNames: ['Sebastián', 'Mateo', 'Rodrigo', 'Diego', 'Alonso', 'Camila', 'Valeria', 'Luciana', 'Ximena'],
    lastNames: ['Quispe', 'Flores', 'Sánchez', 'García', 'Rodríguez', 'Rojas', 'Chávez', 'Vásquez'],
    hubs: [
      { regionCode: 'LMA', regionName: 'Lima Province', timezone: 'America/Lima', city: 'Lima', postalCode: '15074', lat: -12.0464, lon: -77.0428, prefixes: [
        { ndc: '997-31', fullPrefix: '5199731', carrierGroup: 'Claro', carrierName: 'Claro Perú', lineType: 'MOBILE', ocn: 'OSI-CLR' },
        { ndc: '999-42', fullPrefix: '5199942', carrierGroup: 'Movistar', carrierName: 'Telefónica del Perú', lineType: 'MOBILE', ocn: 'OSI-MOV' },
      ]},
    ],
  },
  {
    iso2: 'VE', iso3: 'VEN', continentCode: 'SA', name: 'Venezuela', callingCode: '58', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'CONATEL Venezuela', currencySymbol: 'US$', basePropertyValue: 125000,
    streetTemplates: ['Av. Francisco de Miranda', 'Av. Libertador Chacao', 'Calle Madrid Las Mercedes'],
    employers: ['Empresas Polar', 'Banesco', 'Telefónica Movistar Venezuela', 'Mercantil Servicios'],
    universities: ['Universidad Central de Venezuela (UCV)', 'Universidad Simón Bolívar'],
    hubs: [
      { regionCode: 'A', regionName: 'Capital District', timezone: 'America/Caracas', city: 'Caracas', postalCode: '1060', lat: 10.4806, lon: -66.9036, prefixes: [
        { ndc: '414-230', fullPrefix: '58414230', carrierGroup: 'Movistar', carrierName: 'Telcel Movistar Venezuela', lineType: 'MOBILE', ocn: 'CON-MOV' },
        { ndc: '412-310', fullPrefix: '58412310', carrierGroup: 'Digitel', carrierName: 'Corporación Digitel', lineType: 'MOBILE', ocn: 'CON-DIG' },
      ]},
    ],
  },
  {
    iso2: 'EC', iso3: 'ECU', continentCode: 'SA', name: 'Ecuador', callingCode: '593', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ARCOTEL Ecuador', currencySymbol: '$', basePropertyValue: 185000,
    streetTemplates: ['Av. Amazonas', 'Av. República del Salvador', 'Malecón Simón Bolívar'],
    employers: ['Banco Pichincha', 'Corporación Favorita', 'CONECEL Claro Ecuador'],
    universities: ['Universidad San Francisco de Quito', 'ESPOL Guayaquil'],
    hubs: [
      { regionCode: 'P', regionName: 'Pichincha', timezone: 'America/Guayaquil', city: 'Quito', postalCode: '170515', lat: -0.1807, lon: -78.4678, prefixes: [
        { ndc: '99-310', fullPrefix: '59399310', carrierGroup: 'Claro', carrierName: 'Claro Ecuador (Conecel)', lineType: 'MOBILE', ocn: 'ARC-CLR' },
      ]},
    ],
  },
  {
    iso2: 'UY', iso3: 'URY', continentCode: 'SA', name: 'Uruguay', callingCode: '598', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'URSEC Uruguay', currencySymbol: 'US$', basePropertyValue: 265000,
    streetTemplates: ['Av. 18 de Julio', 'Rambla República del Perú', 'Bulevar Artigas'],
    employers: ['dLocal', 'Globant Montevideo', 'ANTEL Uruguay', 'Banco Itaú Uruguay'],
    universities: ['Universidad de la República (Udelar)', 'Universidad ORT Uruguay'],
    hubs: [
      { regionCode: 'MO', regionName: 'Montevideo', timezone: 'America/Montevideo', city: 'Montevideo', postalCode: '11300', lat: -34.9011, lon: -56.1645, prefixes: [
        { ndc: '9912', fullPrefix: '5989912', carrierGroup: 'Antel', carrierName: 'ANTEL Móvil Uruguay', lineType: 'MOBILE', ocn: 'URS-ANT' },
      ]},
    ],
  },
  {
    iso2: 'PY', iso3: 'PRY', continentCode: 'SA', name: 'Paraguay', callingCode: '595', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'CONATEL Paraguay', currencySymbol: 'US$', basePropertyValue: 155000,
    streetTemplates: ['Av. Aviadores del Chaco', 'Av. Mariscal López', 'Calle Palma'],
    employers: ['Itaú Paraguay', 'Tigo Paraguay (Telecel)', 'Banco Continental'],
    universities: ['Universidad Nacional de Asunción'],
    hubs: [
      { regionCode: 'ASU', regionName: 'Asunción', timezone: 'America/Asuncion', city: 'Asunción', postalCode: '1209', lat: -25.2637, lon: -57.5759, prefixes: [
        { ndc: '981-31', fullPrefix: '59598131', carrierGroup: 'Tigo', carrierName: 'Tigo Paraguay', lineType: 'MOBILE', ocn: 'PY-TIG' },
      ]},
    ],
  },
  {
    iso2: 'BO', iso3: 'BOL', continentCode: 'SA', name: 'Bolivia', callingCode: '591', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'ATT Bolivia', currencySymbol: 'US$', basePropertyValue: 135000,
    streetTemplates: ['Av. Arce', 'El Prado Av. 16 de Julio', 'Av. San Martín Equipetrol'],
    employers: ['ENTEL Bolivia', 'Banco Mercantil Santa Cruz', 'Tigo Bolivia'],
    universities: ['Universidad Mayor de San Andrés (UMSA)'],
    hubs: [
      { regionCode: 'L', regionName: 'La Paz', timezone: 'America/La_Paz', city: 'La Paz', postalCode: '0201', lat: -16.4897, lon: -68.1193, prefixes: [
        { ndc: '7012', fullPrefix: '5917012', carrierGroup: 'Entel', carrierName: 'ENTEL Móvil Bolivia', lineType: 'MOBILE', ocn: 'BO-ENT' },
      ]},
    ],
  },

  // ================= AFRICA (10 COUNTRIES) =================
  {
    iso2: 'NG', iso3: 'NGA', continentCode: 'AF', name: 'Nigeria', callingCode: '234', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'NCC Nigeria', currencySymbol: '₦', basePropertyValue: 145000000,
    streetTemplates: ['Admiralty Way Lekki', 'Adeola Odeku St Victoria Island', 'Awolowo Rd Ikoyi', 'Allen Ave Ikeja'],
    employers: ['MTN Nigeria Plc', 'Access Bank Plc', 'Zenith Bank', 'Dangote Industries', 'Flutterwave', 'Guaranty Trust Co (GTCO)'],
    universities: ['University of Lagos (UNILAG)', 'University of Ibadan', 'Covenant University', 'Obafemi Awolowo University'],
    firstNames: ['Chinedu', 'Oluwaseun', 'Adebayo', 'Emeka', 'Tunde', 'Ibrahim', 'Ngozi', 'Chioma', 'Zainab', 'Funke', 'Amaka', 'Temitope'],
    lastNames: ['Okafor', 'Adeyemi', 'Balogun', 'Eze', 'Nwosu', 'Ibrahim', 'Ogunleye', 'Okeke', 'Abubakar', 'Lawal'],
    hubs: [
      { regionCode: 'LA', regionName: 'Lagos State', timezone: 'Africa/Lagos', city: 'Lagos', postalCode: '101241', lat: 6.4281, lon: 3.4219, prefixes: [
        { ndc: '803-310', fullPrefix: '234803310', carrierGroup: 'MTN', carrierName: 'MTN Nigeria Communications', lineType: 'MOBILE', ocn: 'NCC-62130' },
        { ndc: '802-310', fullPrefix: '234802310', carrierGroup: 'Airtel', carrierName: 'Airtel Networks Nigeria', lineType: 'MOBILE', ocn: 'NCC-62120' },
        { ndc: '805-420', fullPrefix: '234805420', carrierGroup: 'Glo', carrierName: 'Globacom Limited (Glo)', lineType: 'MOBILE', ocn: 'NCC-62150' },
      ]},
      { regionCode: 'FC', regionName: 'Abuja FCT', timezone: 'Africa/Lagos', city: 'Abuja', postalCode: '900211', lat: 9.0765, lon: 7.3986, prefixes: [
        { ndc: '806-210', fullPrefix: '234806210', carrierGroup: 'MTN', carrierName: 'MTN Abuja FCT', lineType: 'MOBILE', ocn: 'NCC-62130' },
      ]},
    ],
  },
  {
    iso2: 'ZA', iso3: 'ZAF', continentCode: 'AF', name: 'South Africa', callingCode: '27', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ICASA South Africa', currencySymbol: 'R ', basePropertyValue: 3450000,
    streetTemplates: ['Rivonia Rd Sandton', 'Long St Cape Town', 'Jan Smuts Ave Rosebank', 'Victoria Rd Camps Bay'],
    employers: ['Standard Bank Group', 'FirstRand / FNB', 'Vodacom Group', 'MTN Group', 'Naspers / Prosus', 'Discovery Limited'],
    universities: ['University of Cape Town (UCT)', 'University of the Witwatersrand (Wits)', 'Stellenbosch University'],
    firstNames: ['Thabo', 'Sipho', 'Johan', 'Pieter', 'Liam', 'Kabelo', 'Zanele', 'Nomsa', 'Annelie', 'Chloe', 'Lerato'],
    lastNames: ['Nkosi', 'Dlamini', 'Van der Merwe', 'Botha', 'Ndlovu', 'Khumalo', 'Smit', 'Naidoo', 'Pillay', 'Mokoena'],
    hubs: [
      { regionCode: 'GP', regionName: 'Gauteng', timezone: 'Africa/Johannesburg', city: 'Johannesburg', postalCode: '2000', lat: -26.2041, lon: 28.0473, prefixes: [
        { ndc: '82-450', fullPrefix: '2782450', carrierGroup: 'Vodafone', carrierName: 'Vodacom South Africa', lineType: 'MOBILE', ocn: 'ICASA-65501' },
        { ndc: '83-310', fullPrefix: '2783310', carrierGroup: 'MTN', carrierName: 'MTN South Africa', lineType: 'MOBILE', ocn: 'ICASA-65510' },
      ]},
      { regionCode: 'WC', regionName: 'Western Cape', timezone: 'Africa/Johannesburg', city: 'Cape Town', postalCode: '8001', lat: -33.9249, lon: 18.4241, prefixes: [
        { ndc: '21-461', fullPrefix: '2721461', carrierGroup: 'Telkom SA', carrierName: 'Telkom SA SOC Ltd', lineType: 'LANDLINE', ocn: 'ICASA-021' },
      ]},
    ],
  },
  {
    iso2: 'KE', iso3: 'KEN', continentCode: 'AF', name: 'Kenya', callingCode: '254', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'CA Kenya', currencySymbol: 'KSh ', basePropertyValue: 26500000,
    streetTemplates: ['Waiyaki Way Westlands', 'Kenyatta Ave', 'Ngong Rd Kilimani', 'Mama Ngina St'],
    employers: ['Safaricom PLC', 'Equity Group Holdings', 'KCB Bank Kenya', 'East African Breweries'],
    universities: ['University of Nairobi', 'Strathmore University', 'Kenyatta University'],
    firstNames: ['Kamau', 'Otieno', 'Mwangi', 'Kipchoge', 'Brian', 'Kevin', 'Wanjiku', 'Achieng', 'Njeri', 'Faith', 'Mercy'],
    lastNames: ['Ochieng', 'Maina', 'Njoroge', 'Kariuki', 'Onyango', 'Mutua', 'Wambua', 'Koech', 'Kimani'],
    hubs: [
      { regionCode: '30', regionName: 'Nairobi County', timezone: 'Africa/Nairobi', city: 'Nairobi', postalCode: '00100', lat: -1.2864, lon: 36.8172, prefixes: [
        { ndc: '722-31', fullPrefix: '25472231', carrierGroup: 'Safaricom', carrierName: 'Safaricom PLC Kenya', lineType: 'MOBILE', ocn: 'CA-63902' },
        { ndc: '733-41', fullPrefix: '25473341', carrierGroup: 'Airtel', carrierName: 'Airtel Networks Kenya', lineType: 'MOBILE', ocn: 'CA-63903' },
      ]},
    ],
  },
  {
    iso2: 'EG', iso3: 'EGY', continentCode: 'AF', name: 'Egypt', callingCode: '20', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'NTRA Egypt', currencySymbol: 'EGP ', basePropertyValue: 7800000,
    streetTemplates: ['26th of July St Zamalek', 'Tahrir St Dokki', 'Road 9 Maadi', '90th St New Cairo'],
    employers: ['Commercial International Bank (CIB)', 'Vodafone Egypt', 'Orascom Construction', 'Telecom Egypt WE'],
    universities: ['The American University in Cairo (AUC)', 'Cairo University', 'Ain Shams University'],
    firstNames: ['Ahmed', 'Mohamed', 'Mahmoud', 'Youssef', 'Mostafa', 'Omar', 'Nour', 'Salma', 'Habiba', 'Farida', 'Malak'],
    lastNames: ['El-Sayed', 'Hassan', 'Ibrahim', 'Ali', 'Mansour', 'Soliman', 'Farouk', 'Nabil', 'Kamel'],
    hubs: [
      { regionCode: 'C', regionName: 'Cairo Governorate', timezone: 'Africa/Cairo', city: 'Cairo', postalCode: '11511', lat: 30.0444, lon: 31.2357, prefixes: [
        { ndc: '100-310', fullPrefix: '20100310', carrierGroup: 'Vodafone', carrierName: 'Vodafone Egypt', lineType: 'MOBILE', ocn: 'NTRA-60202' },
        { ndc: '122-410', fullPrefix: '20122410', carrierGroup: 'Orange', carrierName: 'Orange Egypt', lineType: 'MOBILE', ocn: 'NTRA-60201' },
      ]},
    ],
  },
  {
    iso2: 'GH', iso3: 'GHA', continentCode: 'AF', name: 'Ghana', callingCode: '233', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'NCA Ghana', currencySymbol: 'GH₵ ', basePropertyValue: 2200000,
    streetTemplates: ['Independence Ave', 'Oxford St Osu', 'Liberation Rd Airport City', 'Spintex Rd'],
    employers: ['MTN Ghana (Scancom)', 'Ecobank Ghana', 'GCB Bank PLC', 'Telecel Ghana'],
    universities: ['University of Ghana (Legon)', 'KNUST Kumasi', 'Ashesi University'],
    firstNames: ['Kwame', 'Kofi', 'Yaw', 'Kojo', 'Nana', 'Ama', 'Akosua', 'Abena', 'Yaa', 'Efua'],
    lastNames: ['Mensah', 'Osei', 'Boateng', 'Owusu', 'Appiah', 'Asante', 'Agyemang', 'Amoah'],
    hubs: [
      { regionCode: 'AA', regionName: 'Greater Accra', timezone: 'Africa/Accra', city: 'Accra', postalCode: 'GA-100', lat: 5.6037, lon: -0.187, prefixes: [
        { ndc: '24-431', fullPrefix: '23324431', carrierGroup: 'MTN', carrierName: 'MTN Ghana', lineType: 'MOBILE', ocn: 'NCA-62001' },
        { ndc: '20-310', fullPrefix: '23320310', carrierGroup: 'Telecel', carrierName: 'Telecel Ghana (Vodafone)', lineType: 'MOBILE', ocn: 'NCA-62002' },
      ]},
    ],
  },
  {
    iso2: 'MA', iso3: 'MAR', continentCode: 'AF', name: 'Morocco', callingCode: '212', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ANRT Morocco', currencySymbol: 'MAD ', basePropertyValue: 2450000,
    streetTemplates: ['Boulevard d’Anfa', 'Boulevard Zerktouni', 'Avenue Mohammed V'],
    employers: ['Attijariwafa Bank', 'OCP Group', 'Maroc Telecom (IAM)', 'Royal Air Maroc'],
    universities: ['Mohammed VI Polytechnic University', 'Mohammed V University Rabat'],
    firstNames: ['Youssef', 'Amine', 'Mehdi', 'Hamza', 'Karim', 'Salma', 'Kenza', 'Sofia', 'Yasmine', ' Sara'],
    lastNames: ['Alaoui', 'Bennani', 'Tazi', 'Idrissi', 'Berrada', 'Chraibi', 'El Fassi'],
    hubs: [
      { regionCode: '06', regionName: 'Casablanca-Settat', timezone: 'Africa/Casablanca', city: 'Casablanca', postalCode: '20000', lat: 33.5731, lon: -7.5898, prefixes: [
        { ndc: '661-31', fullPrefix: '21266131', carrierGroup: 'Maroc Telecom', carrierName: 'Maroc Telecom (IAM)', lineType: 'MOBILE', ocn: 'ANRT-IAM' },
        { ndc: '663-42', fullPrefix: '21266342', carrierGroup: 'Orange', carrierName: 'Orange Maroc', lineType: 'MOBILE', ocn: 'ANRT-ORA' },
      ]},
    ],
  },
  {
    iso2: 'DZ', iso3: 'DZA', continentCode: 'AF', name: 'Algeria', callingCode: '213', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ARPCE Algeria', currencySymbol: 'DZD ', basePropertyValue: 34000000,
    streetTemplates: ['Rue Didouche Mourad', 'Boulevard Mohamed V', 'Hydra Chemin Mackley'],
    employers: ['Sonatrach', 'Djezzy Optimum Telecom', 'Mobilis Algeria', 'Cevital Group'],
    universities: ['University of Science and Technology Houari Boumediene', 'Algiers 1 University'],
    hubs: [
      { regionCode: '16', regionName: 'Algiers', timezone: 'Africa/Algiers', city: 'Algiers', postalCode: '16000', lat: 36.7538, lon: 3.0588, prefixes: [
        { ndc: '770-31', fullPrefix: '21377031', carrierGroup: 'Djezzy', carrierName: 'Djezzy Telecom Algeria', lineType: 'MOBILE', ocn: 'DZ-DJZ' },
      ]},
    ],
  },
  {
    iso2: 'TN', iso3: 'TUN', continentCode: 'AF', name: 'Tunisia', callingCode: '216', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'INTT Tunisia', currencySymbol: 'TND ', basePropertyValue: 580000,
    streetTemplates: ['Avenue Habib Bourguiba', 'Les Berges du Lac', 'Avenue de la Liberté'],
    employers: ['BIAT Bank', 'Tunisie Telecom', 'Ooredoo Tunisie', 'Poulina Group'],
    universities: ['University of Tunis El Manar', 'INSAT Tunis'],
    hubs: [
      { regionCode: '11', regionName: 'Tunis', timezone: 'Africa/Tunis', city: 'Tunis', postalCode: '1001', lat: 36.8065, lon: 10.1815, prefixes: [
        { ndc: '2212', fullPrefix: '2162212', carrierGroup: 'Ooredoo', carrierName: 'Ooredoo Tunisie', lineType: 'MOBILE', ocn: 'TN-OOR' },
      ]},
    ],
  },
  {
    iso2: 'ET', iso3: 'ETH', continentCode: 'AF', name: 'Ethiopia', callingCode: '251', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ECA Ethiopia', currencySymbol: 'ETB ', basePropertyValue: 18000000,
    streetTemplates: ['Bole Rd Africa Ave', 'Churchill Ave', 'Kazanchis Tito St'],
    employers: ['Ethiopian Airlines Group', 'Ethio Telecom', 'Commercial Bank of Ethiopia', 'Safaricom Ethiopia'],
    universities: ['Addis Ababa University'],
    firstNames: ['Abebe', 'Dawit', 'Yohannes', 'Tewodros', 'Henok', 'Selamawit', 'Meron', 'kalkidan', 'Tigist'],
    lastNames: ['Tadesse', 'Bekele', 'Haile', 'Kebede', 'Tesfaye', 'Girma', 'Alemu'],
    hubs: [
      { regionCode: 'AA', regionName: 'Addis Ababa', timezone: 'Africa/Addis_Ababa', city: 'Addis Ababa', postalCode: '1000', lat: 9.032, lon: 38.7469, prefixes: [
        { ndc: '911-31', fullPrefix: '25191131', carrierGroup: 'Ethio Telecom', carrierName: 'Ethio Telecom Mobile', lineType: 'MOBILE', ocn: 'ET-ETC' },
      ]},
    ],
  },
  {
    iso2: 'TZ', iso3: 'TZA', continentCode: 'AF', name: 'Tanzania', callingCode: '255', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'TCRA Tanzania', currencySymbol: 'TSh ', basePropertyValue: 380000000,
    streetTemplates: ['Samora Ave', 'Ali Hassan Mwinyi Rd', 'Haile Selassie Rd Masaki'],
    employers: ['Vodacom Tanzania', 'CRDB Bank Plc', 'NMB Bank', 'Tigo Tanzania'],
    universities: ['University of Dar es Salaam'],
    hubs: [
      { regionCode: '02', regionName: 'Dar es Salaam', timezone: 'Africa/Dar_es_Salaam', city: 'Dar es Salaam', postalCode: '11101', lat: -6.7924, lon: 39.2083, prefixes: [
        { ndc: '754-31', fullPrefix: '25575431', carrierGroup: 'Vodafone', carrierName: 'Vodacom Tanzania PLC', lineType: 'MOBILE', ocn: 'TZ-VOD' },
      ]},
    ],
  },

  // ================= OCEANIA (3 COUNTRIES) =================
  {
    iso2: 'AU', iso3: 'AUS', continentCode: 'OC', name: 'Australia', callingCode: '61', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ACMA Australia', currencySymbol: 'A$', basePropertyValue: 1080000,
    streetTemplates: ['George St', 'Collins St', 'Pitt St', 'Queen St', 'St Kilda Rd', 'Macquarie St'],
    employers: ['Commonwealth Bank (CBA)', 'Macquarie Group', 'BHP Group', 'Telstra Group Ltd', 'Atlassian', 'Woolworths Group'],
    universities: ['University of Sydney', 'University of Melbourne', 'UNSW Sydney', 'University of Queensland'],
    hubs: [
      { regionCode: 'NSW', regionName: 'New South Wales', timezone: 'Australia/Sydney', city: 'Sydney', postalCode: '2000', lat: -33.8688, lon: 151.2093, prefixes: [
        { ndc: '418-24', fullPrefix: '6141824', carrierGroup: 'Telstra', carrierName: 'Telstra Limited Australia', lineType: 'MOBILE', ocn: 'ACMA-50501' },
        { ndc: '412-31', fullPrefix: '6141231', carrierGroup: 'Optus', carrierName: 'Singtel Optus Pty Ltd', lineType: 'MOBILE', ocn: 'ACMA-50502' },
      ]},
      { regionCode: 'VIC', regionName: 'Victoria', timezone: 'Australia/Melbourne', city: 'Melbourne', postalCode: '3000', lat: -37.8136, lon: 144.9631, prefixes: [
        { ndc: '3-9650', fullPrefix: '6139650', carrierGroup: 'Optus', carrierName: 'Optus Victoria Fixed', lineType: 'LANDLINE', ocn: 'ACMA-50502' },
        { ndc: '409-41', fullPrefix: '6140941', carrierGroup: 'Telstra', carrierName: 'Telstra Mobile VIC', lineType: 'MOBILE', ocn: 'ACMA-50501' },
      ]},
      { regionCode: 'QLD', regionName: 'Queensland', timezone: 'Australia/Brisbane', city: 'Brisbane', postalCode: '4000', lat: -27.4705, lon: 153.026, prefixes: [
        { ndc: '411-52', fullPrefix: '6141152', carrierGroup: 'Optus', carrierName: 'Optus Mobile QLD', lineType: 'MOBILE', ocn: 'ACMA-50502' },
      ]},
    ],
  },
  {
    iso2: 'NZ', iso3: 'NZL', continentCode: 'OC', name: 'New Zealand', callingCode: '64', nsnMinLength: 8, nsnMaxLength: 9,
    regulatoryAuthority: 'NAD New Zealand', currencySymbol: 'NZ$', basePropertyValue: 965000,
    streetTemplates: ['Queen St', 'Lambton Quay', 'Ponsonby Rd', 'Symonds St'],
    employers: ['Spark New Zealand', 'Air New Zealand', 'Fonterra Co-operative', 'Xero Limited', 'ANZ Bank NZ'],
    universities: ['University of Auckland', 'University of Otago', 'Victoria University of Wellington'],
    hubs: [
      { regionCode: 'AUK', regionName: 'Auckland Region', timezone: 'Pacific/Auckland', city: 'Auckland', postalCode: '1010', lat: -36.8485, lon: 174.7633, prefixes: [
        { ndc: '21-450', fullPrefix: '6421450', carrierGroup: 'One NZ', carrierName: 'One New Zealand (Vodafone)', lineType: 'MOBILE', ocn: 'NAD-53001' },
        { ndc: '27-310', fullPrefix: '6427310', carrierGroup: 'Spark', carrierName: 'Spark New Zealand Trading', lineType: 'MOBILE', ocn: 'NAD-53005' },
      ]},
    ],
  },
  {
    iso2: 'FJ', iso3: 'FJI', continentCode: 'OC', name: 'Fiji', callingCode: '679', nsnMinLength: 7, nsnMaxLength: 7,
    regulatoryAuthority: 'TAF Fiji', currencySymbol: 'FJ$', basePropertyValue: 540000,
    streetTemplates: ['Victoria Parade', 'Thomson St', 'Queens Rd Nadi'],
    employers: ['Fiji Airways', 'Vodafone Fiji Pte Ltd', 'BSP Financial Fiji'],
    universities: ['University of the South Pacific (USP)'],
    hubs: [
      { regionCode: 'C', regionName: 'Central Division', timezone: 'Pacific/Fiji', city: 'Suva', postalCode: 'SUV01', lat: -18.1416, lon: 178.4419, prefixes: [
        { ndc: '992', fullPrefix: '679992', carrierGroup: 'Vodafone', carrierName: 'Vodafone Fiji', lineType: 'MOBILE', ocn: 'FJ-VOD' },
      ]},
    ],
  },
];

// Expand missing countries up to 80 global nations cleanly with additional real European/Asian/African/LATAM nations!
const EXTRA_WORLDWIDE_COUNTRIES: WorldwideCountrySeed[] = [
  {
    iso2: 'BG', iso3: 'BGR', continentCode: 'EU', name: 'Bulgaria', callingCode: '359', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'CRC Bulgaria', currencySymbol: '€', basePropertyValue: 210000,
    streetTemplates: ['Vitosha Blvd', 'Tsarigradsko Shose', 'Rakovski St'],
    employers: ['UniCredit Bulbank', 'A1 Bulgaria', 'Vivacom EAD'],
    universities: ['Sofia University St. Kliment Ohridski'],
    hubs: [{ regionCode: '22', regionName: 'Sofia Capital', timezone: 'Europe/Sofia', city: 'Sofia', postalCode: '1000', lat: 42.6977, lon: 23.3219, prefixes: [
      { ndc: '88-721', fullPrefix: '35988721', carrierGroup: 'A1 Telekom', carrierName: 'A1 Bulgaria EAD', lineType: 'MOBILE', ocn: 'BG-A1' },
    ]}],
  },
  {
    iso2: 'SK', iso3: 'SVK', continentCode: 'EU', name: 'Slovakia', callingCode: '421', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'RU Slovakia', currencySymbol: '€', basePropertyValue: 295000,
    streetTemplates: ['Obchodná', 'Štefánikova', 'Pribinova Eurovea'],
    employers: ['Slovenská sporiteľňa', 'ESET spol. s r.o.', 'Slovak Telekom'],
    universities: ['Comenius University Bratislava'],
    hubs: [{ regionCode: 'BL', regionName: 'Bratislava', timezone: 'Europe/Bratislava', city: 'Bratislava', postalCode: '811 01', lat: 48.1486, lon: 17.1077, prefixes: [
      { ndc: '905-31', fullPrefix: '42190531', carrierGroup: 'Orange', carrierName: 'Orange Slovensko', lineType: 'MOBILE', ocn: 'SK-ORA' },
    ]}],
  },
  {
    iso2: 'SI', iso3: 'SVN', continentCode: 'EU', name: 'Slovenia', callingCode: '386', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'AKOS Slovenia', currencySymbol: '€', basePropertyValue: 340000,
    streetTemplates: ['Slovenska cesta', 'Čopova ulica', 'Dunajska cesta'],
    employers: ['Krka d.d.', 'NLB Group', 'Telekom Slovenije'],
    universities: ['University of Ljubljana'],
    hubs: [{ regionCode: 'LJ', regionName: 'Ljubljana', timezone: 'Europe/Ljubljana', city: 'Ljubljana', postalCode: '1000', lat: 46.0569, lon: 14.5058, prefixes: [
      { ndc: '41-31', fullPrefix: '3864131', carrierGroup: 'Telekom Slovenije', carrierName: 'Telekom Slovenije d.d.', lineType: 'MOBILE', ocn: 'SI-TS' },
    ]}],
  },
  {
    iso2: 'EE', iso3: 'EST', continentCode: 'EU', name: 'Estonia', callingCode: '372', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'TTJA Estonia', currencySymbol: '€', basePropertyValue: 290000,
    streetTemplates: ['Narva mnt', 'Viru väljak', 'Tartu mnt'],
    employers: ['Wise (TransferWise)', 'Bolt Technology', 'Telia Eesti', 'LHV Pank'],
    universities: ['University of Tartu', 'Tallinn University of Technology (TalTech)'],
    hubs: [{ regionCode: '37', regionName: 'Harju County', timezone: 'Europe/Tallinn', city: 'Tallinn', postalCode: '10111', lat: 59.437, lon: 24.7536, prefixes: [
      { ndc: '5012', fullPrefix: '3725012', carrierGroup: 'Telia', carrierName: 'Telia Eesti AS', lineType: 'MOBILE', ocn: 'EE-TLA' },
    ]}],
  },
  {
    iso2: 'LV', iso3: 'LVA', continentCode: 'EU', name: 'Latvia', callingCode: '371', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'SPRK Latvia', currencySymbol: '€', basePropertyValue: 230000,
    streetTemplates: ['Brīvības iela', 'Elizabetes iela', 'Krišjāņa Barona iela'],
    employers: ['LMT Latvia', 'airBaltic', 'Swedbank Latvia'],
    universities: ['University of Latvia', 'Riga Technical University'],
    hubs: [{ regionCode: 'RIX', regionName: 'Riga', timezone: 'Europe/Riga', city: 'Riga', postalCode: 'LV-1050', lat: 56.9496, lon: 24.1052, prefixes: [
      { ndc: '2912', fullPrefix: '3712912', carrierGroup: 'LMT', carrierName: 'Latvijas Mobilais Telefons', lineType: 'MOBILE', ocn: 'LV-LMT' },
    ]}],
  },
  {
    iso2: 'LT', iso3: 'LTU', continentCode: 'EU', name: 'Lithuania', callingCode: '370', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'RRT Lithuania', currencySymbol: '€', basePropertyValue: 265000,
    streetTemplates: ['Gedimino pr.', 'Konstitucijos pr.', 'Vokiečių g.'],
    employers: ['Vinted UAB', 'Telia Lietuva', 'Ignitis Group', 'SEB Bankas'],
    universities: ['Vilnius University', 'Kaunas University of Technology'],
    hubs: [{ regionCode: 'VL', regionName: 'Vilnius', timezone: 'Europe/Vilnius', city: 'Vilnius', postalCode: '01103', lat: 54.6872, lon: 25.2797, prefixes: [
      { ndc: '6123', fullPrefix: '3706123', carrierGroup: 'Telia', carrierName: 'Telia Lietuva', lineType: 'MOBILE', ocn: 'LT-TLA' },
    ]}],
  },
  {
    iso2: 'RS', iso3: 'SRB', continentCode: 'EU', name: 'Serbia', callingCode: '381', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'RATEL Serbia', currencySymbol: '€', basePropertyValue: 215000,
    streetTemplates: ['Knez Mihailova', 'Bulevar Kralja Aleksandra', 'Bulevar Mihajla Pupina'],
    employers: ['Telekom Srbija (mts)', 'Nordeus', 'Banca Intesa Beograd'],
    universities: ['University of Belgrade'],
    hubs: [{ regionCode: '00', regionName: 'Belgrade', timezone: 'Europe/Belgrade', city: 'Belgrade', postalCode: '11000', lat: 44.7866, lon: 20.4489, prefixes: [
      { ndc: '64-310', fullPrefix: '38164310', carrierGroup: 'mts', carrierName: 'Telekom Srbija mts', lineType: 'MOBILE', ocn: 'RS-MTS' },
    ]}],
  },
  {
    iso2: 'OM', iso3: 'OMN', continentCode: 'AS', name: 'Oman', callingCode: '968', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'TRA Oman', currencySymbol: 'OMR ', basePropertyValue: 135000,
    streetTemplates: ['Sultan Qaboos St', 'Al Mouj Blvd', 'Shatti Al Qurum'],
    employers: ['Omantel', 'Bank Muscat', 'OQ Group'],
    universities: ['Sultan Qaboos University'],
    hubs: [{ regionCode: 'MA', regionName: 'Muscat', timezone: 'Asia/Muscat', city: 'Muscat', postalCode: '100', lat: 23.588, lon: 58.3829, prefixes: [
      { ndc: '9912', fullPrefix: '9689912', carrierGroup: 'Omantel', carrierName: 'Oman Telecommunications (Omantel)', lineType: 'MOBILE', ocn: 'OM-OTL' },
    ]}],
  },
  {
    iso2: 'BH', iso3: 'BHR', continentCode: 'AS', name: 'Bahrain', callingCode: '973', nsnMinLength: 8, nsnMaxLength: 8,
    regulatoryAuthority: 'TRA Bahrain', currencySymbol: 'BHD ', basePropertyValue: 145000,
    streetTemplates: ['King Faisal Hwy', 'Seef District Ave', 'Diplomatic Area'],
    employers: ['Batelco (Beyon)', 'National Bank of Bahrain', 'Aluminium Bahrain (Alba)'],
    universities: ['University of Bahrain'],
    hubs: [{ regionCode: '13', regionName: 'Capital Governorate', timezone: 'Asia/Bahrain', city: 'Manama', postalCode: '317', lat: 26.2285, lon: 50.586, prefixes: [
      { ndc: '3912', fullPrefix: '9733912', carrierGroup: 'Batelco', carrierName: 'Batelco Mobile Bahrain', lineType: 'MOBILE', ocn: 'BH-BAT' },
    ]}],
  },
  {
    iso2: 'NP', iso3: 'NPL', continentCode: 'AS', name: 'Nepal', callingCode: '977', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'NTA Nepal', currencySymbol: 'NPR ', basePropertyValue: 28000000,
    streetTemplates: ['Durbar Marg', 'Lazimpat Rd', 'New Baneshwor'],
    employers: ['Nepal Telecom', 'Ncell Axiata', 'Nabil Bank'],
    universities: ['Tribhuvan University', 'Kathmandu University'],
    hubs: [{ regionCode: 'BA', regionName: 'Bagmati', timezone: 'Asia/Kathmandu', city: 'Kathmandu', postalCode: '44600', lat: 27.7172, lon: 85.324, prefixes: [
      { ndc: '985-102', fullPrefix: '977985102', carrierGroup: 'Nepal Telecom', carrierName: 'Nepal Doorsanchar (NTC)', lineType: 'MOBILE', ocn: 'NP-NTC' },
    ]}],
  },
  {
    iso2: 'UG', iso3: 'UGA', continentCode: 'AF', name: 'Uganda', callingCode: '256', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'UCC Uganda', currencySymbol: 'UGX ', basePropertyValue: 480000000,
    streetTemplates: ['Kampala Rd', 'Nakasero Hill Rd', 'Acacia Ave Kololo'],
    employers: ['MTN Uganda', 'Stanbic Bank Uganda', 'Airtel Uganda'],
    universities: ['Makerere University'],
    hubs: [{ regionCode: 'KMP', regionName: 'Kampala', timezone: 'Africa/Kampala', city: 'Kampala', postalCode: '25601', lat: 0.3476, lon: 32.5825, prefixes: [
      { ndc: '772-31', fullPrefix: '25677231', carrierGroup: 'MTN', carrierName: 'MTN Uganda Ltd', lineType: 'MOBILE', ocn: 'UG-MTN' },
    ]}],
  },
  {
    iso2: 'SN', iso3: 'SEN', continentCode: 'AF', name: 'Senegal', callingCode: '221', nsnMinLength: 9, nsnMaxLength: 9,
    regulatoryAuthority: 'ARTP Senegal', currencySymbol: 'CFA ', basePropertyValue: 135000000,
    streetTemplates: ['Avenue Léopold Sédar Senghor', 'Corniche Ouest Almadies', 'Rue Carnot'],
    employers: ['Sonatel (Orange Sénégal)', 'CBAO Groupe Attijariwafa', 'Wave Mobile Money'],
    universities: ['Université Cheikh Anta Diop (UCAD)'],
    firstNames: ['Mamadou', 'Moussa', 'Ibrahima', 'Cheikh', 'Ousmane', 'Fatou', 'Aminata', 'Awa', 'Mariama'],
    lastNames: ['Ndiaye', 'Diop', 'Fall', 'Sow', 'Ba', 'Gueye', 'Sy', 'Cissé'],
    hubs: [{ regionCode: 'DK', regionName: 'Dakar', timezone: 'Africa/Dakar', city: 'Dakar', postalCode: '10000', lat: 14.7167, lon: -17.4677, prefixes: [
      { ndc: '77-310', fullPrefix: '22177310', carrierGroup: 'Orange', carrierName: 'Sonatel Orange Sénégal', lineType: 'MOBILE', ocn: 'SN-ORA' },
    ]}],
  },
  {
    iso2: 'CI', iso3: 'CIV', continentCode: 'AF', name: 'Côte d’Ivoire', callingCode: '225', nsnMinLength: 10, nsnMaxLength: 10,
    regulatoryAuthority: 'ARTCI Côte d’Ivoire', currencySymbol: 'CFA ', basePropertyValue: 145000000,
    streetTemplates: ['Boulevard de la République Plateau', 'Rue des Jardins Cocody', 'Boulevard Valéry Giscard d’Estaing'],
    employers: ['Orange Côte d’Ivoire', 'MTN Côte d’Ivoire', 'Société Générale CI'],
    universities: ['Université Félix Houphouët-Boigny'],
    hubs: [{ regionCode: 'AB', regionName: 'Abidjan', timezone: 'Africa/Abidjan', city: 'Abidjan', postalCode: '01 BP', lat: 5.36, lon: -4.0083, prefixes: [
      { ndc: '0707-31', fullPrefix: '225070731', carrierGroup: 'Orange', carrierName: 'Orange Côte d’Ivoire', lineType: 'MOBILE', ocn: 'CI-ORA' },
    ]}],
  },
];

export const ALL_INTERNATIONAL_SEEDS: WorldwideCountrySeed[] = [
  ...WORLDWIDE_COUNTRIES_SEED,
  ...EXTRA_WORLDWIDE_COUNTRIES,
];

export const INTERNATIONAL_META_BY_ISO2 = new Map<string, WorldwideCountrySeed>(
  ALL_INTERNATIONAL_SEEDS.map((s) => [s.iso2, s])
);

/**
 * Builds expanded 10K carrier prefix blocks across all 79 international countries
 * (~6,500+ international 10K blocks = 65,000,000+ international numbers).
 */
export function buildWorldwideCatalog(): {
  intlCountries: CountryRecord[];
  intlRegions: RegionRecord[];
  intlZipCodes: ZipCodeRecord[];
  intlPrefixAllocations: PrefixCarrierAllocation[];
} {
  const intlCountries: CountryRecord[] = [];
  const intlRegions: RegionRecord[] = [];
  const intlZipCodes: ZipCodeRecord[] = [];
  const intlPrefixAllocations: PrefixCarrierAllocation[] = [];
  const seenPrefixes = new Set<string>();

  for (const seed of ALL_INTERNATIONAL_SEEDS) {
    intlCountries.push({
      iso2: seed.iso2,
      iso3: seed.iso3,
      continentCode: seed.continentCode,
      name: seed.name,
      callingCode: seed.callingCode,
      nsnMinLength: seed.nsnMinLength,
      nsnMaxLength: seed.nsnMaxLength,
      regulatoryAuthority: seed.regulatoryAuthority,
    });

    for (const hub of seed.hubs) {
      const regionId = `${seed.iso2}-${hub.regionCode}`;
      if (!intlRegions.some((r) => r.id === regionId)) {
        intlRegions.push({
          id: regionId,
          countryIso2: seed.iso2,
          code: hub.regionCode,
          name: hub.regionName,
          timezone: hub.timezone,
        });
      }

      const cleanPostalId = hub.postalCode.replace(/[^A-Za-z0-9]/g, '');
      const zipId = `${seed.iso2}-${cleanPostalId}`;
      if (!intlZipCodes.some((z) => z.id === zipId)) {
        intlZipCodes.push({
          id: zipId,
          countryIso2: seed.iso2,
          regionId,
          postalCode: hub.postalCode,
          city: hub.city,
          latitude: hub.lat,
          longitude: hub.lon,
        });
      }

      for (const pfx of hub.prefixes) {
        // Expand each international carrier range into up to 45 valid adjacent 10,000-line exchange sub-blocks
        const nsnPart = pfx.fullPrefix.slice(seed.callingCode.length);
        const tailLen = Math.min(2, Math.max(1, nsnPart.length - 1));
        const headStr = pfx.fullPrefix.slice(0, pfx.fullPrefix.length - tailLen);
        const baseTailNum = parseInt(pfx.fullPrefix.slice(-tailLen), 10);
        const maxVal = tailLen === 2 ? 98 : 9;
        const maxSubBlocks = tailLen === 2 ? 45 : 8;

        for (let d = 0; d < maxSubBlocks; d++) {
          const candidateTail = baseTailNum + d;
          if (candidateTail > maxVal) break;
          const tailFormatted = String(candidateTail).padStart(tailLen, '0');
          const derivedFull = `${headStr}${tailFormatted}`;
          if (seenPrefixes.has(derivedFull)) continue;
          seenPrefixes.add(derivedFull);

          intlPrefixAllocations.push({
            id: d === 0 ? `PFX-${seed.iso2}-${nsnPart}` : `PFX-${seed.iso2}-${nsnPart}-${d}`,
            fullPrefix: derivedFull,
            countryIso2: seed.iso2,
            callingCode: seed.callingCode,
            ndcPrefix: pfx.ndc,
            carrierName: pfx.carrierName,
            carrierGroup: pfx.carrierGroup,
            ocnCode: pfx.ocn,
            lineType: pfx.lineType,
            regionId,
            zipId,
            allocationSource: `${seed.regulatoryAuthority} E.164 Numbering Plan`,
          });
        }
      }
    }
  }

  return {
    intlCountries,
    intlRegions,
    intlZipCodes,
    intlPrefixAllocations,
  };
}
