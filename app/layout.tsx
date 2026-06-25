import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calculadora de Disparo API oficial do WhatsApp',
  description: 'Simulador de custos Meta API vs Manychat — upload de lista, breakdown por país, ROI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
        <script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js" async />
      </head>
      <body>{children}</body>
    </html>
  )
}
