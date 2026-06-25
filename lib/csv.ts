// Parser de CSV com auto-detecção de separador (vírgula ou ponto-e-vírgula)
// Aceita header "country_code", "country" ou "cc"

export type Contact = { cc: string };

function detectSeparator(line: string): string {
  const commas = (line.match(/,/g) || []).length;
  const semicolons = (line.match(/;/g) || []).length;
  return semicolons > commas ? ';' : ',';
}

export function parseCSV(text: string): { contacts: Contact[] } {
  // Remove BOM se houver
  const clean = text.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) throw new Error('CSV vazio ou inválido');

  const separator = detectSeparator(lines[0]);
  const header = lines[0].split(separator).map(h => h.trim().replace(/['"]/g, '').toLowerCase());

  const ccIdx = header.findIndex(h =>
    h === 'country_code' || h === 'country' || h === 'cc' ||
    h === 'pais' || h === 'país' || h === 'codigo_pais' || h === 'codigopais'
  );

  if (ccIdx < 0) {
    throw new Error('Coluna country_code não encontrada. Cabeçalhos: ' + header.join(', '));
  }

  const contacts: Contact[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(separator).map(c => c.trim().replace(/['"]/g, ''));
    const cc = (cells[ccIdx] || '').toUpperCase();
    if (cc) contacts.push({ cc });
  }
  return { contacts };
}
