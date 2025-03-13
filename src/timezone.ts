/**
 * @module Timezone
 * This module provides a comprehensive list of IANA time zones and validation utilities.
 */

import { z } from 'zod';

/**
 * An object containing all supported IANA time zones, organized by continent/region.
 * Each timezone is represented by its IANA timezone identifier (e.g., 'America/New_York').
 *
 * @example
 * ```typescript
 * // Using a timezone
 * const nyTimezone = Timezone.America.New_York;  // 'America/New_York'
 * const tokyoTimezone = Timezone.Asia.Tokyo;     // 'Asia/Tokyo'
 * const utcTimezone = Timezone.UTC;              // 'UTC'
 * ```
 */
export const Timezone = {
  Africa: {
    Abidjan: 'Africa/Abidjan',
    Accra: 'Africa/Accra',
    Algiers: 'Africa/Algiers',
    Bissau: 'Africa/Bissau',
    Cairo: 'Africa/Cairo',
    Casablanca: 'Africa/Casablanca',
    Ceuta: 'Africa/Ceuta',
    El_Aaiun: 'Africa/El_Aaiun',
    Johannesburg: 'Africa/Johannesburg',
    Juba: 'Africa/Juba',
    Khartoum: 'Africa/Khartoum',
    Lagos: 'Africa/Lagos',
    Maputo: 'Africa/Maputo',
    Monrovia: 'Africa/Monrovia',
    Nairobi: 'Africa/Nairobi',
    Ndjamena: 'Africa/Ndjamena',
    Sao_Tome: 'Africa/Sao_Tome',
    Tripoli: 'Africa/Tripoli',
    Tunis: 'Africa/Tunis',
    Windhoek: 'Africa/Windhoek',
  },
  America: {
    Adak: 'America/Adak',
    Anchorage: 'America/Anchorage',
    Araguaina: 'America/Araguaina',
    Argentina: {
      Buenos_Aires: 'America/Argentina/Buenos_Aires',
      Cordoba: 'America/Argentina/Cordoba',
      Salta: 'America/Argentina/Salta',
      Jujuy: 'America/Argentina/Jujuy',
      Tucuman: 'America/Argentina/Tucuman',
      Catamarca: 'America/Argentina/Catamarca',
      La_Rioja: 'America/Argentina/La_Rioja',
      San_Juan: 'America/Argentina/San_Juan',
      Mendoza: 'America/Argentina/Mendoza',
      San_Luis: 'America/Argentina/San_Luis',
      Rio_Gallegos: 'America/Argentina/Rio_Gallegos',
      Ushuaia: 'America/Argentina/Ushuaia',
    },
    Asuncion: 'America/Asuncion',
    Atikokan: 'America/Atikokan',
    Bahia: 'America/Bahia',
    Bahia_Banderas: 'America/Bahia_Banderas',
    Barbados: 'America/Barbados',
    Belem: 'America/Belem',
    Belize: 'America/Belize',
    Blanc_Sablon: 'America/Blanc-Sablon',
    Boa_Vista: 'America/Boa_Vista',
    Bogota: 'America/Bogota',
    Boise: 'America/Boise',
    Cambridge_Bay: 'America/Cambridge_Bay',
    Campo_Grande: 'America/Campo_Grande',
    Cancun: 'America/Cancun',
    Caracas: 'America/Caracas',
    Cayenne: 'America/Cayenne',
    Chicago: 'America/Chicago',
    Chihuahua: 'America/Chihuahua',
    Costa_Rica: 'America/Costa_Rica',
    Creston: 'America/Creston',
    Cuiaba: 'America/Cuiaba',
    Curacao: 'America/Curacao',
    Danmarkshavn: 'America/Danmarkshavn',
    Dawson: 'America/Dawson',
    Dawson_Creek: 'America/Dawson_Creek',
    Denver: 'America/Denver',
    Detroit: 'America/Detroit',
    Edmonton: 'America/Edmonton',
    Eirunepe: 'America/Eirunepe',
    El_Salvador: 'America/El_Salvador',
    Fort_Nelson: 'America/Fort_Nelson',
    Fortaleza: 'America/Fortaleza',
    Glace_Bay: 'America/Glace_Bay',
    Goose_Bay: 'America/Goose_Bay',
    Grand_Turk: 'America/Grand_Turk',
    Guatemala: 'America/Guatemala',
    Guayaquil: 'America/Guayaquil',
    Guyana: 'America/Guyana',
    Halifax: 'America/Halifax',
    Havana: 'America/Havana',
    Hermosillo: 'America/Hermosillo',
    Indiana: {
      Indianapolis: 'America/Indiana/Indianapolis',
      Knox: 'America/Indiana/Knox',
      Marengo: 'America/Indiana/Marengo',
      Petersburg: 'America/Indiana/Petersburg',
      Tell_City: 'America/Indiana/Tell_City',
      Vevay: 'America/Indiana/Vevay',
      Vincennes: 'America/Indiana/Vincennes',
      Winamac: 'America/Indiana/Winamac',
    },
    Inuvik: 'America/Inuvik',
    Iqaluit: 'America/Iqaluit',
    Jamaica: 'America/Jamaica',
    Juneau: 'America/Juneau',
    Kentucky: {
      Louisville: 'America/Kentucky/Louisville',
      Monticello: 'America/Kentucky/Monticello',
    },
    La_Paz: 'America/La_Paz',
    Lima: 'America/Lima',
    Los_Angeles: 'America/Los_Angeles',
    Maceio: 'America/Maceio',
    Managua: 'America/Managua',
    Manaus: 'America/Manaus',
    Martinique: 'America/Martinique',
    Matamoros: 'America/Matamoros',
    Mazatlan: 'America/Mazatlan',
    Menominee: 'America/Menominee',
    Merida: 'America/Merida',
    Metlakatla: 'America/Metlakatla',
    Mexico_City: 'America/Mexico_City',
    Miquelon: 'America/Miquelon',
    Moncton: 'America/Moncton',
    Monterrey: 'America/Monterrey',
    Montevideo: 'America/Montevideo',
    Nassau: 'America/Nassau',
    New_York: 'America/New_York',
    Nipigon: 'America/Nipigon',
    Nome: 'America/Nome',
    Noronha: 'America/Noronha',
    North_Dakota: {
      Beulah: 'America/North_Dakota/Beulah',
      Center: 'America/North_Dakota/Center',
      New_Salem: 'America/North_Dakota/New_Salem',
    },
    Nuuk: 'America/Nuuk',
    Ojinaga: 'America/Ojinaga',
    Panama: 'America/Panama',
    Pangnirtung: 'America/Pangnirtung',
    Paramaribo: 'America/Paramaribo',
    Phoenix: 'America/Phoenix',
    Port_au_Prince: 'America/Port-au-Prince',
    Port_of_Spain: 'America/Port_of_Spain',
    Porto_Velho: 'America/Porto_Velho',
    Puerto_Rico: 'America/Puerto_Rico',
    Punta_Arenas: 'America/Punta_Arenas',
    Rainy_River: 'America/Rainy_River',
    Rankin_Inlet: 'America/Rankin_Inlet',
    Recife: 'America/Recife',
    Regina: 'America/Regina',
    Resolute: 'America/Resolute',
    Rio_Branco: 'America/Rio_Branco',
    Santarem: 'America/Santarem',
    Santiago: 'America/Santiago',
    Santo_Domingo: 'America/Santo_Domingo',
    Sao_Paulo: 'America/Sao_Paulo',
    Scoresbysund: 'America/Scoresbysund',
    Sitka: 'America/Sitka',
    St_Johns: 'America/St_Johns',
    Swift_Current: 'America/Swift_Current',
    Tegucigalpa: 'America/Tegucigalpa',
    Thule: 'America/Thule',
    Thunder_Bay: 'America/Thunder_Bay',
    Tijuana: 'America/Tijuana',
    Toronto: 'America/Toronto',
    Vancouver: 'America/Vancouver',
    Whitehorse: 'America/Whitehorse',
    Winnipeg: 'America/Winnipeg',
    Yakutat: 'America/Yakutat',
    Yellowknife: 'America/Yellowknife',
  },
  Antarctica: {
    Casey: 'Antarctica/Casey',
    Davis: 'Antarctica/Davis',
    DumontDUrville: 'Antarctica/DumontDUrville',
    Macquarie: 'Antarctica/Macquarie',
    Mawson: 'Antarctica/Mawson',
    McMurdo: 'Antarctica/McMurdo',
    Palmer: 'Antarctica/Palmer',
    Rothera: 'Antarctica/Rothera',
    Syowa: 'Antarctica/Syowa',
    Troll: 'Antarctica/Troll',
    Vostok: 'Antarctica/Vostok',
  },
  Asia: {
    Almaty: 'Asia/Almaty',
    Amman: 'Asia/Amman',
    Anadyr: 'Asia/Anadyr',
    Aqtau: 'Asia/Aqtau',
    Aqtobe: 'Asia/Aqtobe',
    Ashgabat: 'Asia/Ashgabat',
    Atyrau: 'Asia/Atyrau',
    Baghdad: 'Asia/Baghdad',
    Baku: 'Asia/Baku',
    Bangkok: 'Asia/Bangkok',
    Barnaul: 'Asia/Barnaul',
    Beirut: 'Asia/Beirut',
    Bishkek: 'Asia/Bishkek',
    Brunei: 'Asia/Brunei',
    Chita: 'Asia/Chita',
    Choibalsan: 'Asia/Choibalsan',
    Colombo: 'Asia/Colombo',
    Damascus: 'Asia/Damascus',
    Dhaka: 'Asia/Dhaka',
    Dili: 'Asia/Dili',
    Dubai: 'Asia/Dubai',
    Dushanbe: 'Asia/Dushanbe',
    Famagusta: 'Asia/Famagusta',
    Gaza: 'Asia/Gaza',
    Hebron: 'Asia/Hebron',
    Ho_Chi_Minh: 'Asia/Ho_Chi_Minh',
    Hong_Kong: 'Asia/Hong_Kong',
    Hovd: 'Asia/Hovd',
    Irkutsk: 'Asia/Irkutsk',
    Jakarta: 'Asia/Jakarta',
    Jayapura: 'Asia/Jayapura',
    Jerusalem: 'Asia/Jerusalem',
    Kabul: 'Asia/Kabul',
    Kamchatka: 'Asia/Kamchatka',
    Karachi: 'Asia/Karachi',
    Kathmandu: 'Asia/Kathmandu',
    Khandyga: 'Asia/Khandyga',
    Kolkata: 'Asia/Kolkata',
    Krasnoyarsk: 'Asia/Krasnoyarsk',
    Kuala_Lumpur: 'Asia/Kuala_Lumpur',
    Kuching: 'Asia/Kuching',
    Macau: 'Asia/Macau',
    Magadan: 'Asia/Magadan',
    Makassar: 'Asia/Makassar',
    Manila: 'Asia/Manila',
    Nicosia: 'Asia/Nicosia',
    Novokuznetsk: 'Asia/Novokuznetsk',
    Novosibirsk: 'Asia/Novosibirsk',
    Omsk: 'Asia/Omsk',
    Oral: 'Asia/Oral',
    Pontianak: 'Asia/Pontianak',
    Pyongyang: 'Asia/Pyongyang',
    Qatar: 'Asia/Qatar',
    Qostanay: 'Asia/Qostanay',
    Qyzylorda: 'Asia/Qyzylorda',
    Riyadh: 'Asia/Riyadh',
    Sakhalin: 'Asia/Sakhalin',
    Samarkand: 'Asia/Samarkand',
    Seoul: 'Asia/Seoul',
    Shanghai: 'Asia/Shanghai',
    Singapore: 'Asia/Singapore',
    Srednekolymsk: 'Asia/Srednekolymsk',
    Taipei: 'Asia/Taipei',
    Tashkent: 'Asia/Tashkent',
    Tbilisi: 'Asia/Tbilisi',
    Tehran: 'Asia/Tehran',
    Thimphu: 'Asia/Thimphu',
    Tokyo: 'Asia/Tokyo',
    Tomsk: 'Asia/Tomsk',
    Ulaanbaatar: 'Asia/Ulaanbaatar',
    Urumqi: 'Asia/Urumqi',
    Ust_Nera: 'Asia/Ust-Nera',
    Vladivostok: 'Asia/Vladivostok',
    Yakutsk: 'Asia/Yakutsk',
    Yangon: 'Asia/Yangon',
    Yekaterinburg: 'Asia/Yekaterinburg',
    Yerevan: 'Asia/Yerevan',
  },
  Atlantic: {
    Azores: 'Atlantic/Azores',
    Bermuda: 'Atlantic/Bermuda',
    Canary: 'Atlantic/Canary',
    Cape_Verde: 'Atlantic/Cape_Verde',
    Faroe: 'Atlantic/Faroe',
    Madeira: 'Atlantic/Madeira',
    Reykjavik: 'Atlantic/Reykjavik',
    South_Georgia: 'Atlantic/South_Georgia',
    Stanley: 'Atlantic/Stanley',
    St_Helena: 'Atlantic/St_Helena',
  },
  Australia: {
    Adelaide: 'Australia/Adelaide',
    Brisbane: 'Australia/Brisbane',
    Broken_Hill: 'Australia/Broken_Hill',
    Darwin: 'Australia/Darwin',
    Eucla: 'Australia/Eucla',
    Hobart: 'Australia/Hobart',
    Lindeman: 'Australia/Lindeman',
    Lord_Howe: 'Australia/Lord_Howe',
    Melbourne: 'Australia/Melbourne',
    Perth: 'Australia/Perth',
    Sydney: 'Australia/Sydney',
  },
  Europe: {
    Amsterdam: 'Europe/Amsterdam',
    Andorra: 'Europe/Andorra',
    Astrakhan: 'Europe/Astrakhan',
    Athens: 'Europe/Athens',
    Belgrade: 'Europe/Belgrade',
    Berlin: 'Europe/Berlin',
    Brussels: 'Europe/Brussels',
    Bucharest: 'Europe/Bucharest',
    Budapest: 'Europe/Budapest',
    Chisinau: 'Europe/Chisinau',
    Copenhagen: 'Europe/Copenhagen',
    Dublin: 'Europe/Dublin',
    Gibraltar: 'Europe/Gibraltar',
    Helsinki: 'Europe/Helsinki',
    Istanbul: 'Europe/Istanbul',
    Kaliningrad: 'Europe/Kaliningrad',
    Kiev: 'Europe/Kiev',
    Kirov: 'Europe/Kirov',
    Lisbon: 'Europe/Lisbon',
    London: 'Europe/London',
    Luxembourg: 'Europe/Luxembourg',
    Madrid: 'Europe/Madrid',
    Malta: 'Europe/Malta',
    Minsk: 'Europe/Minsk',
    Monaco: 'Europe/Monaco',
    Moscow: 'Europe/Moscow',
    Oslo: 'Europe/Oslo',
    Paris: 'Europe/Paris',
    Prague: 'Europe/Prague',
    Riga: 'Europe/Riga',
    Rome: 'Europe/Rome',
    Samara: 'Europe/Samara',
    Saratov: 'Europe/Saratov',
    Simferopol: 'Europe/Simferopol',
    Sofia: 'Europe/Sofia',
    Stockholm: 'Europe/Stockholm',
    Tallinn: 'Europe/Tallinn',
    Tirane: 'Europe/Tirane',
    Ulyanovsk: 'Europe/Ulyanovsk',
    Uzhgorod: 'Europe/Uzhgorod',
    Vienna: 'Europe/Vienna',
    Vilnius: 'Europe/Vilnius',
    Volgograd: 'Europe/Volgograd',
    Warsaw: 'Europe/Warsaw',
    Zaporozhye: 'Europe/Zaporozhye',
    Zurich: 'Europe/Zurich',
  },
  Indian: {
    Chagos: 'Indian/Chagos',
    Christmas: 'Indian/Christmas',
    Cocos: 'Indian/Cocos',
    Kerguelen: 'Indian/Kerguelen',
    Mahe: 'Indian/Mahe',
    Maldives: 'Indian/Maldives',
    Mauritius: 'Indian/Mauritius',
    Reunion: 'Indian/Reunion',
  },
  Pacific: {
    Apia: 'Pacific/Apia',
    Auckland: 'Pacific/Auckland',
    Bougainville: 'Pacific/Bougainville',
    Chatham: 'Pacific/Chatham',
    Chuuk: 'Pacific/Chuuk',
    Easter: 'Pacific/Easter',
    Efate: 'Pacific/Efate',
    Enderbury: 'Pacific/Enderbury',
    Fakaofo: 'Pacific/Fakaofo',
    Fiji: 'Pacific/Fiji',
    Funafuti: 'Pacific/Funafuti',
    Galapagos: 'Pacific/Galapagos',
    Gambier: 'Pacific/Gambier',
    Guadalcanal: 'Pacific/Guadalcanal',
    Guam: 'Pacific/Guam',
    Honolulu: 'Pacific/Honolulu',
    Kiritimati: 'Pacific/Kiritimati',
    Kosrae: 'Pacific/Kosrae',
    Kwajalein: 'Pacific/Kwajalein',
    Majuro: 'Pacific/Majuro',
    Marquesas: 'Pacific/Marquesas',
    Nauru: 'Pacific/Nauru',
    Niue: 'Pacific/Niue',
    Norfolk: 'Pacific/Norfolk',
    Noumea: 'Pacific/Noumea',
    Pago_Pago: 'Pacific/Pago_Pago',
    Palau: 'Pacific/Palau',
    Pitcairn: 'Pacific/Pitcairn',
    Pohnpei: 'Pacific/Pohnpei',
    Port_Moresby: 'Pacific/Port_Moresby',
    Rarotonga: 'Pacific/Rarotonga',
    Tahiti: 'Pacific/Tahiti',
    Tarawa: 'Pacific/Tarawa',
    Tongatapu: 'Pacific/Tongatapu',
    Wake: 'Pacific/Wake',
    Wallis: 'Pacific/Wallis',
  },
  GMT: 'GMT',
  UTC: 'UTC',
} as const;

/**
 * A Zod schema for validating time zone strings.
 * It ensures that only valid time zones from the Timezone object are accepted.
 * This schema is used for runtime validation of timezone values.
 *
 * @example
 * ```typescript
 * // Validating a timezone string
 * const result = TimezoneSchema.safeParse('America/New_York');
 * if (result.success) {
 *   // Valid timezone
 *   const timezone = result.data;
 * } else {
 *   // Invalid timezone
 *   console.error(result.error);
 * }
 * ```
 */
export const TimezoneSchema: z.ZodType<string> = z.union([
  // Africa
  z.literal(Timezone.Africa.Abidjan),
  z.literal(Timezone.Africa.Accra),
  z.literal(Timezone.Africa.Algiers),
  z.literal(Timezone.Africa.Bissau),
  z.literal(Timezone.Africa.Cairo),
  z.literal(Timezone.Africa.Casablanca),
  z.literal(Timezone.Africa.Ceuta),
  z.literal(Timezone.Africa.El_Aaiun),
  z.literal(Timezone.Africa.Johannesburg),
  z.literal(Timezone.Africa.Juba),
  z.literal(Timezone.Africa.Khartoum),
  z.literal(Timezone.Africa.Lagos),
  z.literal(Timezone.Africa.Maputo),
  z.literal(Timezone.Africa.Monrovia),
  z.literal(Timezone.Africa.Nairobi),
  z.literal(Timezone.Africa.Ndjamena),
  z.literal(Timezone.Africa.Sao_Tome),
  z.literal(Timezone.Africa.Tripoli),
  z.literal(Timezone.Africa.Tunis),
  z.literal(Timezone.Africa.Windhoek),

  // America
  z.literal(Timezone.America.Adak),
  z.literal(Timezone.America.Anchorage),
  z.literal(Timezone.America.Araguaina),
  z.literal(Timezone.America.Argentina.Buenos_Aires),
  z.literal(Timezone.America.Argentina.Cordoba),
  z.literal(Timezone.America.Argentina.Salta),
  z.literal(Timezone.America.Argentina.Jujuy),
  z.literal(Timezone.America.Argentina.Tucuman),
  z.literal(Timezone.America.Argentina.Catamarca),
  z.literal(Timezone.America.Argentina.La_Rioja),
  z.literal(Timezone.America.Argentina.San_Juan),
  z.literal(Timezone.America.Argentina.Mendoza),
  z.literal(Timezone.America.Argentina.San_Luis),
  z.literal(Timezone.America.Argentina.Rio_Gallegos),
  z.literal(Timezone.America.Argentina.Ushuaia),
  z.literal(Timezone.America.Asuncion),
  z.literal(Timezone.America.Atikokan),
  z.literal(Timezone.America.Bahia),
  z.literal(Timezone.America.Bahia_Banderas),
  z.literal(Timezone.America.Barbados),
  z.literal(Timezone.America.Belem),
  z.literal(Timezone.America.Belize),
  z.literal(Timezone.America.Blanc_Sablon),
  z.literal(Timezone.America.Boa_Vista),
  z.literal(Timezone.America.Bogota),
  z.literal(Timezone.America.Boise),
  z.literal(Timezone.America.Cambridge_Bay),
  z.literal(Timezone.America.Campo_Grande),
  z.literal(Timezone.America.Cancun),
  z.literal(Timezone.America.Caracas),
  z.literal(Timezone.America.Cayenne),
  z.literal(Timezone.America.Chicago),
  z.literal(Timezone.America.Chihuahua),
  z.literal(Timezone.America.Costa_Rica),
  z.literal(Timezone.America.Creston),
  z.literal(Timezone.America.Cuiaba),
  z.literal(Timezone.America.Curacao),
  z.literal(Timezone.America.Danmarkshavn),
  z.literal(Timezone.America.Dawson),
  z.literal(Timezone.America.Dawson_Creek),
  z.literal(Timezone.America.Denver),
  z.literal(Timezone.America.Detroit),
  z.literal(Timezone.America.Edmonton),
  z.literal(Timezone.America.Eirunepe),
  z.literal(Timezone.America.El_Salvador),
  z.literal(Timezone.America.Fort_Nelson),
  z.literal(Timezone.America.Fortaleza),
  z.literal(Timezone.America.Glace_Bay),
  z.literal(Timezone.America.Goose_Bay),
  z.literal(Timezone.America.Grand_Turk),
  z.literal(Timezone.America.Guatemala),
  z.literal(Timezone.America.Guayaquil),
  z.literal(Timezone.America.Guyana),
  z.literal(Timezone.America.Halifax),
  z.literal(Timezone.America.Havana),
  z.literal(Timezone.America.Hermosillo),
  z.literal(Timezone.America.Indiana.Indianapolis),
  z.literal(Timezone.America.Indiana.Knox),
  z.literal(Timezone.America.Indiana.Marengo),
  z.literal(Timezone.America.Indiana.Petersburg),
  z.literal(Timezone.America.Indiana.Tell_City),
  z.literal(Timezone.America.Indiana.Vevay),
  z.literal(Timezone.America.Indiana.Vincennes),
  z.literal(Timezone.America.Indiana.Winamac),
  z.literal(Timezone.America.Inuvik),
  z.literal(Timezone.America.Iqaluit),
  z.literal(Timezone.America.Jamaica),
  z.literal(Timezone.America.Juneau),
  z.literal(Timezone.America.Kentucky.Louisville),
  z.literal(Timezone.America.Kentucky.Monticello),
  z.literal(Timezone.America.La_Paz),
  z.literal(Timezone.America.Lima),
  z.literal(Timezone.America.Los_Angeles),
  z.literal(Timezone.America.Maceio),
  z.literal(Timezone.America.Managua),
  z.literal(Timezone.America.Manaus),
  z.literal(Timezone.America.Martinique),
  z.literal(Timezone.America.Matamoros),
  z.literal(Timezone.America.Mazatlan),
  z.literal(Timezone.America.Menominee),
  z.literal(Timezone.America.Merida),
  z.literal(Timezone.America.Metlakatla),
  z.literal(Timezone.America.Mexico_City),
  z.literal(Timezone.America.Miquelon),
  z.literal(Timezone.America.Moncton),
  z.literal(Timezone.America.Monterrey),
  z.literal(Timezone.America.Montevideo),
  z.literal(Timezone.America.Nassau),
  z.literal(Timezone.America.New_York),
  z.literal(Timezone.America.Nipigon),
  z.literal(Timezone.America.Nome),
  z.literal(Timezone.America.Noronha),
  z.literal(Timezone.America.North_Dakota.Beulah),
  z.literal(Timezone.America.North_Dakota.Center),
  z.literal(Timezone.America.North_Dakota.New_Salem),
  z.literal(Timezone.America.Nuuk),
  z.literal(Timezone.America.Ojinaga),
  z.literal(Timezone.America.Panama),
  z.literal(Timezone.America.Pangnirtung),
  z.literal(Timezone.America.Paramaribo),
  z.literal(Timezone.America.Phoenix),
  z.literal(Timezone.America.Port_au_Prince),
  z.literal(Timezone.America.Port_of_Spain),
  z.literal(Timezone.America.Porto_Velho),
  z.literal(Timezone.America.Puerto_Rico),
  z.literal(Timezone.America.Punta_Arenas),
  z.literal(Timezone.America.Rainy_River),
  z.literal(Timezone.America.Rankin_Inlet),
  z.literal(Timezone.America.Recife),
  z.literal(Timezone.America.Regina),
  z.literal(Timezone.America.Resolute),
  z.literal(Timezone.America.Rio_Branco),
  z.literal(Timezone.America.Santarem),
  z.literal(Timezone.America.Santiago),
  z.literal(Timezone.America.Santo_Domingo),
  z.literal(Timezone.America.Sao_Paulo),
  z.literal(Timezone.America.Scoresbysund),
  z.literal(Timezone.America.Sitka),
  z.literal(Timezone.America.St_Johns),
  z.literal(Timezone.America.Swift_Current),
  z.literal(Timezone.America.Tegucigalpa),
  z.literal(Timezone.America.Thule),
  z.literal(Timezone.America.Thunder_Bay),
  z.literal(Timezone.America.Tijuana),
  z.literal(Timezone.America.Toronto),
  z.literal(Timezone.America.Vancouver),
  z.literal(Timezone.America.Whitehorse),
  z.literal(Timezone.America.Winnipeg),
  z.literal(Timezone.America.Yakutat),
  z.literal(Timezone.America.Yellowknife),

  // Antarctica
  z.literal(Timezone.Antarctica.Casey),
  z.literal(Timezone.Antarctica.Davis),
  z.literal(Timezone.Antarctica.DumontDUrville),
  z.literal(Timezone.Antarctica.Macquarie),
  z.literal(Timezone.Antarctica.Mawson),
  z.literal(Timezone.Antarctica.McMurdo),
  z.literal(Timezone.Antarctica.Palmer),
  z.literal(Timezone.Antarctica.Rothera),
  z.literal(Timezone.Antarctica.Syowa),
  z.literal(Timezone.Antarctica.Troll),
  z.literal(Timezone.Antarctica.Vostok),

  // Asia
  z.literal(Timezone.Asia.Almaty),
  z.literal(Timezone.Asia.Amman),
  z.literal(Timezone.Asia.Anadyr),
  z.literal(Timezone.Asia.Aqtau),
  z.literal(Timezone.Asia.Aqtobe),
  z.literal(Timezone.Asia.Ashgabat),
  z.literal(Timezone.Asia.Atyrau),
  z.literal(Timezone.Asia.Baghdad),
  z.literal(Timezone.Asia.Baku),
  z.literal(Timezone.Asia.Bangkok),
  z.literal(Timezone.Asia.Barnaul),
  z.literal(Timezone.Asia.Beirut),
  z.literal(Timezone.Asia.Bishkek),
  z.literal(Timezone.Asia.Brunei),
  z.literal(Timezone.Asia.Chita),
  z.literal(Timezone.Asia.Choibalsan),
  z.literal(Timezone.Asia.Colombo),
  z.literal(Timezone.Asia.Damascus),
  z.literal(Timezone.Asia.Dhaka),
  z.literal(Timezone.Asia.Dili),
  z.literal(Timezone.Asia.Dubai),
  z.literal(Timezone.Asia.Dushanbe),
  z.literal(Timezone.Asia.Famagusta),
  z.literal(Timezone.Asia.Gaza),
  z.literal(Timezone.Asia.Hebron),
  z.literal(Timezone.Asia.Ho_Chi_Minh),
  z.literal(Timezone.Asia.Hong_Kong),
  z.literal(Timezone.Asia.Hovd),
  z.literal(Timezone.Asia.Irkutsk),
  z.literal(Timezone.Asia.Jakarta),
  z.literal(Timezone.Asia.Jayapura),
  z.literal(Timezone.Asia.Jerusalem),
  z.literal(Timezone.Asia.Kabul),
  z.literal(Timezone.Asia.Kamchatka),
  z.literal(Timezone.Asia.Karachi),
  z.literal(Timezone.Asia.Kathmandu),
  z.literal(Timezone.Asia.Khandyga),
  z.literal(Timezone.Asia.Kolkata),
  z.literal(Timezone.Asia.Krasnoyarsk),
  z.literal(Timezone.Asia.Kuala_Lumpur),
  z.literal(Timezone.Asia.Kuching),
  z.literal(Timezone.Asia.Macau),
  z.literal(Timezone.Asia.Magadan),
  z.literal(Timezone.Asia.Makassar),
  z.literal(Timezone.Asia.Manila),
  z.literal(Timezone.Asia.Nicosia),
  z.literal(Timezone.Asia.Novokuznetsk),
  z.literal(Timezone.Asia.Novosibirsk),
  z.literal(Timezone.Asia.Omsk),
  z.literal(Timezone.Asia.Oral),
  z.literal(Timezone.Asia.Pontianak),
  z.literal(Timezone.Asia.Pyongyang),
  z.literal(Timezone.Asia.Qatar),
  z.literal(Timezone.Asia.Qostanay),
  z.literal(Timezone.Asia.Qyzylorda),
  z.literal(Timezone.Asia.Riyadh),
  z.literal(Timezone.Asia.Sakhalin),
  z.literal(Timezone.Asia.Samarkand),
  z.literal(Timezone.Asia.Seoul),
  z.literal(Timezone.Asia.Shanghai),
  z.literal(Timezone.Asia.Singapore),
  z.literal(Timezone.Asia.Srednekolymsk),
  z.literal(Timezone.Asia.Taipei),
  z.literal(Timezone.Asia.Tashkent),
  z.literal(Timezone.Asia.Tbilisi),
  z.literal(Timezone.Asia.Tehran),
  z.literal(Timezone.Asia.Thimphu),
  z.literal(Timezone.Asia.Tokyo),
  z.literal(Timezone.Asia.Tomsk),
  z.literal(Timezone.Asia.Ulaanbaatar),
  z.literal(Timezone.Asia.Urumqi),
  z.literal(Timezone.Asia.Ust_Nera),
  z.literal(Timezone.Asia.Vladivostok),
  z.literal(Timezone.Asia.Yakutsk),
  z.literal(Timezone.Asia.Yangon),
  z.literal(Timezone.Asia.Yekaterinburg),
  z.literal(Timezone.Asia.Yerevan),

  // Atlantic
  z.literal(Timezone.Atlantic.Azores),
  z.literal(Timezone.Atlantic.Bermuda),
  z.literal(Timezone.Atlantic.Canary),
  z.literal(Timezone.Atlantic.Cape_Verde),
  z.literal(Timezone.Atlantic.Faroe),
  z.literal(Timezone.Atlantic.Madeira),
  z.literal(Timezone.Atlantic.Reykjavik),
  z.literal(Timezone.Atlantic.South_Georgia),
  z.literal(Timezone.Atlantic.Stanley),
  z.literal(Timezone.Atlantic.St_Helena),

  // Australia
  z.literal(Timezone.Australia.Adelaide),
  z.literal(Timezone.Australia.Brisbane),
  z.literal(Timezone.Australia.Broken_Hill),
  z.literal(Timezone.Australia.Darwin),
  z.literal(Timezone.Australia.Eucla),
  z.literal(Timezone.Australia.Hobart),
  z.literal(Timezone.Australia.Lindeman),
  z.literal(Timezone.Australia.Lord_Howe),
  z.literal(Timezone.Australia.Melbourne),
  z.literal(Timezone.Australia.Perth),
  z.literal(Timezone.Australia.Sydney),

  // Europe
  z.literal(Timezone.Europe.Amsterdam),
  z.literal(Timezone.Europe.Andorra),
  z.literal(Timezone.Europe.Astrakhan),
  z.literal(Timezone.Europe.Athens),
  z.literal(Timezone.Europe.Belgrade),
  z.literal(Timezone.Europe.Berlin),
  z.literal(Timezone.Europe.Brussels),
  z.literal(Timezone.Europe.Bucharest),
  z.literal(Timezone.Europe.Budapest),
  z.literal(Timezone.Europe.Chisinau),
  z.literal(Timezone.Europe.Copenhagen),
  z.literal(Timezone.Europe.Dublin),
  z.literal(Timezone.Europe.Gibraltar),
  z.literal(Timezone.Europe.Helsinki),
  z.literal(Timezone.Europe.Istanbul),
  z.literal(Timezone.Europe.Kaliningrad),
  z.literal(Timezone.Europe.Kiev),
  z.literal(Timezone.Europe.Kirov),
  z.literal(Timezone.Europe.Lisbon),
  z.literal(Timezone.Europe.London),
  z.literal(Timezone.Europe.Luxembourg),
  z.literal(Timezone.Europe.Madrid),
  z.literal(Timezone.Europe.Malta),
  z.literal(Timezone.Europe.Minsk),
  z.literal(Timezone.Europe.Monaco),
  z.literal(Timezone.Europe.Moscow),
  z.literal(Timezone.Europe.Oslo),
  z.literal(Timezone.Europe.Paris),
  z.literal(Timezone.Europe.Prague),
  z.literal(Timezone.Europe.Riga),
  z.literal(Timezone.Europe.Rome),
  z.literal(Timezone.Europe.Samara),
  z.literal(Timezone.Europe.Saratov),
  z.literal(Timezone.Europe.Simferopol),
  z.literal(Timezone.Europe.Sofia),
  z.literal(Timezone.Europe.Stockholm),
  z.literal(Timezone.Europe.Tallinn),
  z.literal(Timezone.Europe.Tirane),
  z.literal(Timezone.Europe.Ulyanovsk),
  z.literal(Timezone.Europe.Uzhgorod),
  z.literal(Timezone.Europe.Vienna),
  z.literal(Timezone.Europe.Vilnius),
  z.literal(Timezone.Europe.Volgograd),
  z.literal(Timezone.Europe.Warsaw),
  z.literal(Timezone.Europe.Zaporozhye),
  z.literal(Timezone.Europe.Zurich),

  // Indian
  z.literal(Timezone.Indian.Chagos),
  z.literal(Timezone.Indian.Christmas),
  z.literal(Timezone.Indian.Cocos),
  z.literal(Timezone.Indian.Kerguelen),
  z.literal(Timezone.Indian.Mahe),
  z.literal(Timezone.Indian.Maldives),
  z.literal(Timezone.Indian.Mauritius),
  z.literal(Timezone.Indian.Reunion),

  // Pacific
  z.literal(Timezone.Pacific.Apia),
  z.literal(Timezone.Pacific.Auckland),
  z.literal(Timezone.Pacific.Bougainville),
  z.literal(Timezone.Pacific.Chatham),
  z.literal(Timezone.Pacific.Chuuk),
  z.literal(Timezone.Pacific.Easter),
  z.literal(Timezone.Pacific.Efate),
  z.literal(Timezone.Pacific.Enderbury),
  z.literal(Timezone.Pacific.Fakaofo),
  z.literal(Timezone.Pacific.Fiji),
  z.literal(Timezone.Pacific.Funafuti),
  z.literal(Timezone.Pacific.Galapagos),
  z.literal(Timezone.Pacific.Gambier),
  z.literal(Timezone.Pacific.Guadalcanal),
  z.literal(Timezone.Pacific.Guam),
  z.literal(Timezone.Pacific.Honolulu),
  z.literal(Timezone.Pacific.Kiritimati),
  z.literal(Timezone.Pacific.Kosrae),
  z.literal(Timezone.Pacific.Kwajalein),
  z.literal(Timezone.Pacific.Majuro),
  z.literal(Timezone.Pacific.Marquesas),
  z.literal(Timezone.Pacific.Nauru),
  z.literal(Timezone.Pacific.Niue),
  z.literal(Timezone.Pacific.Norfolk),
  z.literal(Timezone.Pacific.Noumea),
  z.literal(Timezone.Pacific.Pago_Pago),
  z.literal(Timezone.Pacific.Palau),
  z.literal(Timezone.Pacific.Pitcairn),
  z.literal(Timezone.Pacific.Pohnpei),
  z.literal(Timezone.Pacific.Port_Moresby),
  z.literal(Timezone.Pacific.Rarotonga),
  z.literal(Timezone.Pacific.Tahiti),
  z.literal(Timezone.Pacific.Tarawa),
  z.literal(Timezone.Pacific.Tongatapu),
  z.literal(Timezone.Pacific.Wake),
  z.literal(Timezone.Pacific.Wallis),

  // Etc
  z.literal(Timezone.GMT),
  z.literal(Timezone.UTC),
]);

/**
 * Type representing all valid IANA timezone strings.
 * This type is inferred from the TimezoneSchema and provides type safety
 * when working with timezone strings in TypeScript.
 *
 * @example
 * ```typescript
 * function setUserTimezone(timezone: Timezone) {
 *   // TypeScript will ensure only valid timezones are passed
 *   // ...
 * }
 * ```
 */
export type Timezone = z.infer<typeof TimezoneSchema>;
