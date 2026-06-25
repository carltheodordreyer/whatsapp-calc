// Tabela de preços Meta API oficial (jul/2025+) — USD por mensagem
// Apenas Marketing e Utility. country_code (ISO 2) -> { name, flag, mkt, util }

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
  UY: { name:'Uruguay',       flag:'🇺🇾', mkt:0.0600, util:0.0110 },
  PY: { name:'Paraguay',      flag:'🇵🇾', mkt:0.0700, util:0.0110 },
  BO: { name:'Bolivia',       flag:'🇧🇴', mkt:0.0700, util:0.0110 },
  EC: { name:'Ecuador',       flag:'🇪🇨', mkt:0.0600, util:0.0110 },
  VE: { name:'Venezuela',     flag:'🇻🇪', mkt:0.0700, util:0.0110 },
  CR: { name:'Costa Rica',    flag:'🇨🇷', mkt:0.0600, util:0.0110 },
  PA: { name:'Panama',        flag:'🇵🇦', mkt:0.0600, util:0.0110 },
  DO: { name:'Dominican Rep.',flag:'🇩🇴', mkt:0.0600, util:0.0110 },
  GT: { name:'Guatemala',     flag:'🇬🇹', mkt:0.0600, util:0.0110 },
  HN: { name:'Honduras',      flag:'🇭🇳', mkt:0.0600, util:0.0110 },
  SV: { name:'El Salvador',   flag:'🇸🇻', mkt:0.0600, util:0.0110 },
  NI: { name:'Nicaragua',     flag:'🇳🇮', mkt:0.0600, util:0.0110 },
  PR: { name:'Puerto Rico',   flag:'🇵🇷', mkt:0.0250, util:0.0110 },
  CU: { name:'Cuba',          flag:'🇨🇺', mkt:0.0600, util:0.0110 },
  // América do Norte
  US: { name:'United States', flag:'🇺🇸', mkt:0.0250, util:0.0040 },
  CA: { name:'Canada',        flag:'🇨🇦', mkt:0.0250, util:0.0040 },
  // Europa Ocidental
  GB: { name:'United Kingdom',flag:'🇬🇧', mkt:0.0382, util:0.0159 },
  DE: { name:'Germany',       flag:'🇩🇪', mkt:0.1131, util:0.0456 },
  FR: { name:'France',        flag:'🇫🇷', mkt:0.1186, util:0.0248 },
  IT: { name:'Italy',         flag:'🇮🇹', mkt:0.0572, util:0.0248 },
  ES: { name:'Spain',         flag:'🇪🇸', mkt:0.0509, util:0.0166 },
  NL: { name:'Netherlands',   flag:'🇳🇱', mkt:0.1323, util:0.0414 },
  PT: { name:'Portugal',      flag:'🇵🇹', mkt:0.0450, util:0.0150 },
  BE: { name:'Belgium',       flag:'🇧🇪', mkt:0.0800, util:0.0250 },
  CH: { name:'Switzerland',   flag:'🇨🇭', mkt:0.0900, util:0.0300 },
  AT: { name:'Austria',       flag:'🇦🇹', mkt:0.0800, util:0.0250 },
  IE: { name:'Ireland',       flag:'🇮🇪', mkt:0.0700, util:0.0200 },
  DK: { name:'Denmark',       flag:'🇩🇰', mkt:0.0700, util:0.0200 },
  NO: { name:'Norway',        flag:'🇳🇴', mkt:0.0800, util:0.0250 },
  SE: { name:'Sweden',        flag:'🇸🇪', mkt:0.0700, util:0.0200 },
  FI: { name:'Finland',       flag:'🇫🇮', mkt:0.0700, util:0.0200 },
  GR: { name:'Greece',        flag:'🇬🇷', mkt:0.0500, util:0.0170 },
  // Europa Central/Oriental
  PL: { name:'Poland',        flag:'🇵🇱', mkt:0.0500, util:0.0150 },
  CZ: { name:'Czechia',       flag:'🇨🇿', mkt:0.0500, util:0.0150 },
  HU: { name:'Hungary',       flag:'🇭🇺', mkt:0.0500, util:0.0150 },
  RO: { name:'Romania',       flag:'🇷🇴', mkt:0.0500, util:0.0150 },
  BG: { name:'Bulgaria',      flag:'🇧🇬', mkt:0.0500, util:0.0150 },
  SK: { name:'Slovakia',      flag:'🇸🇰', mkt:0.0500, util:0.0150 },
  HR: { name:'Croatia',       flag:'🇭🇷', mkt:0.0500, util:0.0150 },
  SI: { name:'Slovenia',      flag:'🇸🇮', mkt:0.0500, util:0.0150 },
  UA: { name:'Ukraine',       flag:'🇺🇦', mkt:0.0500, util:0.0150 },
  RU: { name:'Russia',        flag:'🇷🇺', mkt:0.0802, util:0.0400 },
  TR: { name:'Turkey',        flag:'🇹🇷', mkt:0.0109, util:0.0053 },
  // Ásia & Pacífico
  IN: { name:'India',         flag:'🇮🇳', mkt:0.0094, util:0.0014 },
  ID: { name:'Indonesia',     flag:'🇮🇩', mkt:0.0360, util:0.0220 },
  MY: { name:'Malaysia',      flag:'🇲🇾', mkt:0.0860, util:0.0140 },
  PH: { name:'Philippines',   flag:'🇵🇭', mkt:0.0500, util:0.0110 },
  SG: { name:'Singapore',     flag:'🇸🇬', mkt:0.0600, util:0.0120 },
  TH: { name:'Thailand',      flag:'🇹🇭', mkt:0.0500, util:0.0110 },
  VN: { name:'Vietnam',       flag:'🇻🇳', mkt:0.0500, util:0.0110 },
  AU: { name:'Australia',     flag:'🇦🇺', mkt:0.0600, util:0.0150 },
  NZ: { name:'New Zealand',   flag:'🇳🇿', mkt:0.0600, util:0.0150 },
  JP: { name:'Japan',         flag:'🇯🇵', mkt:0.0700, util:0.0200 },
  CN: { name:'China',         flag:'🇨🇳', mkt:0.0700, util:0.0200 },
  HK: { name:'Hong Kong',     flag:'🇭🇰', mkt:0.0600, util:0.0150 },
  TW: { name:'Taiwan',        flag:'🇹🇼', mkt:0.0600, util:0.0150 },
  KR: { name:'South Korea',   flag:'🇰🇷', mkt:0.0600, util:0.0150 },
  PK: { name:'Pakistan',      flag:'🇵🇰', mkt:0.0473, util:0.0054 },
  BD: { name:'Bangladesh',    flag:'🇧🇩', mkt:0.0500, util:0.0110 },
  LK: { name:'Sri Lanka',     flag:'🇱🇰', mkt:0.0500, util:0.0110 },
  // Oriente Médio
  SA: { name:'Saudi Arabia',  flag:'🇸🇦', mkt:0.0455, util:0.0107 },
  AE: { name:'UAE',           flag:'🇦🇪', mkt:0.0499, util:0.0157 },
  IL: { name:'Israel',        flag:'🇮🇱', mkt:0.0353, util:0.0053 },
  EG: { name:'Egypt',         flag:'🇪🇬', mkt:0.1073, util:0.0036 },
  QA: { name:'Qatar',         flag:'🇶🇦', mkt:0.0400, util:0.0100 },
  KW: { name:'Kuwait',        flag:'🇰🇼', mkt:0.0400, util:0.0100 },
  BH: { name:'Bahrain',       flag:'🇧🇭', mkt:0.0400, util:0.0100 },
  OM: { name:'Oman',          flag:'🇴🇲', mkt:0.0400, util:0.0100 },
  JO: { name:'Jordan',        flag:'🇯🇴', mkt:0.0300, util:0.0090 },
  LB: { name:'Lebanon',       flag:'🇱🇧', mkt:0.0300, util:0.0090 },
  // África
  NG: { name:'Nigeria',       flag:'🇳🇬', mkt:0.0516, util:0.0067 },
  ZA: { name:'South Africa',  flag:'🇿🇦', mkt:0.0379, util:0.0076 },
  KE: { name:'Kenya',         flag:'🇰🇪', mkt:0.0225, util:0.0040 },
  GH: { name:'Ghana',         flag:'🇬🇭', mkt:0.0225, util:0.0040 },
  MA: { name:'Morocco',       flag:'🇲🇦', mkt:0.0225, util:0.0040 },
  TZ: { name:'Tanzania',      flag:'🇹🇿', mkt:0.0225, util:0.0040 },
  UG: { name:'Uganda',        flag:'🇺🇬', mkt:0.0225, util:0.0040 },
  // Fallback (só usado se país não estiver acima)
  _other: { name:'Outros países', flag:'🌐', mkt:0.0604, util:0.0077 },
};

export function getMetaPrice(cc: string, type: 'mkt' | 'util'): number {
  const p = META_PRICING[cc.toUpperCase()] || META_PRICING._other;
  return p[type];
}

export function getMetaCountryInfo(cc: string) {
  return META_PRICING[cc.toUpperCase()] || META_PRICING._other;
}
