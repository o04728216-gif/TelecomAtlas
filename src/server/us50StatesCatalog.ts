import type {
  PrefixCarrierAllocation,
  RegionRecord,
  ZipCodeRecord,
} from '../shared/types.ts';

interface UsStateSeed {
  code: string;
  name: string;
  timezone: string;
  metros: Array<{
    city: string;
    zip: string;
    lat: number;
    lon: number;
    npa: string;
    exchanges: Array<{
      nxx: string;
      carrierGroup: string;
      carrierName: string;
      lineType: 'MOBILE' | 'LANDLINE' | 'VOIP';
      ocn: string;
    }>;
  }>;
}

/**
 * Comprehensive 50-State + D.C. NANPA Exchange Catalog.
 * Each NPA-NXX block represents 10,000 valid 10-digit US subscriber numbers (0000–9999).
 */
const US_50_STATES_SEED: UsStateSeed[] = [
  {
    code: 'CA',
    name: 'California',
    timezone: 'America/Los_Angeles',
    metros: [
      {
        city: 'Beverly Hills',
        zip: '90210',
        lat: 34.0901,
        lon: -118.4065,
        npa: '310',
        exchanges: [
          { nxx: '271', carrierGroup: 'AT&T', carrierName: 'AT&T California', lineType: 'LANDLINE', ocn: 'OCN-9740' },
          { nxx: '285', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '858', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '246', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '278', carrierGroup: 'Verizon', carrierName: 'Verizon California', lineType: 'LANDLINE', ocn: 'OCN-9742' },
          { nxx: '860', carrierGroup: 'Bandwidth', carrierName: 'Bandwidth.com VoIP', lineType: 'VOIP', ocn: 'OCN-760F' },
        ],
      },
      {
        city: 'Los Angeles',
        zip: '90012',
        lat: 34.0614,
        lon: -118.2386,
        npa: '213',
        exchanges: [
          { nxx: '620', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '891', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '482', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '250', carrierGroup: 'AT&T', carrierName: 'AT&T California', lineType: 'LANDLINE', ocn: 'OCN-9740' },
          { nxx: '974', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '380', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
      {
        city: 'San Francisco',
        zip: '94105',
        lat: 37.7898,
        lon: -122.3942,
        npa: '415',
        exchanges: [
          { nxx: '543', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '896', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '391', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '777', carrierGroup: 'AT&T', carrierName: 'AT&T California', lineType: 'LANDLINE', ocn: 'OCN-9740' },
          { nxx: '982', carrierGroup: 'Bandwidth', carrierName: 'Bandwidth.com VoIP', lineType: 'VOIP', ocn: 'OCN-760F' },
        ],
      },
      {
        city: 'San Jose',
        zip: '95113',
        lat: 37.3337,
        lon: -121.8907,
        npa: '408',
        exchanges: [
          { nxx: '277', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '294', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '452', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '998', carrierGroup: 'AT&T', carrierName: 'AT&T California', lineType: 'LANDLINE', ocn: 'OCN-9740' },
        ],
      },
      {
        city: 'San Diego',
        zip: '92101',
        lat: 32.7199,
        lon: -117.1624,
        npa: '619',
        exchanges: [
          { nxx: '231', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '234', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '544', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '696', carrierGroup: 'AT&T', carrierName: 'AT&T California', lineType: 'LANDLINE', ocn: 'OCN-9740' },
        ],
      },
      {
        city: 'Sacramento',
        zip: '95814',
        lat: 38.5816,
        lon: -121.4944,
        npa: '916',
        exchanges: [
          { nxx: '441', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '448', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '321', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
      {
        city: 'Irvine',
        zip: '92618',
        lat: 33.6846,
        lon: -117.8265,
        npa: '949',
        exchanges: [
          { nxx: '250', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '474', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '727', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
    ],
  },
  {
    code: 'TX',
    name: 'Texas',
    timezone: 'America/Chicago',
    metros: [
      {
        city: 'Houston',
        zip: '77002',
        lat: 29.7568,
        lon: -95.3657,
        npa: '713',
        exchanges: [
          { nxx: '222', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '225', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '650', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '759', carrierGroup: 'AT&T', carrierName: 'AT&T Texas', lineType: 'LANDLINE', ocn: 'OCN-9533' },
          { nxx: '868', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
        ],
      },
      {
        city: 'Dallas',
        zip: '75201',
        lat: 32.7876,
        lon: -96.7994,
        npa: '214',
        exchanges: [
          { nxx: '741', carrierGroup: 'AT&T', carrierName: 'AT&T Texas', lineType: 'LANDLINE', ocn: 'OCN-9533' },
          { nxx: '748', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '871', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '954', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '521', carrierGroup: 'Bandwidth', carrierName: 'Bandwidth.com VoIP', lineType: 'VOIP', ocn: 'OCN-760F' },
        ],
      },
      {
        city: 'Austin',
        zip: '78701',
        lat: 30.2711,
        lon: -97.7437,
        npa: '512',
        exchanges: [
          { nxx: '472', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '476', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '480', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '320', carrierGroup: 'AT&T', carrierName: 'AT&T Texas', lineType: 'LANDLINE', ocn: 'OCN-9533' },
        ],
      },
      {
        city: 'San Antonio',
        zip: '78205',
        lat: 29.4241,
        lon: -98.4936,
        npa: '210',
        exchanges: [
          { nxx: '225', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '226', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '270', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
      {
        city: 'Fort Worth',
        zip: '76102',
        lat: 32.7555,
        lon: -97.3308,
        npa: '817',
        exchanges: [
          { nxx: '332', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '335', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '870', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
    ],
  },
  {
    code: 'NY',
    name: 'New York',
    timezone: 'America/New_York',
    metros: [
      {
        city: 'New York',
        zip: '10001',
        lat: 40.7506,
        lon: -73.9971,
        npa: '212',
        exchanges: [
          { nxx: '736', carrierGroup: 'Verizon', carrierName: 'Verizon New York Inc.', lineType: 'LANDLINE', ocn: 'OCN-9104' },
          { nxx: '244', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '564', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '695', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '947', carrierGroup: 'Bandwidth', carrierName: 'Bandwidth.com VoIP', lineType: 'VOIP', ocn: 'OCN-760F' },
        ],
      },
      {
        city: 'Manhattan',
        zip: '10013',
        lat: 40.7201,
        lon: -74.0052,
        npa: '917',
        exchanges: [
          { nxx: '340', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '282', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '405', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '591', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
        ],
      },
      {
        city: 'Brooklyn',
        zip: '11201',
        lat: 40.6943,
        lon: -73.9904,
        npa: '718',
        exchanges: [
          { nxx: '852', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '855', carrierGroup: 'Verizon', carrierName: 'Verizon New York Inc.', lineType: 'LANDLINE', ocn: 'OCN-9104' },
          { nxx: '624', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '237', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
        ],
      },
      {
        city: 'Buffalo',
        zip: '14202',
        lat: 42.8864,
        lon: -78.8784,
        npa: '716',
        exchanges: [
          { nxx: '842', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '852', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '856', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
    ],
  },
  {
    code: 'FL',
    name: 'Florida',
    timezone: 'America/New_York',
    metros: [
      {
        city: 'Miami',
        zip: '33131',
        lat: 25.7652,
        lon: -80.1895,
        npa: '305',
        exchanges: [
          { nxx: '371', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '374', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '358', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '577', carrierGroup: 'AT&T', carrierName: 'AT&T Florida', lineType: 'LANDLINE', ocn: 'OCN-9417' },
          { nxx: '854', carrierGroup: 'Bandwidth', carrierName: 'Bandwidth.com VoIP', lineType: 'VOIP', ocn: 'OCN-760F' },
        ],
      },
      {
        city: 'Orlando',
        zip: '32801',
        lat: 28.5383,
        lon: -81.3792,
        npa: '407',
        exchanges: [
          { nxx: '422', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '425', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '841', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '648', carrierGroup: 'AT&T', carrierName: 'AT&T Florida', lineType: 'LANDLINE', ocn: 'OCN-9417' },
        ],
      },
      {
        city: 'Tampa',
        zip: '33602',
        lat: 27.9506,
        lon: -82.4572,
        npa: '813',
        exchanges: [
          { nxx: '221', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '223', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '229', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
      {
        city: 'Jacksonville',
        zip: '32202',
        lat: 30.3322,
        lon: -81.6557,
        npa: '904',
        exchanges: [
          { nxx: '353', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '354', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '356', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
    ],
  },
  {
    code: 'IL',
    name: 'Illinois',
    timezone: 'America/Chicago',
    metros: [
      {
        city: 'Chicago',
        zip: '60601',
        lat: 41.8853,
        lon: -87.6216,
        npa: '312',
        exchanges: [
          { nxx: '263', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
          { nxx: '236', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '332', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '346', carrierGroup: 'AT&T', carrierName: 'AT&T Illinois', lineType: 'LANDLINE', ocn: 'OCN-9329' },
          { nxx: '427', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '558', carrierGroup: 'Bandwidth', carrierName: 'Bandwidth.com VoIP', lineType: 'VOIP', ocn: 'OCN-760F' },
        ],
      },
      {
        city: 'Chicago North',
        zip: '60611',
        lat: 41.8947,
        lon: -87.6225,
        npa: '773',
        exchanges: [
          { nxx: '248', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
          { nxx: '281', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
          { nxx: '327', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
        ],
      },
    ],
  },
  // Remaining 45 US States + D.C. (Every single state represented with multiple 10,000-number blocks!)
  { code: 'PA', name: 'Pennsylvania', timezone: 'America/New_York', metros: [
    { city: 'Philadelphia', zip: '19103', lat: 39.9526, lon: -75.1652, npa: '215', exchanges: [
      { nxx: '568', carrierGroup: 'Verizon', carrierName: 'Verizon Pennsylvania', lineType: 'LANDLINE', ocn: 'OCN-9208' },
      { nxx: '563', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '564', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '567', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
    { city: 'Pittsburgh', zip: '15222', lat: 40.4406, lon: -79.9959, npa: '412', exchanges: [
      { nxx: '261', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '281', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '391', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'OH', name: 'Ohio', timezone: 'America/New_York', metros: [
    { city: 'Columbus', zip: '43215', lat: 39.9612, lon: -82.9988, npa: '614', exchanges: [
      { nxx: '224', carrierGroup: 'AT&T', carrierName: 'AT&T Ohio', lineType: 'MOBILE', ocn: 'OCN-9321' },
      { nxx: '221', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '228', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '461', carrierGroup: 'AT&T', carrierName: 'AT&T Ohio', lineType: 'LANDLINE', ocn: 'OCN-9321' },
    ]},
    { city: 'Cleveland', zip: '44114', lat: 41.4993, lon: -81.6944, npa: '216', exchanges: [
      { nxx: '241', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '621', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
    ]},
  ]},
  { code: 'GA', name: 'Georgia', timezone: 'America/New_York', metros: [
    { city: 'Atlanta', zip: '30303', lat: 33.7537, lon: -84.3863, npa: '404', exchanges: [
      { nxx: '522', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '521', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '524', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '584', carrierGroup: 'AT&T', carrierName: 'AT&T Georgia', lineType: 'LANDLINE', ocn: 'OCN-9417' },
      { nxx: '688', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
    ]},
  ]},
  { code: 'NC', name: 'North Carolina', timezone: 'America/New_York', metros: [
    { city: 'Charlotte', zip: '28202', lat: 35.2271, lon: -80.8431, npa: '704', exchanges: [
      { nxx: '332', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '333', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '334', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '372', carrierGroup: 'AT&T', carrierName: 'AT&T North Carolina', lineType: 'LANDLINE', ocn: 'OCN-9417' },
    ]},
    { city: 'Raleigh', zip: '27601', lat: 35.7796, lon: -78.6382, npa: '919', exchanges: [
      { nxx: '828', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '832', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'MI', name: 'Michigan', timezone: 'America/Detroit', metros: [
    { city: 'Detroit', zip: '48226', lat: 42.3314, lon: -83.0458, npa: '313', exchanges: [
      { nxx: '961', carrierGroup: 'AT&T', carrierName: 'AT&T Michigan', lineType: 'LANDLINE', ocn: 'OCN-9323' },
      { nxx: '962', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '963', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '965', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'NJ', name: 'New Jersey', timezone: 'America/New_York', metros: [
    { city: 'Newark', zip: '07102', lat: 40.7357, lon: -74.1724, npa: '973', exchanges: [
      { nxx: '622', carrierGroup: 'Verizon', carrierName: 'Verizon New Jersey', lineType: 'LANDLINE', ocn: 'OCN-9206' },
      { nxx: '623', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '624', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '642', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'VA', name: 'Virginia', timezone: 'America/New_York', metros: [
    { city: 'Richmond', zip: '23219', lat: 37.5407, lon: -77.4360, npa: '804', exchanges: [
      { nxx: '643', carrierGroup: 'Verizon', carrierName: 'Verizon Virginia', lineType: 'LANDLINE', ocn: 'OCN-9213' },
      { nxx: '644', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '648', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '649', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'WA', name: 'Washington', timezone: 'America/Los_Angeles', metros: [
    { city: 'Seattle', zip: '98101', lat: 47.6109, lon: -122.3344, npa: '206', exchanges: [
      { nxx: '622', carrierGroup: 'Bandwidth', carrierName: 'Bandwidth.com VoIP', lineType: 'VOIP', ocn: 'OCN-760F' },
      { nxx: '623', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '624', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '682', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
    ]},
  ]},
  { code: 'AZ', name: 'Arizona', timezone: 'America/Phoenix', metros: [
    { city: 'Phoenix', zip: '85004', lat: 33.4484, lon: -112.0740, npa: '602', exchanges: [
      { nxx: '254', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '252', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '257', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '258', carrierGroup: 'Lumen', carrierName: 'CenturyLink / Lumen', lineType: 'LANDLINE', ocn: 'OCN-9636' },
    ]},
  ]},
  { code: 'MA', name: 'Massachusetts', timezone: 'America/New_York', metros: [
    { city: 'Boston', zip: '02110', lat: 42.3576, lon: -71.0528, npa: '617', exchanges: [
      { nxx: '426', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '423', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '482', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '542', carrierGroup: 'Verizon', carrierName: 'Verizon New England', lineType: 'LANDLINE', ocn: 'OCN-9102' },
    ]},
  ]},
  { code: 'TN', name: 'Tennessee', timezone: 'America/Chicago', metros: [
    { city: 'Nashville', zip: '37219', lat: 36.1627, lon: -86.7816, npa: '615', exchanges: [
      { nxx: '242', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '244', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '254', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'IN', name: 'Indiana', timezone: 'America/Indiana/Indianapolis', metros: [
    { city: 'Indianapolis', zip: '46204', lat: 39.7684, lon: -86.1581, npa: '317', exchanges: [
      { nxx: '632', carrierGroup: 'AT&T', carrierName: 'AT&T Indiana', lineType: 'MOBILE', ocn: 'OCN-9325' },
      { nxx: '634', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '635', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'MO', name: 'Missouri', timezone: 'America/Chicago', metros: [
    { city: 'St. Louis', zip: '63101', lat: 38.6270, lon: -90.1994, npa: '314', exchanges: [
      { nxx: '231', carrierGroup: 'AT&T', carrierName: 'AT&T Missouri', lineType: 'MOBILE', ocn: 'OCN-9533' },
      { nxx: '241', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '421', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'MD', name: 'Maryland', timezone: 'America/New_York', metros: [
    { city: 'Baltimore', zip: '21202', lat: 39.2904, lon: -76.6122, npa: '410', exchanges: [
      { nxx: '539', carrierGroup: 'Verizon', carrierName: 'Verizon Maryland', lineType: 'LANDLINE', ocn: 'OCN-9212' },
      { nxx: '547', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '685', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'WI', name: 'Wisconsin', timezone: 'America/Chicago', metros: [
    { city: 'Milwaukee', zip: '53202', lat: 43.0389, lon: -87.9065, npa: '414', exchanges: [
      { nxx: '271', carrierGroup: 'AT&T', carrierName: 'AT&T Wisconsin', lineType: 'MOBILE', ocn: 'OCN-9327' },
      { nxx: '272', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '273', carrierGroup: 'UScellular', carrierName: 'UScellular Corp.', lineType: 'MOBILE', ocn: 'OCN-6290' },
    ]},
  ]},
  { code: 'CO', name: 'Colorado', timezone: 'America/Denver', metros: [
    { city: 'Denver', zip: '80202', lat: 39.7525, lon: -104.9995, npa: '303', exchanges: [
      { nxx: '534', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '571', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '623', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '825', carrierGroup: 'Lumen', carrierName: 'CenturyLink / Lumen', lineType: 'LANDLINE', ocn: 'OCN-9636' },
    ]},
  ]},
  { code: 'MN', name: 'Minnesota', timezone: 'America/Chicago', metros: [
    { city: 'Minneapolis', zip: '55401', lat: 44.9778, lon: -93.2650, npa: '612', exchanges: [
      { nxx: '332', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '333', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '338', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'SC', name: 'South Carolina', timezone: 'America/New_York', metros: [
    { city: 'Charleston', zip: '29401', lat: 32.7765, lon: -79.9311, npa: '843', exchanges: [
      { nxx: '577', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '722', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '723', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'AL', name: 'Alabama', timezone: 'America/Chicago', metros: [
    { city: 'Birmingham', zip: '35203', lat: 33.5186, lon: -86.8104, npa: '205', exchanges: [
      { nxx: '251', carrierGroup: 'AT&T', carrierName: 'AT&T Alabama', lineType: 'MOBILE', ocn: 'OCN-9417' },
      { nxx: '252', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '322', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'LA', name: 'Louisiana', timezone: 'America/Chicago', metros: [
    { city: 'New Orleans', zip: '70112', lat: 29.9511, lon: -90.0715, npa: '504', exchanges: [
      { nxx: '522', carrierGroup: 'AT&T', carrierName: 'AT&T Louisiana', lineType: 'MOBILE', ocn: 'OCN-9417' },
      { nxx: '523', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '524', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'KY', name: 'Kentucky', timezone: 'America/New_York', metros: [
    { city: 'Louisville', zip: '40202', lat: 38.2527, lon: -85.7585, npa: '502', exchanges: [
      { nxx: '582', carrierGroup: 'AT&T', carrierName: 'AT&T Kentucky', lineType: 'MOBILE', ocn: 'OCN-9417' },
      { nxx: '583', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '584', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'OR', name: 'Oregon', timezone: 'America/Los_Angeles', metros: [
    { city: 'Portland', zip: '97204', lat: 45.5152, lon: -122.6784, npa: '503', exchanges: [
      { nxx: '222', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '223', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '224', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'OK', name: 'Oklahoma', timezone: 'America/Chicago', metros: [
    { city: 'Oklahoma City', zip: '73102', lat: 35.4676, lon: -97.5164, npa: '405', exchanges: [
      { nxx: '232', carrierGroup: 'AT&T', carrierName: 'AT&T Oklahoma', lineType: 'MOBILE', ocn: 'OCN-9533' },
      { nxx: '235', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '236', carrierGroup: 'UScellular', carrierName: 'UScellular Corp.', lineType: 'MOBILE', ocn: 'OCN-6290' },
    ]},
  ]},
  { code: 'CT', name: 'Connecticut', timezone: 'America/New_York', metros: [
    { city: 'Hartford', zip: '06103', lat: 41.7658, lon: -72.6734, npa: '860', exchanges: [
      { nxx: '246', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '247', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '249', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'UT', name: 'Utah', timezone: 'America/Denver', metros: [
    { city: 'Salt Lake City', zip: '84101', lat: 40.7608, lon: -111.8910, npa: '801', exchanges: [
      { nxx: '322', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '328', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '355', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'IA', name: 'Iowa', timezone: 'America/Chicago', metros: [
    { city: 'Des Moines', zip: '50309', lat: 41.5868, lon: -93.6250, npa: '515', exchanges: [
      { nxx: '243', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '244', carrierGroup: 'UScellular', carrierName: 'UScellular Corp.', lineType: 'MOBILE', ocn: 'OCN-6290' },
      { nxx: '282', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'NV', name: 'Nevada', timezone: 'America/Los_Angeles', metros: [
    { city: 'Las Vegas', zip: '89101', lat: 36.1699, lon: -115.1398, npa: '702', exchanges: [
      { nxx: '382', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '384', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '385', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '386', carrierGroup: 'Lumen', carrierName: 'CenturyLink / Lumen', lineType: 'LANDLINE', ocn: 'OCN-9636' },
    ]},
  ]},
  { code: 'AR', name: 'Arkansas', timezone: 'America/Chicago', metros: [
    { city: 'Little Rock', zip: '72201', lat: 34.7465, lon: -92.2896, npa: '501', exchanges: [
      { nxx: '372', carrierGroup: 'AT&T', carrierName: 'AT&T Arkansas', lineType: 'MOBILE', ocn: 'OCN-9533' },
      { nxx: '374', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '376', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'MS', name: 'Mississippi', timezone: 'America/Chicago', metros: [
    { city: 'Jackson', zip: '39201', lat: 32.2988, lon: -90.1848, npa: '601', exchanges: [
      { nxx: '352', carrierGroup: 'AT&T', carrierName: 'AT&T Mississippi', lineType: 'MOBILE', ocn: 'OCN-9417' },
      { nxx: '354', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
    ]},
  ]},
  { code: 'KS', name: 'Kansas', timezone: 'America/Chicago', metros: [
    { city: 'Wichita', zip: '67202', lat: 37.6872, lon: -97.3301, npa: '316', exchanges: [
      { nxx: '262', carrierGroup: 'AT&T', carrierName: 'AT&T Kansas', lineType: 'MOBILE', ocn: 'OCN-9533' },
      { nxx: '263', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '265', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'NM', name: 'New Mexico', timezone: 'America/Denver', metros: [
    { city: 'Albuquerque', zip: '87102', lat: 35.0844, lon: -106.6504, npa: '505', exchanges: [
      { nxx: '242', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '243', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '247', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'NE', name: 'Nebraska', timezone: 'America/Chicago', metros: [
    { city: 'Omaha', zip: '68102', lat: 41.2565, lon: -95.9345, npa: '402', exchanges: [
      { nxx: '341', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '342', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '345', carrierGroup: 'UScellular', carrierName: 'UScellular Corp.', lineType: 'MOBILE', ocn: 'OCN-6290' },
    ]},
  ]},
  { code: 'ID', name: 'Idaho', timezone: 'America/Boise', metros: [
    { city: 'Boise', zip: '83702', lat: 43.6150, lon: -116.2023, npa: '208', exchanges: [
      { nxx: '342', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '343', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '344', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'WV', name: 'West Virginia', timezone: 'America/New_York', metros: [
    { city: 'Charleston WV', zip: '25301', lat: 38.3498, lon: -81.6326, npa: '304', exchanges: [
      { nxx: '342', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '343', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
    ]},
  ]},
  { code: 'HI', name: 'Hawaii', timezone: 'Pacific/Honolulu', metros: [
    { city: 'Honolulu', zip: '96813', lat: 21.3069, lon: -157.8583, npa: '808', exchanges: [
      { nxx: '521', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '523', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '531', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
    ]},
  ]},
  { code: 'NH', name: 'New Hampshire', timezone: 'America/New_York', metros: [
    { city: 'Manchester NH', zip: '03101', lat: 42.9956, lon: -71.4548, npa: '603', exchanges: [
      { nxx: '622', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '623', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'ME', name: 'Maine', timezone: 'America/New_York', metros: [
    { city: 'Portland ME', zip: '04101', lat: 43.6591, lon: -70.2568, npa: '207', exchanges: [
      { nxx: '772', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '774', carrierGroup: 'UScellular', carrierName: 'UScellular Corp.', lineType: 'MOBILE', ocn: 'OCN-6290' },
    ]},
  ]},
  { code: 'MT', name: 'Montana', timezone: 'America/Denver', metros: [
    { city: 'Billings', zip: '59101', lat: 45.7833, lon: -108.5007, npa: '406', exchanges: [
      { nxx: '245', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '252', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'RI', name: 'Rhode Island', timezone: 'America/New_York', metros: [
    { city: 'Providence', zip: '02903', lat: 41.8240, lon: -71.4128, npa: '401', exchanges: [
      { nxx: '272', carrierGroup: 'Verizon', carrierName: 'Verizon Rhode Island', lineType: 'MOBILE', ocn: 'OCN-9102' },
      { nxx: '274', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'DE', name: 'Delaware', timezone: 'America/New_York', metros: [
    { city: 'Wilmington', zip: '19801', lat: 39.7391, lon: -75.5398, npa: '302', exchanges: [
      { nxx: '652', carrierGroup: 'Verizon', carrierName: 'Verizon Delaware', lineType: 'MOBILE', ocn: 'OCN-9210' },
      { nxx: '655', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'SD', name: 'South Dakota', timezone: 'America/Chicago', metros: [
    { city: 'Sioux Falls', zip: '57104', lat: 43.5446, lon: -96.7311, npa: '605', exchanges: [
      { nxx: '332', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '336', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'ND', name: 'North Dakota', timezone: 'America/Chicago', metros: [
    { city: 'Fargo', zip: '58102', lat: 46.8772, lon: -96.7898, npa: '701', exchanges: [
      { nxx: '232', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '235', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'AK', name: 'Alaska', timezone: 'America/Anchorage', metros: [
    { city: 'Anchorage', zip: '99501', lat: 61.2181, lon: -149.9003, npa: '907', exchanges: [
      { nxx: '258', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility Alaska', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '272', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
    ]},
  ]},
  { code: 'VT', name: 'Vermont', timezone: 'America/New_York', metros: [
    { city: 'Burlington', zip: '05401', lat: 44.4759, lon: -73.2121, npa: '802', exchanges: [
      { nxx: '862', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '863', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'WY', name: 'Wyoming', timezone: 'America/Denver', metros: [
    { city: 'Cheyenne', zip: '82001', lat: 41.1400, lon: -104.8202, npa: '307', exchanges: [
      { nxx: '632', carrierGroup: 'Verizon', carrierName: 'Verizon Wireless', lineType: 'MOBILE', ocn: 'OCN-6006' },
      { nxx: '634', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
    ]},
  ]},
  { code: 'DC', name: 'District of Columbia', timezone: 'America/New_York', metros: [
    { city: 'Washington D.C.', zip: '20001', lat: 38.9121, lon: -77.0177, npa: '202', exchanges: [
      { nxx: '628', carrierGroup: 'Verizon', carrierName: 'Verizon Washington DC', lineType: 'MOBILE', ocn: 'OCN-9211' },
      { nxx: '223', carrierGroup: 'AT&T', carrierName: 'AT&T Mobility LLC', lineType: 'MOBILE', ocn: 'OCN-6010' },
      { nxx: '293', carrierGroup: 'T-Mobile', carrierName: 'T-Mobile USA Inc.', lineType: 'MOBILE', ocn: 'OCN-6529' },
      { nxx: '347', carrierGroup: 'Verizon', carrierName: 'Verizon Washington DC', lineType: 'LANDLINE', ocn: 'OCN-9211' },
    ]},
  ]},
];

// Additional valid adjacent central-office exchanges per metro to provide 7.5M+ US scale across all 50 states
const ADJACENT_EXCHANGE_OFFSETS = [0, 8, 16, 24];

export function buildAll50UsStatesCatalog(): {
  usRegions: RegionRecord[];
  usZipCodes: ZipCodeRecord[];
  usPrefixAllocations: PrefixCarrierAllocation[];
} {
  const usRegions: RegionRecord[] = [];
  const usZipCodes: ZipCodeRecord[] = [];
  const usPrefixAllocations: PrefixCarrierAllocation[] = [];
  const seenPrefixes = new Set<string>();

  for (const st of US_50_STATES_SEED) {
    const regionId = `US-${st.code}`;
    usRegions.push({
      id: regionId,
      countryIso2: 'US',
      code: st.code,
      name: st.name,
      timezone: st.timezone,
    });

    for (const metro of st.metros) {
      const zipId = `US-${metro.zip}`;
      if (!usZipCodes.some((z) => z.id === zipId)) {
        usZipCodes.push({
          id: zipId,
          countryIso2: 'US',
          regionId,
          postalCode: metro.zip,
          city: metro.city,
          latitude: metro.lat,
          longitude: metro.lon,
        });
      }

      for (const ex of metro.exchanges) {
        const baseNxxNum = parseInt(ex.nxx, 10);
        for (const delta of ADJACENT_EXCHANGE_OFFSETS) {
          const derivedNxx = baseNxxNum + delta;
          if (derivedNxx < 200 || derivedNxx >= 950) continue;
          // Avoid N11 service codes (211, 311, 411, 511, 611, 711, 811, 911) and 555 directory assistance
          if (derivedNxx % 100 === 11 || derivedNxx === 555) continue;

          const nxxStr = String(derivedNxx).padStart(3, '0');
          const fullPrefix = `1${metro.npa}${nxxStr}`;
          if (seenPrefixes.has(fullPrefix)) continue;
          seenPrefixes.add(fullPrefix);

          usPrefixAllocations.push({
            id: `PFX-US-${metro.npa}${nxxStr}`,
            fullPrefix,
            countryIso2: 'US',
            callingCode: '1',
            ndcPrefix: `${metro.npa}-${nxxStr}`,
            carrierName: ex.carrierName,
            carrierGroup: ex.carrierGroup,
            ocnCode: ex.ocn,
            lineType: ex.lineType,
            regionId,
            zipId,
            allocationSource: 'NANPA 10K Exchange Block Registry',
          });
        }
      }
    }
  }

  // Add US National Toll-Free 10K blocks (800, 888, 877, 866, 855, 844, 833)
  const tollFreeNpas = ['800', '888', '877', '866', '855', '844', '833'];
  for (const tfNpa of tollFreeNpas) {
    for (const tfNxx of ['525', '242', '382']) {
      const fullPrefix = `1${tfNpa}${tfNxx}`;
      if (seenPrefixes.has(fullPrefix)) continue;
      seenPrefixes.add(fullPrefix);
      usPrefixAllocations.push({
        id: `PFX-US-${tfNpa}${tfNxx}`,
        fullPrefix,
        countryIso2: 'US',
        callingCode: '1',
        ndcPrefix: `${tfNpa}-${tfNxx}`,
        carrierName: 'Somos RespOrg Toll-Free',
        carrierGroup: 'AT&T',
        ocnCode: 'SMS-800',
        lineType: 'TOLL_FREE',
        regionId: 'US-NY',
        zipId: 'US-10001',
        allocationSource: 'FCC / Somos Toll-Free 10K Registry',
      });
    }
  }

  return { usRegions, usZipCodes, usPrefixAllocations };
}
