import { NextResponse } from 'next/server'

// Cache curto (5 min) pra cotação ficar atualizada
export const revalidate = 300

export async function GET() {
  try {
    const r = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=BRL', {
      next: { revalidate: 300 },
      headers: { 'Accept': 'application/json' }
    })
    if (!r.ok) throw new Error(`frankfurter returned ${r.status}`)
    const d = await r.json()
    const rate = d.rates?.BRL
    if (!rate || rate <= 0) throw new Error('invalid rate')
    return NextResponse.json({
      rate,
      date: d.date,
      provider: 'frankfurter.dev'
    }, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' }
    })
  } catch (e) {
    // Fallback: usar cotação padrão conhecida
    return NextResponse.json({
      rate: 5.0,
      date: null,
      provider: 'fallback'
    }, {
      headers: { 'Cache-Control': 'no-store' }
    })
  }
}
