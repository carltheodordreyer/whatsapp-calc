// Tabela de preços Meta API oficial (jul/2026+) — USD por mensagem
// Fonte: business.whatsapp.com/products/platform-pricing (API interna wp-json/wab/v1/pricing)
// Apenas Marketing e Utility. country_code (ISO 2) -> { name, flag, mkt, util }
// Países sem tarifa própria usam a tarifa do bloco regional da Meta (ex.: LATAM, WEU, CEEU, APAC, MDE, AFR).

export type CountryPricing = {
  name: string;
  flag: string;
  mkt: number;
  util: number;
};

export const META_PRICING: Record<string, CountryPricing> = {
  // América Latina
  BR: { name:'Brazil',        flag:'🇧🇷', mkt:0.0625, util:0.0068 },
  AR: { name:'Argentina',     flag:'🇦🇷', mkt:0.0618, util:0.0260 },
  MX: { name:'Mexico',        flag:'🇲🇽', mkt:0.0305, util:0.0085 },
  CL: { name:'Chile',         flag:'🇨🇱', mkt:0.0889, util:0.0200 },
  CO: { name:'Colombia',      flag:'🇨🇴', mkt:0.0125, util:0.0008 },
  PE: { name:'Peru',          flag:'🇵🇪', mkt:0.0703, util:0.0200 },
  // Rest of Latin America (bloco regional)
  UY: { name:'Uruguay',       flag:'🇺🇾', mkt:0.0740, util:0.0113 },
  PY: { name:'Paraguay',      flag:'🇵🇾', mkt:0.0740, util:0.0113 },
  BO: { name:'Bolivia',       flag:'🇧🇴', mkt:0.0740, util:0.0113 },
  EC: { name:'Ecuador',       flag:'🇪🇨', mkt:0.0740, util:0.0113 },
  VE: { name:'Venezuela',     flag:'🇻🇪', mkt:0.0740, util:0.0113 },
  CR: { name:'Costa Rica',    flag:'🇨🇷', mkt:0.0740, util:0.0113 },
  PA: { name:'Panama',        flag:'🇵🇦', mkt:0.0740, util:0.0113 },
  DO: { name:'Dominican Rep.',flag:'🇩🇴', mkt:0.0740, util:0.0113 },
  GT: { name:'Guatemala',     flag:'🇬🇹', mkt:0.0740, util:0.0113 },
  HN: { name:'Honduras',      flag:'🇭🇳', mkt:0.0740, util:0.0113 },
  SV: { name:'El Salvador',   flag:'🇸🇻', mkt:0.0740, util:0.0113 },
  NI: { name:'Nicaragua',     flag:'🇳🇮', mkt:0.0740, util:0.0113 },
  PR: { name:'Puerto Rico',   flag:'🇵🇷', mkt:0.0740, util:0.0113 },
  CU: { name:'Cuba',          flag:'🇨🇺', mkt:0.0604, util:0.0077 }, // fora dos blocos oficiais -> usa "Outro"
  // América do Norte
  US: { name:'United States', flag:'🇺🇸', mkt:0.0250, util:0.0034 },
  CA: { name:'Canada',        flag:'🇨🇦', mkt:0.0250, util:0.0034 },
  // Europa Ocidental
  GB: { name:'United Kingdom',flag:'🇬🇧', mkt:0.0635, util:0.0220 },
  DE: { name:'Germany',       flag:'🇩🇪', mkt:0.1365, util:0.0550 },
  FR: { name:'France',        flag:'🇫🇷', mkt:0.0859, util:0.0300 },
  IT: { name:'Italy',         flag:'🇮🇹', mkt:0.0795, util:0.0300 },
  ES: { name:'Spain',         flag:'🇪🇸', mkt:0.0707, util:0.0200 },
  NL: { name:'Netherlands',   flag:'🇳🇱', mkt:0.1597, util:0.0500 },
  // Rest of Western Europe (bloco regional)
  PT: { name:'Portugal',      flag:'🇵🇹', mkt:0.0592, util:0.0171 },
  BE: { name:'Belgium',       flag:'🇧🇪', mkt:0.0592, util:0.0171 },
  CH: { name:'Switzerland',   flag:'🇨🇭', mkt:0.0592, util:0.0171 },
  AT: { name:'Austria',       flag:'🇦🇹', mkt:0.0592, util:0.0171 },
  IE: { name:'Ireland',       flag:'🇮🇪', mkt:0.0592, util:0.0171 },
  DK: { name:'Denmark',       flag:'🇩🇰', mkt:0.0592, util:0.0171 },
  NO: { name:'Norway',        flag:'🇳🇴', mkt:0.0592, util:0.0171 },
  SE: { name:'Sweden',        flag:'🇸🇪', mkt:0.0592, util:0.0171 },
  FI: { name:'Finland',       flag:'🇫🇮', mkt:0.0592, util:0.0171 },
  // Europa Central/Oriental
  PL: { name:'Poland',        flag:'🇵🇱', mkt:0.0366, util:0.0122 },
  HU: { name:'Hungary',       flag:'🇭🇺', mkt:0.0860, util:0.0350 },
  RO: { name:'Romania',       flag:'🇷🇴', mkt:0.0860, util:0.0290 },
  RU: { name:'Russia',        flag:'🇷🇺', mkt:0.0802, util:0.0400 },
  TR: { name:'Turkey',        flag:'🇹🇷', mkt:0.0109, util:0.0009 },
  // Rest of Central & Eastern Europe (bloco regional)
  CZ: { name:'Czechia',       flag:'🇨🇿', mkt:0.0860, util:0.0212 },
  BG: { name:'Bulgaria',      flag:'🇧🇬', mkt:0.0860, util:0.0212 },
  SK: { name:'Slovakia',      flag:'🇸🇰', mkt:0.0860, util:0.0212 },
  HR: { name:'Croatia',       flag:'🇭🇷', mkt:0.0860, util:0.0212 },
  SI: { name:'Slovenia',      flag:'🇸🇮', mkt:0.0860, util:0.0212 },
  UA: { name:'Ukraine',       flag:'🇺🇦', mkt:0.0860, util:0.0212 },
  GR: { name:'Greece',        flag:'🇬🇷', mkt:0.0860, util:0.0212 },
  // Ásia & Pacífico
  IN: { name:'India',         flag:'🇮🇳', mkt:0.0118, util:0.0014 },
  ID: { name:'Indonesia',     flag:'🇮🇩', mkt:0.0411, util:0.0250 },
  MY: { name:'Malaysia',      flag:'🇲🇾', mkt:0.0860, util:0.0140 },
  SG: { name:'Singapore',     flag:'🇸🇬', mkt:0.0732, util:0.0160 },
  HK: { name:'Hong Kong',     flag:'🇭🇰', mkt:0.0732, util:0.0260 },
  PK: { name:'Pakistan',      flag:'🇵🇰', mkt:0.0473, util:0.0100 },
  // Rest of Asia Pacific (bloco regional)
  PH: { name:'Philippines',   flag:'🇵🇭', mkt:0.0732, util:0.0113 },
  TH: { name:'Thailand',      flag:'🇹🇭', mkt:0.0732, util:0.0113 },
  VN: { name:'Vietnam',       flag:'🇻🇳', mkt:0.0732, util:0.0113 },
  AU: { name:'Australia',     flag:'🇦🇺', mkt:0.0732, util:0.0113 },
  NZ: { name:'New Zealand',   flag:'🇳🇿', mkt:0.0732, util:0.0113 },
  JP: { name:'Japan',         flag:'🇯🇵', mkt:0.0732, util:0.0113 },
  CN: { name:'China',         flag:'🇨🇳', mkt:0.0732, util:0.0113 },
  TW: { name:'Taiwan',        flag:'🇹🇼', mkt:0.0732, util:0.0113 },
  KR: { name:'South Korea',   flag:'🇰🇷', mkt:0.0732, util:0.0113 },
  BD: { name:'Bangladesh',    flag:'🇧🇩', mkt:0.0732, util:0.0113 },
  LK: { name:'Sri Lanka',     flag:'🇱🇰', mkt:0.0732, util:0.0113 },
  // Oriente Médio
  SA: { name:'Saudi Arabia',  flag:'🇸🇦', mkt:0.0501, util:0.0107 },
  AE: { name:'UAE',           flag:'🇦🇪', mkt:0.0499, util:0.0157 },
  IL: { name:'Israel',        flag:'🇮🇱', mkt:0.0353, util:0.0053 },
  EG: { name:'Egypt',         flag:'🇪🇬', mkt:0.0644, util:0.0036 },
  QA: { name:'Qatar',         flag:'🇶🇦', mkt:0.0341, util:0.0120 },
  // Rest of Middle East (bloco regional)
  KW: { name:'Kuwait',        flag:'🇰🇼', mkt:0.0341, util:0.0091 },
  BH: { name:'Bahrain',       flag:'🇧🇭', mkt:0.0341, util:0.0091 },
  OM: { name:'Oman',          flag:'🇴🇲', mkt:0.0341, util:0.0091 },
  JO: { name:'Jordan',        flag:'🇯🇴', mkt:0.0341, util:0.0091 },
  LB: { name:'Lebanon',       flag:'🇱🇧', mkt:0.0341, util:0.0091 },
  // África
  NG: { name:'Nigeria',       flag:'🇳🇬', mkt:0.0516, util:0.0067 },
  ZA: { name:'South Africa',  flag:'🇿🇦', mkt:0.0379, util:0.0076 },
  // Rest of Africa (bloco regional)
  KE: { name:'Kenya',         flag:'🇰🇪', mkt:0.0225, util:0.0040 },
  GH: { name:'Ghana',         flag:'🇬🇭', mkt:0.0225, util:0.0040 },
  MA: { name:'Morocco',       flag:'🇲🇦', mkt:0.0225, util:0.0040 },
  TZ: { name:'Tanzania',      flag:'🇹🇿', mkt:0.0225, util:0.0040 },
  UG: { name:'Uganda',        flag:'🇺🇬', mkt:0.0225, util:0.0040 },
  // Fallback "Outro" (só usado se país não estiver acima)
  _other: { name:'Outros países', flag:'🌐', mkt:0.0604, util:0.0077 },
};

export function getMetaPrice(cc: string, type: 'mkt' | 'util'): number {
  const p = META_PRICING[cc.toUpperCase()] || META_PRICING._other;
  return p[type];
}

export function getMetaCountryInfo(cc: string) {
  return META_PRICING[cc.toUpperCase()] || META_PRICING._other;
}
