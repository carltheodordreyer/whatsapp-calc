'use client'

import { useEffect, useRef, useState } from 'react'
import { META_PRICING, getMetaPrice, getMetaCountryInfo } from '@/lib/pricing/meta'
import { getManyPrice } from '@/lib/pricing/manychat'
import { parseCSV, Contact } from '@/lib/csv'

type Currency = 'BRL' | 'USD'

export default function Calculator() {
  const [currency, setCurrency] = useState<Currency>('BRL')
  const [fxRate, setFxRate] = useState(5.0)
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic')
  const [region, setRegion] = useState('BR')
  const [totalVolume, setTotalVolume] = useState(0)
  const [lastSplitPct, setLastSplitPct] = useState(36)
  const [budgetActive, setBudgetActive] = useState(false)
  const [budget, setBudget] = useState(0)
  const [taxesEnabled, setTaxesEnabled] = useState(false)
  const [pisCofins, setPisCofins] = useState(9.25)
  const [iss, setIss] = useState(2.90)
  const [ticket, setTicket] = useState(497)
  const [conv, setConv] = useState({ cons: 0.5, mod: 2.0, opt: 5.0 })
  const [contacts, setContacts] = useState<Contact[]>([])
  const [useUploadVolume, setUseUploadVolume] = useState(false)
  const [uploadFileName, setUploadFileName] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carrega cotação BRL/USD via API route
  useEffect(() => {
    fetch('/api/fx')
      .then(r => r.json())
      .then(d => { if (d.rate) setFxRate(d.rate) })
      .catch(() => {})
  }, [])

  // Converte emojis em bandeiras (Twemoji)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).twemoji) {
      (window as any).twemoji.parse(document.body, { folder: 'svg', ext: '.svg' })
    }
  }, [region, contacts, reportOpen])

  // Helpers
  const clampVol = (n: number) => isNaN(n) || n < 0 ? 0 : Math.min(10000000, Math.floor(n))
  const fmt = (n: number) => {
    if (isNaN(n) || n === null) n = 0
    const sym = currency === 'BRL' ? 'R$' : '$'
    const abs = Math.abs(n)
    if (abs >= 1e12) return `${sym} ${(n < 0 ? '-' : '')}${(abs/1e9).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi`
    if (abs >= 1e9) return `${sym} ${(n < 0 ? '-' : '')}${(abs/1e9).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} bi`
    return `${sym} ${n < 0 ? '-' : ''}${abs.toLocaleString(currency === 'BRL' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  const toCur = (usd: number) => currency === 'BRL' ? usd * fxRate : usd

  // Volumes efetivos
  const totalContacts = useUploadVolume ? contacts.length : totalVolume
  const mMsgs = totalVolume > 0 || useUploadVolume ? Math.round(totalContacts * lastSplitPct / 100) : 0
  const uMsgs = totalContacts - mMsgs

  // Preços
  const mMkt = getMetaPrice(region, 'mkt')
  const mUtil = getMetaPrice(region, 'util')
  const nMkt = getManyPrice(region, 'mkt')
  const nUtil = getManyPrice(region, 'util')

  // (impostos calculados abaixo, após metaBaseLocal)

  // Handlers
  const onRegionChange = (newRegion: string) => {
    setRegion(newRegion)
  }

  const onTotalSliderInput = (v: string) => {
    const s = parseFloat(v)
    let n = 0
    if (s > 0) {
      const minLog = Math.log(100)
      const maxLog = Math.log(10000000)
      n = Math.min(10000000, Math.round(Math.exp(minLog + (s / 1000) * (maxLog - minLog))))
    }
    setTotalVolume(clampVol(n))
  }
  const onTotalInputChange = (v: string) => {
    setTotalVolume(clampVol(parseInt(v)))
  }
  const onSetTotalVolume = (n: number) => {
    setContacts([])
    setUseUploadVolume(false)
    setTotalVolume(clampVol(n))
  }
  const onCardInputChange = (which: 'mkt' | 'util', v: string) => {
    if (totalContacts === 0 || useUploadVolume) return
    const n = clampVol(parseInt(v) || 0)
    const pct = which === 'mkt' ? (n / totalContacts) * 100 : ((totalContacts - n) / totalContacts) * 100
    setLastSplitPct(Math.min(100, Math.max(0, pct)))
  }
  const setSplit = (pct: number) => {
    setLastSplitPct(pct)
  }
  const clearField = (id: 'mkt' | 'util') => {
    setLastSplitPct(id === 'mkt' ? 0 : 100)
  }
  const resetAll = () => {
    setRegion('BR')
    setTotalVolume(0)
    setContacts([])
    setUseUploadVolume(false)
    setTaxesEnabled(false)
  }

  const toggleBudget = () => {
    setBudgetActive(!budgetActive)
  }
  const applyBudget = () => {
    if (!budgetActive || budget <= 0) return
    const p = getMetaPrice(region, 'mkt')
    const u = getMetaPrice(region, 'util')
    const splitFrac = lastSplitPct / 100
    const avg = p * splitFrac + u * (1 - splitFrac)
    const total = Math.round(budget / (avg * fxRate))
    setTotalVolume(clampVol(total))
  }
  const onBudgetSliderInput = (v: string) => {
    const n = parseInt(v) || 0
    setBudget(n)
    if (budgetActive) applyBudget()
  }

  // CSV upload
  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const { contacts: parsed } = parseCSV(e.target?.result as string)
        setContacts(parsed)
        setUseUploadVolume(true)
        setUploadFileName(file.name)
      } catch (err: any) {
        alert('Erro no CSV: ' + err.message)
      }
    }
    reader.readAsText(file)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0])
  }
  const loadSample = () => {
    const dist: Record<string, number> = { BR: 800, US: 300, MX: 150, CO: 100, AR: 80, PE: 40, CL: 30 }
    const arr: Contact[] = []
    Object.entries(dist).forEach(([cc, n]) => { for (let i = 0; i < n; i++) arr.push({ cc }) })
    setContacts(arr)
    setUseUploadVolume(true)
    setUploadFileName('amostra-1500.csv')
  }

  // ROI
  const stepConv = (s: 'cons' | 'mod' | 'opt', delta: number) => {
    const newVal = Math.max(0, Math.min(100, conv[s] + delta))
    setConv({ ...conv, [s]: newVal })
  }

  // Agrupamento por país (quando há upload)
  const grouped: Record<string, { cc: string; count: number; name: string; flag: string }> = {}
  if (useUploadVolume) {
    for (const c of contacts) {
      if (!grouped[c.cc]) {
        const info = getMetaCountryInfo(c.cc)
        grouped[c.cc] = { cc: c.cc, count: 0, name: info.name, flag: info.flag }
      }
      grouped[c.cc].count++
    }
  }
  // Custos base
  // - Com upload: soma cada país do CSV com seu próprio preço (não depende do dropdown)
  // - Sem upload: usa a região selecionada no dropdown (simulando 1 país)
  let costMetaUSD = 0
  let costManyUSD = 0
  if (useUploadVolume && Object.keys(grouped).length > 0) {
    const splitMktFrac = lastSplitPct / 100
    for (const g of Object.values(grouped)) {
      const mM = Math.round(g.count * splitMktFrac)
      const uM = g.count - mM
      costMetaUSD += getMetaPrice(g.cc, 'mkt') * mM + getMetaPrice(g.cc, 'util') * uM
      costManyUSD += getManyPrice(g.cc, 'mkt') * mM + getManyPrice(g.cc, 'util') * uM
    }
  } else {
    costMetaUSD = mMkt * mMsgs + mUtil * uMsgs
    costManyUSD = nMkt * mMsgs + nUtil * uMsgs
  }
  const metaBaseLocal = toCur(costMetaUSD)
  const manyBaseLocal = toCur(costManyUSD)
  const pisF = 1 + pisCofins / 100
  const issF = 1 + iss / 100
  const taxMul = (taxesEnabled && currency === 'BRL') ? pisF * issF : 1
  const finalTotalLocal = metaBaseLocal * taxMul
  const pisAmt = taxesEnabled ? metaBaseLocal * (pisF - 1) : 0
  const issAmt = taxesEnabled ? (metaBaseLocal * pisF) * (issF - 1) : 0

  // Render
  return (
    <div className="text-[14px] pb-16 lg:pb-12">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-ink-900/85 backdrop-blur-md border-b border-ink-800/60">
        <div className="mx-auto px-5 max-w-5xl">
          <div className="flex items-center justify-between gap-3 py-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-neo-500 flex items-center justify-center shrink-0">
                <span className="text-ink-950 font-bold text-[11px]">⚡</span>
              </div>
              <div className="leading-tight min-w-0">
                <h1 className="text-[13px] sm:text-sm font-semibold text-white tracking-normal truncate">Calculadora de Disparo API oficial do WhatsApp</h1>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <div className="inline-flex rounded-md p-0.5 bg-ink-950 border border-ink-800">
                <button onClick={() => setCurrency('BRL')} className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${currency === 'BRL' ? 'text-ink-950 bg-neo-500' : 'text-ink-400 hover:text-white'}`}>BRL</button>
                <button onClick={() => setCurrency('USD')} className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${currency === 'USD' ? 'text-ink-950 bg-neo-500' : 'text-ink-400 hover:text-white'}`}>USD</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-5 py-8 max-w-5xl">
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-[11px] text-ink-400">
          <div className="flex items-center gap-2">
            <span>Cotação: <span className="num text-ink-200 font-medium">R$ {fxRate.toFixed(4)}</span> / USD</span>
            <span className="text-ink-700">·</span>
            <span className="text-ink-500">frankfurter.dev</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Contatos: <span className="num text-ink-200 font-medium">{totalContacts.toLocaleString('pt-BR')}</span></span>
            <span className="text-ink-700">·</span>
            <span>Países: <span className="num text-ink-200 font-medium">{useUploadVolume ? Object.keys(grouped).length : 1}</span></span>
            <button onClick={resetAll} className="text-ink-500 hover:text-ink-300 text-[10px] font-medium border border-ink-800 rounded px-2 py-0.5 ml-2">Limpar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUNA ESQUERDA */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* 1. Região & Valores */}
            <section className="glass rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-bold">1</span>
                <h2 className="disp font-bold text-white text-sm">Região &amp; Valores</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <select value={region} onChange={e => onRegionChange(e.target.value)} className="flex-1 h-9 px-3 bg-ink-950 border border-ink-700 text-white rounded-lg text-xs font-semibold">
                  <optgroup label="América Latina">
                    <option value="BR">🇧🇷 Brasil</option>
                    <option value="AR">🇦🇷 Argentina</option>
                    <option value="MX">🇲🇽 México</option>
                    <option value="CL">🇨🇱 Chile</option>
                    <option value="CO">🇨🇴 Colômbia</option>
                    <option value="PE">🇵🇪 Peru</option>
                    <option value="UY">🇺🇾 Uruguai</option>
                    <option value="PY">🇵🇾 Paraguai</option>
                    <option value="BO">🇧🇴 Bolívia</option>
                    <option value="EC">🇪🇨 Equador</option>
                    <option value="VE">🇻🇪 Venezuela</option>
                    <option value="CR">🇨🇷 Costa Rica</option>
                    <option value="PA">🇵🇦 Panamá</option>
                    <option value="DO">🇩🇴 Rep. Dominicana</option>
                  </optgroup>
                  <optgroup label="América do Norte">
                    <option value="US">🇺🇸 Estados Unidos</option>
                    <option value="CA">🇨🇦 Canadá</option>
                  </optgroup>
                  <optgroup label="Europa Ocidental">
                    <option value="GB">🇬🇧 Reino Unido</option>
                    <option value="DE">🇩🇪 Alemanha</option>
                    <option value="FR">🇫🇷 França</option>
                    <option value="IT">🇮🇹 Itália</option>
                    <option value="ES">🇪🇸 Espanha</option>
                    <option value="NL">🇳🇱 Holanda</option>
                    <option value="PT">🇵🇹 Portugal</option>
                  </optgroup>
                  <optgroup label="Europa C/O">
                    <option value="PL">🇵🇱 Polônia</option>
                    <option value="CZ">🇨🇿 Tchéquia</option>
                    <option value="RO">🇷🇴 Romênia</option>
                    <option value="UA">🇺🇦 Ucrânia</option>
                    <option value="RU">🇷🇺 Rússia</option>
                    <option value="TR">🇹🇷 Turquia</option>
                  </optgroup>
                  <optgroup label="Ásia &amp; Pacífico">
                    <option value="IN">🇮🇳 Índia</option>
                    <option value="ID">🇮🇩 Indonésia</option>
                    <option value="MY">🇲🇾 Malásia</option>
                    <option value="PH">🇵🇭 Filipinas</option>
                    <option value="TH">🇹🇭 Tailândia</option>
                    <option value="VN">🇻🇳 Vietnã</option>
                    <option value="CN">🇨🇳 China</option>
                    <option value="JP">🇯🇵 Japão</option>
                    <option value="KR">🇰🇷 Coreia do Sul</option>
                    <option value="AU">🇦🇺 Austrália</option>
                    <option value="PK">🇵🇰 Paquistão</option>
                  </optgroup>
                  <optgroup label="Oriente Médio &amp; África">
                    <option value="SA">🇸🇦 Arábia Saudita</option>
                    <option value="AE">🇦🇪 Emirados</option>
                    <option value="IL">🇮🇱 Israel</option>
                    <option value="EG">🇪🇬 Egito</option>
                    <option value="NG">🇳🇬 Nigéria</option>
                    <option value="ZA">🇿🇦 África do Sul</option>
                    <option value="KE">🇰🇪 Quênia</option>
                  </optgroup>
                </select>
                <div className="flex gap-1.5 flex-1">
                  <div className="flex-1 h-9 bg-ink-950 border border-ink-700 rounded-lg px-2 flex items-center justify-center gap-1.5 text-[11px]">
                    <span className="text-[8px] text-ink-400 font-bold uppercase tracking-wider">MKT</span>
                    <span className="num font-bold text-amber-400">$ {mMkt.toFixed(4)}</span>
                  </div>
                  <div className="flex-1 h-9 bg-ink-950 border border-ink-700 rounded-lg px-2 flex items-center justify-center gap-1.5 text-[11px]">
                    <span className="text-[8px] text-ink-400 font-bold uppercase tracking-wider">UTIL</span>
                    <span className="num font-bold text-pink-400">$ {mUtil.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Volume de Mensagens */}
            <section className="glass rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  <h2 className="disp font-bold text-white text-sm">Volume de Mensagens</h2>
                  <div className="inline-flex rounded-md p-0.5 bg-ink-950 border border-ink-700 text-[10px] font-bold">
                    <button onClick={() => setMode('basic')} className={`px-2.5 py-0.5 rounded transition-all ${mode === 'basic' ? 'text-emerald-300 bg-emerald-500/15' : 'text-ink-400'}`}>Básico</button>
                    <button onClick={() => setMode('advanced')} className={`px-2.5 py-0.5 rounded transition-all ${mode === 'advanced' ? 'text-emerald-300 bg-emerald-500/15' : 'text-ink-400'}`}>Avançado</button>
                  </div>
                </div>
              </div>

              {mode === 'basic' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-ink-900/40 border border-ink-700/60 rounded-xl space-y-2.5">
                    <p className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Volume de Mensagens
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button onClick={() => onSetTotalVolume(1000)} className="text-[10px] py-1.5 rounded border border-ink-700 bg-ink-900/60 hover:bg-ink-950 hover:border-neo-500/50 text-ink-200 font-bold">Inicial (1k)</button>
                      <button onClick={() => onSetTotalVolume(5000)} className="text-[10px] py-1.5 rounded border border-ink-700 bg-ink-900/60 hover:bg-ink-950 hover:border-neo-500/50 text-ink-200 font-bold">Pequeno (5k)</button>
                      <button onClick={() => onSetTotalVolume(35000)} className="text-[10px] py-1.5 rounded border border-ink-700 bg-ink-900/60 hover:bg-ink-950 hover:border-neo-500/50 text-ink-200 font-bold">Médio (35k)</button>
                      <button onClick={() => onSetTotalVolume(150000)} className="text-[10px] py-1.5 rounded border border-ink-700 bg-ink-900/60 hover:bg-ink-950 hover:border-neo-500/50 text-ink-200 font-bold">Grande (150k)</button>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[9px] text-ink-500 font-mono shrink-0">100</span>
                      <input id="totalVolumeSlider" type="range" min="0" max="1000" step="1" value="0" className="flex-1" onChange={e => onTotalSliderInput(e.target.value)} />
                      <span className="text-[9px] text-ink-500 font-mono shrink-0">10M</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="totalVolumeInput" type="number" min="0" max="10000000" step="1" value={totalVolume || ''} onChange={e => onTotalInputChange(e.target.value)} className="w-32 h-9 px-3 bg-ink-950 border border-ink-700 text-white num font-bold text-base rounded-lg text-right" />
                      <span className="num text-[11px] text-ink-400 font-bold shrink-0">msgs</span>
                    </div>
                  </div>
                  <div className="text-center text-[11px] text-ink-400 num">
                    <span className="text-ink-500">Volume total estimado:</span> <span className="text-white font-bold">{totalContacts === 0 ? '—' : totalContacts.toLocaleString('pt-BR') + ' msgs'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="bg-ink-900/40 border border-ink-700/60 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Marketing</span>
                        <button onClick={() => clearField('mkt')} className="text-ink-500 hover:text-red-300 text-xs">🗑</button>
                      </div>
                      <p className="text-[10px] text-ink-500 mb-1.5">Campanhas ativas, envio de ofertas, remarketing dinâmico e lançamentos.</p>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" max="10000000" value={mMsgs || ''} readOnly={useUploadVolume} onChange={e => onCardInputChange('mkt', e.target.value)} className="w-24 h-9 px-2.5 bg-ink-950 border border-ink-700 text-white num font-bold text-sm rounded-lg" />
                        <span className="num text-[10px] text-ink-400 w-20 text-right">Custo: <span className="text-amber-300 font-bold">{totalContacts === 0 ? '—' : fmt(toCur(mMkt * mMsgs))}</span></span>
                      </div>
                    </div>
                    <div className="bg-ink-900/40 border border-ink-700/60 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-pink-400 font-bold text-xs flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>Utilidade</span>
                        <button onClick={() => clearField('util')} className="text-ink-500 hover:text-red-300 text-xs">🗑</button>
                      </div>
                      <p className="text-[10px] text-ink-500 mb-1.5">Mensagens transacionais (atualizações de pedidos, segurança, alertas e PIX).</p>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" max="10000000" value={uMsgs || ''} readOnly={useUploadVolume} onChange={e => onCardInputChange('util', e.target.value)} className="w-24 h-9 px-2.5 bg-ink-950 border border-ink-700 text-white num font-bold text-sm rounded-lg" />
                        <span className="num text-[10px] text-ink-400 w-20 text-right">Custo: <span className="text-pink-300 font-bold">{totalContacts === 0 ? '—' : fmt(toCur(mUtil * uMsgs))}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-ink-900/40 border border-ink-700/60 rounded-xl p-3 space-y-3">
                    {/* SLIDER 1: ORÇAMENTO */}
                    <div className="p-2.5 rounded-lg bg-amber-500/[0.05] border border-amber-500/25 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">① Orçamento mensal (R$)</span>
                        </span>
                        {budgetActive && <span className="items-center gap-1 h-[14px] px-1.5 text-[8px] font-bold uppercase leading-none text-amber-200 bg-amber-500/20 border border-amber-500/50 rounded-full inline-flex"><span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse"></span>ON</span>}
                      </div>
                      <p className="text-[9px] text-ink-500 -mt-1">Ative pra calcular o volume possível com seu orçamento</p>
                      <div className="flex items-stretch gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400/80 text-[10px] font-bold pointer-events-none">R$</span>
                          <input type="text" value={budget || ''} onChange={e => setBudget(parseInt(e.target.value) || 0)} className="w-full h-9 pl-8 pr-2 bg-ink-950 border border-amber-500/40 text-white rounded-md text-right num font-bold text-[12px]" />
                        </div>
                        <button onClick={toggleBudget} className="shrink-0 px-3 inline-flex items-center justify-center gap-1 text-[10px] font-bold rounded-md border border-amber-500/45 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300">{budgetActive ? 'Desativar' : 'Ativar'}</button>
                      </div>
                      <input type="range" min="100" max="10000" step="50" value={budget || 0} onChange={e => onBudgetSliderInput(e.target.value)} className="w-full amber" />
                      <div className="flex justify-between text-[9px] text-ink-500 font-mono"><span>R$ 100</span><span>R$ 10k</span></div>
                    </div>
                    {/* SLIDER 2: VOLUME */}
                    <div className="p-2.5 rounded-lg bg-pink-500/[0.05] border border-pink-500/25 space-y-2">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-pink-300 uppercase tracking-wider">② Volume de mensagens</span>
                      </span>
                      <p className="text-[9px] text-ink-500 -mt-1">Total de mensagens a enviar no mês</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[9px] text-ink-500 font-mono shrink-0">100</span>
                        <input type="range" min="0" max="1000" step="1" value="0" onChange={e => onTotalSliderInput(e.target.value)} className="flex-1 pink" />
                        <span className="text-[9px] text-ink-500 font-mono shrink-0">10M</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" max="10000000" value={totalVolume || ''} onChange={e => onTotalInputChange(e.target.value)} className="w-32 h-9 px-3 bg-ink-950 border border-pink-500/40 text-white num font-bold text-base rounded-lg text-right" />
                        <span className="num text-[11px] text-pink-300 font-bold shrink-0">msgs</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-[11px] text-ink-400 num">
                    <span className="text-ink-500">Volume total estimado:</span> <span className="text-white font-bold">{totalContacts === 0 ? '—' : totalContacts.toLocaleString('pt-BR') + ' msgs'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="bg-ink-900/40 border border-ink-700/60 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Marketing</span>
                      </div>
                      <p className="text-[10px] text-ink-500 mb-1.5">Campanhas ativas, envio de ofertas, remarketing dinâmico e lançamentos.</p>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" max="10000000" value={mMsgs || ''} readOnly className="w-24 h-9 px-2.5 bg-ink-950 border border-ink-700 text-white num font-bold text-sm rounded-lg" />
                        <span className="num text-[10px] text-ink-400 w-20 text-right">Custo: <span className="text-amber-300 font-bold">{totalContacts === 0 ? '—' : fmt(toCur(mMkt * mMsgs))}</span></span>
                      </div>
                    </div>
                    <div className="bg-ink-900/40 border border-ink-700/60 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-pink-400 font-bold text-xs flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>Utilidade</span>
                      </div>
                      <p className="text-[10px] text-ink-500 mb-1.5">Mensagens transacionais (atualizações de pedidos, segurança, alertas e PIX).</p>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" max="10000000" value={uMsgs || ''} readOnly className="w-24 h-9 px-2.5 bg-ink-950 border border-ink-700 text-white num font-bold text-sm rounded-lg" />
                        <span className="num text-[10px] text-ink-400 w-20 text-right">Custo: <span className="text-pink-300 font-bold">{totalContacts === 0 ? '—' : fmt(toCur(mUtil * uMsgs))}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Distribuição + custo máx/msg */}
              <div className="mt-3 p-3 bg-ink-900/60 border border-ink-700/50 rounded-xl space-y-2.5">
                <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 text-[10px]">
                  <span className="text-ink-400 font-bold uppercase">Distribuição de Categoria</span>
                  <span className="num text-[10px] text-ink-300 font-bold bg-ink-950 px-1.5 py-0.5 rounded border border-ink-800 inline-flex items-center gap-1">
                    <span className="text-amber-400">{lastSplitPct.toFixed(2).replace('.', ',')}%</span> MKT /
                    <span className="text-pink-400"> {(100 - lastSplitPct).toFixed(2).replace('.', ',')}%</span> UTIL
                  </span>
                </div>
                <div className="flex items-center pt-1">
                  <button onClick={() => setSplit(100)} className="text-[9px] font-extrabold text-amber-400 mr-2 uppercase tracking-wider hover:text-amber-300">MKT</button>
                  <input id="splitSlider" type="range" min="0" max="100" step="any" value={lastSplitPct} onChange={e => setSplit(parseFloat(e.target.value))} className="flex-1" style={{ ['--pct' as any]: lastSplitPct + '%' }} />
                  <button onClick={() => setSplit(0)} className="text-[9px] font-extrabold text-pink-400 ml-2 uppercase tracking-wider hover:text-pink-300">UTIL</button>
                </div>
              </div>

              {/* Upload CSV opcional */}
              <details className="mt-3 group">
                <summary className="flex items-center gap-2 text-[11px] text-ink-400 hover:text-ink-200 font-semibold cursor-pointer">
                  <svg className="w-3.5 h-3.5 text-neo-400 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  📋 Upload CSV de contatos (opcional — para simular com lista real)
                </summary>
                <div className="mt-2 space-y-2 animate-fade">
                  <div className="dropzone border-2 border-dashed border-ink-700 rounded-xl p-4 text-center cursor-pointer hover:border-neo-500/60 hover:bg-neo-500/[0.03]" onClick={() => fileInputRef.current?.click()} onDragOver={e => e.preventDefault()} onDragLeave={e => e.currentTarget.classList.remove('dragover')} onDrop={handleDrop}>
                    <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    <p className="text-xs text-ink-300 font-semibold">Arraste seu CSV aqui</p>
                    <p className="text-[10px] text-ink-500 mt-1">coluna obrigatória: <span className="num text-neo-400 font-bold">country_code</span></p>
                  </div>
                  {useUploadVolume && (
                    <div className="p-2.5 bg-neo-500/10 border border-neo-500/30 rounded-lg text-[11px] text-neo-300 flex items-center justify-between">
                      <span>✓ {uploadFileName} — {contacts.length.toLocaleString('pt-BR')} contatos</span>
                      <button onClick={loadSample} className="text-neo-400 hover:text-neo-300 underline text-[10px]">carregar exemplo</button>
                    </div>
                  )}
                </div>
              </details>
            </section>

            {/* 3. Breakdown por país (só se upload) */}
            {useUploadVolume && Object.keys(grouped).length > 0 && (
              <section className="glass rounded-2xl p-4 shadow-xl animate-fade">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-bold">3</span>
                    <h2 className="disp font-bold text-white text-sm">Breakdown por país</h2>
                  </div>
                  <div className="flex gap-1.5 text-[9px]">
                    <span className="pill bg-neo-500/15 text-neo-300 border border-neo-500/30">● Meta</span>
                    <span className="pill bg-ink-700 text-ink-300 border border-ink-600">● Manychat</span>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="text-[9px] uppercase tracking-wider text-ink-500 border-b border-ink-700/60">
                        <th className="text-left px-2 py-1.5 font-bold">País</th>
                        <th className="text-right px-2 py-1.5 font-bold">Contatos</th>
                        <th className="text-right px-2 py-1.5 font-bold text-amber-400">MKT</th>
                        <th className="text-right px-2 py-1.5 font-bold text-pink-400">UTIL</th>
                        <th className="text-right px-2 py-1.5 font-bold text-neo-400">Meta</th>
                        <th className="text-right px-2 py-1.5 font-bold text-ink-200">Many</th>
                        <th className="text-right px-2 py-1.5 font-bold text-ink-300">Δ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(grouped).sort((a, b) => b.count - a.count).map(g => {
                        const mMsgs = Math.round(g.count * lastSplitPct / 100)
                        const uMsgs = g.count - mMsgs
                        const cM = toCur(getMetaPrice(g.cc, 'mkt') * mMsgs + getMetaPrice(g.cc, 'util') * uMsgs)
                        const cN = toCur(getManyPrice(g.cc, 'mkt') * mMsgs + getManyPrice(g.cc, 'util') * uMsgs)
                        const dlt = cN - cM
                        const clr = dlt > 0 ? 'text-neo-400' : dlt < 0 ? 'text-red-300' : 'text-ink-500'
                        return (
                          <tr key={g.cc} className="border-b border-ink-800/40">
                            <td className="px-2 py-1.5 font-semibold text-white">{g.flag} {g.name} <span className="num text-ink-500 text-[9px] ml-1">{g.cc}</span></td>
                            <td className="px-2 py-1.5 text-right num text-ink-200">{g.count.toLocaleString('pt-BR')}</td>
                            <td className="px-2 py-1.5 text-right num text-amber-400">{mMsgs.toLocaleString('pt-BR')}</td>
                            <td className="px-2 py-1.5 text-right num text-pink-400">{uMsgs.toLocaleString('pt-BR')}</td>
                            <td className="px-2 py-1.5 text-right num text-neo-300 font-bold">{fmt(cM)}</td>
                            <td className="px-2 py-1.5 text-right num text-ink-200 font-bold">{fmt(cN)}</td>
                            <td className={`px-2 py-1.5 text-right num text-[10px] ${clr}`}>{dlt > 0 ? '+' : ''}{fmt(dlt)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 4. ROI */}
            <section className="glass rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-bold">4</span>
                <h2 className="disp font-bold text-white text-sm">Calculadora de ROI</h2>
              </div>
              <p className="text-[10px] text-ink-400 mb-3">Estime lucro e retorno em 3 cenários de conversão.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] font-bold text-ink-400 uppercase tracking-wider mb-1">Ticket médio (R$)</label>
                  <input type="number" value={ticket} onChange={e => setTicket(parseFloat(e.target.value) || 0)} className="w-full h-9 px-2.5 bg-ink-950 border border-ink-700 text-white num font-bold rounded-md text-xs" />
                  <input type="range" min="10" max="5000" step="10" value={ticket} onChange={e => setTicket(parseFloat(e.target.value))} className="w-full mt-1.5" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-ink-400 uppercase tracking-wider mb-1">Taxas de conversão alvo</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['cons', 'mod', 'opt'] as const).map((s, i) => (
                      <div key={s}>
                        <span className="block text-[8px] text-ink-500 font-bold uppercase mb-0.5">{['Conserv.', 'Moder.', 'Otimist.'][i]}</span>
                        <div className="flex items-center border border-ink-700 bg-ink-950 rounded overflow-hidden h-8">
                          <button onClick={() => stepConv(s, -0.1)} className="px-1.5 h-full text-ink-400 hover:text-white text-[10px] font-bold">−</button>
                          <input type="text" value={conv[s].toFixed(1).replace('.', ',') + '%'} onChange={e => setConv({ ...conv, [s]: parseFloat(e.target.value.replace(',', '.').replace('%', '')) || 0 })} className="w-full bg-transparent text-white text-[10px] text-center num font-bold" />
                          <button onClick={() => stepConv(s, 0.1)} className="px-1.5 h-full text-ink-400 hover:text-white text-[10px] font-bold">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {totalContacts > 0 ? (
                <div className="roi-grid grid grid-cols-3 gap-2.5">
                  {(['cons', 'mod', 'opt'] as const).map((s, i) => {
                    const vendas = Math.round(totalContacts * (conv[s] / 100))
                    const ticketDisplay = currency === 'BRL' ? ticket : ticket / fxRate
                    const receita = vendas * ticketDisplay
                    const costMetaTax = toCur(costMetaUSD) * taxMul
                    const costManyTax = toCur(costManyUSD) * taxMul
                    const lucroMeta = receita - costMetaTax
                    const lucroMany = receita - costManyTax
                    const roiMeta = costMetaTax > 0 ? (lucroMeta / costMetaTax) * 100 : 0
                    const roiMany = costManyTax > 0 ? (lucroMany / costManyTax) * 100 : 0
                    const cls = i === 1 ? 'bg-indigo-950/20 border-indigo-500/30' : i === 2 ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-ink-900/30 border-ink-700/60'
                    const lbl = i === 1 ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/20' : i === 2 ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20' : 'bg-ink-800 text-ink-300 border border-ink-700'
                    return (
                      <div key={s} className={`p-3 rounded-xl border ${cls}`}>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${lbl}`}>{['Conservador', 'Moderado', 'Otimista'][i]} ({conv[s].toFixed(1).replace('.', ',')}%)</span>
                        <div className="mt-2.5 space-y-1 num text-[10px]">
                          <div className="flex justify-between border-b border-ink-800/40 pb-1"><span className="text-ink-400">Vendas</span><span className="font-bold text-white">{vendas.toLocaleString('pt-BR')}</span></div>
                          <div className="flex justify-between border-b border-ink-800/40 pb-1"><span className="text-ink-400">Receita</span><span className="font-bold text-cyan-400">{fmt(receita)}</span></div>
                          <div className="flex justify-between border-b border-ink-800/40 pb-1"><span className="text-ink-400">Custo Meta</span><span className="font-bold text-neo-300">{fmt(costMetaTax)}</span></div>
                          <div className="flex justify-between border-b border-ink-800/40 pb-1"><span className="text-ink-400">Custo Many</span><span className="font-bold text-ink-200">{fmt(costManyTax)}</span></div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-ink-800/80">
                          <p className="text-[8px] text-ink-500 uppercase font-mono">ROI Meta</p>
                          <p className={`text-[11px] font-bold font-mono ${roiMeta >= 0 ? 'text-neo-300' : 'text-red-300'}`}>{roiMeta.toFixed(0)}% · {fmt(lucroMeta)}</p>
                          <p className="text-[8px] text-ink-500 uppercase font-mono mt-1">ROI Manychat</p>
                          <p className={`text-[11px] font-bold font-mono ${roiMany >= 0 ? 'text-neo-300' : 'text-red-300'}`}>{roiMany.toFixed(0)}% · {fmt(lucroMany)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-[11px] text-ink-500 italic py-4">Defina um volume de mensagens pra calcular o ROI</div>
              )}
            </section>
          </div>

          {/* COLUNA DIREITA */}
          <aside className="order-first lg:order-none lg:col-span-4 lg:sticky lg:top-20 flex flex-col gap-6">
            <section className="glass rounded-2xl p-4 shadow-2xl border-neo-500/20">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[10px] font-extrabold text-neo-400 uppercase tracking-[0.18em]">Resumo da Estimativa</h2>
                <button onClick={() => totalContacts > 0 && setReportOpen(true)} disabled={totalContacts === 0} className="px-2.5 py-1 text-[10px] font-bold bg-ink-700 hover:bg-ink-600 disabled:opacity-40 text-white rounded-md">📄 Relatório</button>
              </div>
              <p className="text-[10px] text-ink-400 mb-3">Custo da Meta API · impostos opcionais ↓</p>
              <div className="mb-2">
                <p className="text-[9px] text-ink-400 uppercase font-bold tracking-wider">Custo Meta API (base)</p>
                <p className="hero-num disp text-2xl font-extrabold num mt-0.5">{totalContacts === 0 ? 'R$ —' : fmt(metaBaseLocal)}</p>
                <p className="text-[8px] text-ink-500 mt-0.5">+ impostos se toggle ligado ↓</p>
              </div>
              <div className="text-[10px] text-ink-300 num mb-3">
                Mkt: <span className="text-amber-300 font-bold">{totalContacts === 0 ? 'R$ —' : fmt(toCur(mMkt * mMsgs))}</span> · Util: <span className="text-pink-300 font-bold">{totalContacts === 0 ? 'R$ —' : fmt(toCur(mUtil * uMsgs))}</span>
              </div>
              <div className="text-[10px] text-ink-300 num mb-3">
                Custo médio por msg: <span className="text-neo-300 font-bold">{totalContacts === 0 ? 'R$ —' : fmt(metaBaseLocal / totalContacts)}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-ink-700/50 space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-neo-950/40 border border-neo-500/30">
                  <div>
                    <p className="text-[8px] font-extrabold text-neo-400 uppercase tracking-wider">Meta API</p>
                    <p className="num text-sm font-bold text-neo-300">{totalContacts === 0 ? 'R$ —' : fmt(metaBaseLocal)}</p>
                  </div>
                  <span className="chip bg-neo-500/15 text-neo-300 border border-neo-500/30">BASE</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-ink-800/60 border border-ink-600">
                  <div>
                    <p className="text-[8px] font-extrabold uppercase tracking-wider text-ink-200">Manychat</p>
                    <p className="num text-sm font-bold text-white">{totalContacts === 0 ? 'R$ —' : fmt(manyBaseLocal)}</p>
                  </div>
                  <span className="chip bg-ink-700 text-ink-200 border border-ink-600">CLOUD</span>
                </div>
                {totalContacts > 0 && (
                  <div className="p-2 rounded-md border border-dashed border-neo-500/40 bg-neo-500/5 text-center">
                    <p className="text-[9px] text-neo-300 font-bold">{metaBaseLocal < manyBaseLocal ? 'Meta API é mais barato' : 'Manychat é mais barato'}</p>
                    <p className="text-[10px] num text-ink-300">Economia de {fmt(Math.abs(metaBaseLocal - manyBaseLocal))}</p>
                  </div>
                )}
              </div>
              </section>

            {currency === 'BRL' && (
            <section className="rounded-2xl border border-ink-800/60 bg-ink-900/40 p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[11px] font-semibold text-ink-200 uppercase tracking-wider">Impostos Nacionais</h3>
                  <label className="toggle">
                    <input type="checkbox" checked={taxesEnabled} onChange={e => setTaxesEnabled(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>
                <p className="text-[10px] text-ink-500 mb-4">Aplicado sobre o custo da Meta API (lucro presumido)</p>
                {taxesEnabled && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-ink-500 mb-1">PIS/COFINS</label>
                        <div className="relative">
                          <input type="text" value={pisCofins.toString().replace('.', ',')} onChange={e => setPisCofins(parseFloat(e.target.value.replace(',', '.')) || 0)} className="w-full h-9 px-3 pr-7 bg-ink-950 border border-ink-800 text-white num text-[12px] rounded-md" />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-500 text-[10px]">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-ink-500 mb-1">ISS (média)</label>
                        <div className="relative">
                          <input type="text" value={iss.toString().replace('.', ',')} onChange={e => setIss(parseFloat(e.target.value.replace(',', '.')) || 0)} className="w-full h-9 px-3 pr-7 bg-ink-950 border border-ink-800 text-white num text-[12px] rounded-md" />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-500 text-[10px]">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-ink-800/50 space-y-1.5 text-[11px]">
                      <div className="flex justify-between"><span className="text-ink-500">Base Meta</span><span className="num text-ink-200">{fmt(metaBaseLocal)}</span></div>
                      <div className="flex justify-between"><span className="text-ink-500">+ PIS/COFINS</span><span className="num text-ink-200">{fmt(pisAmt)}</span></div>
                      <div className="flex justify-between"><span className="text-ink-500">+ ISS</span><span className="num text-ink-200">{fmt(issAmt)}</span></div>
                      <div className="flex justify-between pt-2 mt-1 border-t border-ink-800/50 font-medium"><span className="text-ink-300">Total c/ impostos</span><span className="num text-ink-50">{fmt(finalTotalLocal)}</span></div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </aside>
        </div>

        <footer className="mt-8 pt-4 border-t border-ink-800/60 text-center text-[9px] text-ink-600">
          WhatsCost · Cotações via <a className="text-ink-400 hover:text-ink-300" href="https://frankfurter.dev">frankfurter.dev</a> · Taxas: Meta (jul/2026) + Manychat (jul/2026)
        </footer>
      </main>

      {/* MODAL RELATÓRIO */}
      {reportOpen && totalContacts > 0 && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-3">
          <div className="report-paper rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between p-3 border-b border-slate-200 gap-2">
              <h2 className="text-sm font-bold text-slate-900">Visualização de Relatório</h2>
              <div className="flex gap-1.5 items-center">
                <button onClick={() => setReportOpen(false)} className="text-slate-500 hover:text-slate-800 text-lg leading-none px-1.5">×</button>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neo-500 to-neo-700 flex items-center justify-center text-white text-base">💬</div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neo-700">Calculadora de custos</p>
                    <h3 className="text-base font-bold text-slate-900">API Oficial do WhatsApp</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Relatório gerado em</p>
                  <p className="text-[11px] num text-slate-700">{new Date().toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-500">Região</p>
                  <p className="text-sm font-bold text-slate-900">{getMetaCountryInfo(region).flag} {getMetaCountryInfo(region).name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-500">Volume</p>
                  <p className="text-sm font-bold num text-slate-900">{totalContacts.toLocaleString('pt-BR')} msgs</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-500">Moeda</p>
                  <p className="text-sm font-bold text-slate-900">{currency}</p>
                </div>
                <div className="p-2 bg-neo-50 border border-neo-200 rounded">
                  <p className="text-[9px] font-bold uppercase text-neo-700">Custo estimado</p>
                  <p className="text-base font-extrabold num text-neo-700">{fmt(finalTotalLocal)}</p>
                </div>
              </div>
              <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2">Custos Meta API</h4>
              <table className="w-full text-[11px] mb-5">
                <thead><tr className="text-[9px] uppercase text-slate-500 border-b border-slate-200">
                  <th className="text-left py-1.5">Categoria</th>
                  <th className="text-right py-1.5">Volume</th>
                  <th className="text-right py-1.5">Unitário</th>
                  <th className="text-right py-1.5">Subtotal</th>
                </tr></thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5"><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>Marketing</td>
                    <td className="text-right num">{mMsgs.toLocaleString('pt-BR')}</td>
                    <td className="text-right num">{fmt(toCur(mMkt))}</td>
                    <td className="text-right num font-bold">{fmt(toCur(mMkt * mMsgs))}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5"><span className="inline-block w-2 h-2 rounded-full bg-pink-400 mr-1.5"></span>Utilidade</td>
                    <td className="text-right num">{uMsgs.toLocaleString('pt-BR')}</td>
                    <td className="text-right num">{fmt(toCur(mUtil))}</td>
                    <td className="text-right num font-bold">{fmt(toCur(mUtil * uMsgs))}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold">Total Meta</td>
                    <td></td><td></td>
                    <td className="text-right num font-bold text-slate-900">{fmt(metaBaseLocal)}</td>
                  </tr>
                </tbody>
              </table>
              {taxesEnabled && currency === 'BRL' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-5">
                  <h4 className="text-[10px] font-bold uppercase text-amber-800 tracking-wider mb-2">Impostos e Taxas</h4>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span className="text-slate-600">Valor Base</span><span className="num font-mono">{fmt(metaBaseLocal)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">PIS/COFINS ({pisCofins.toFixed(2).replace('.', ',')}%)</span><span className="num font-mono">{fmt(pisAmt)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">ISS ({iss.toFixed(2).replace('.', ',')}%)</span><span className="num font-mono">{fmt(issAmt)}</span></div>
                    <div className="flex justify-between pt-1.5 mt-1.5 border-t border-amber-300 font-bold"><span className="text-amber-800">Total c/ impostos</span><span className="num font-mono text-amber-900">{fmt(finalTotalLocal)}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
