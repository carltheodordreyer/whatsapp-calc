// Tabela de preços Manychat (Cloud API) — USD por mensagem
// Fonte: help.manychat.com WhatsApp pricing guide — tarifas vigentes desde 01/07/2026.
// Manychat cobra por bloco regional (Rest of Latin America, North America, Rest of Asia
// Pacific, Rest of Central & Eastern Europe, Rest of Middle East, Rest of Western Europe,
// Rest of Africa, Other) para países sem tarifa própria — mapeado abaixo por país.

export const MANYCHAT_PRICING: Record<string, { mkt: number; util: number }> = {
  BR: { mkt:0.0718, util:0.0078 },
  AR: { mkt:0.0710, util:0.0299 },
  MX: { mkt:0.0351, util:0.0098 },
  CL: { mkt:0.1022, util:0.0230 },
  CO: { mkt:0.0144, util:0.0009 },
  PE: { mkt:0.0808, util:0.0230 },
  // Rest of Latin America
  UY: { mkt:0.0851, util:0.0130 },
  PY: { mkt:0.0851, util:0.0130 },
  BO: { mkt:0.0851, util:0.0130 },
  EC: { mkt:0.0851, util:0.0130 },
  VE: { mkt:0.0851, util:0.0130 },
  CR: { mkt:0.0851, util:0.0130 },
  PA: { mkt:0.0851, util:0.0130 },
  DO: { mkt:0.0851, util:0.0130 },
  GT: { mkt:0.0851, util:0.0130 },
  HN: { mkt:0.0851, util:0.0130 },
  SV: { mkt:0.0851, util:0.0130 },
  NI: { mkt:0.0851, util:0.0130 },
  PR: { mkt:0.0851, util:0.0130 },
  CU: { mkt:0.0694, util:0.0089 }, // fora dos blocos oficiais -> "Other"
  // North America
  US: { mkt:0.0287, util:0.0039 },
  CA: { mkt:0.0287, util:0.0039 },
  GB: { mkt:0.0730, util:0.0253 },
  DE: { mkt:0.1569, util:0.0632 },
  FR: { mkt:0.0987, util:0.0345 },
  IT: { mkt:0.0914, util:0.0345 },
  ES: { mkt:0.0813, util:0.0230 },
  NL: { mkt:0.1836, util:0.0575 },
  // Rest of Western Europe
  PT: { mkt:0.0680, util:0.0197 },
  BE: { mkt:0.0680, util:0.0197 },
  CH: { mkt:0.0680, util:0.0197 },
  AT: { mkt:0.0680, util:0.0197 },
  IE: { mkt:0.0680, util:0.0197 },
  DK: { mkt:0.0680, util:0.0197 },
  NO: { mkt:0.0680, util:0.0197 },
  SE: { mkt:0.0680, util:0.0197 },
  FI: { mkt:0.0680, util:0.0197 },
  PL: { mkt:0.0421, util:0.0140 },
  HU: { mkt:0.0989, util:0.0402 },
  RO: { mkt:0.0989, util:0.0333 },
  RU: { mkt:0.0922, util:0.0460 },
  TR: { mkt:0.0125, util:0.0010 },
  // Rest of Central & Eastern Europe
  CZ: { mkt:0.0989, util:0.0244 },
  BG: { mkt:0.0989, util:0.0244 },
  SK: { mkt:0.0989, util:0.0244 },
  HR: { mkt:0.0989, util:0.0244 },
  SI: { mkt:0.0989, util:0.0244 },
  UA: { mkt:0.0989, util:0.0244 },
  GR: { mkt:0.0989, util:0.0244 },
  IN: { mkt:0.0136, util:0.0016 },
  ID: { mkt:0.0472, util:0.0287 },
  MY: { mkt:0.0989, util:0.0161 },
  SG: { mkt:0.0841, util:0.0184 },
  HK: { mkt:0.0841, util:0.0299 },
  PK: { mkt:0.0544, util:0.0115 },
  // Rest of Asia Pacific
  PH: { mkt:0.0841, util:0.0130 },
  TH: { mkt:0.0841, util:0.0130 },
  VN: { mkt:0.0841, util:0.0130 },
  AU: { mkt:0.0841, util:0.0130 },
  NZ: { mkt:0.0841, util:0.0130 },
  JP: { mkt:0.0841, util:0.0130 },
  CN: { mkt:0.0841, util:0.0130 },
  TW: { mkt:0.0841, util:0.0130 },
  BD: { mkt:0.0841, util:0.0130 },
  LK: { mkt:0.0841, util:0.0130 },
  KR: { mkt:0.0694, util:0.0089 }, // Coreia do Sul não consta em nenhum bloco Manychat -> "Other"
  SA: { mkt:0.0576, util:0.0123 },
  AE: { mkt:0.0574, util:0.0180 },
  IL: { mkt:0.0406, util:0.0061 },
  EG: { mkt:0.0740, util:0.0041 },
  QA: { mkt:0.0392, util:0.0138 },
  // Rest of Middle East
  KW: { mkt:0.0392, util:0.0105 },
  BH: { mkt:0.0392, util:0.0105 },
  OM: { mkt:0.0392, util:0.0105 },
  JO: { mkt:0.0392, util:0.0105 },
  LB: { mkt:0.0392, util:0.0105 },
  NG: { mkt:0.0593, util:0.0077 },
  ZA: { mkt:0.0436, util:0.0087 },
  // Rest of Africa
  KE: { mkt:0.0259, util:0.0046 },
  GH: { mkt:0.0259, util:0.0046 },
  MA: { mkt:0.0259, util:0.0046 },
  TZ: { mkt:0.0259, util:0.0046 },
  UG: { mkt:0.0259, util:0.0046 },
  _other: { mkt:0.0694, util:0.0089 },
};

export function getManyPrice(cc: string, type: 'mkt' | 'util'): number {
  const p = MANYCHAT_PRICING[cc.toUpperCase()] || MANYCHAT_PRICING._other;
  return p[type];
}
