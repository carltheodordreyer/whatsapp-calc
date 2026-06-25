# Calculadora de Disparo API oficial do WhatsApp

Simulador de custos **Meta API vs Manychat** com upload de lista de contatos, breakdown por país, impostos nacionais e cálculo de ROI.

## ✨ Features

- 🌎 **70+ países** com preços Meta API + Manychat específicos
- 📊 **Comparação lado a lado** Meta vs Manychat
- 📤 **Upload de CSV** com coluna `country_code` (uma linha = um contato)
- 💰 **Cotação BRL/USD** via frankfurter.dev (atualizada a cada hora)
- 🧾 **Impostos nacionais** (PIS/COFINS + ISS) opcionais
- 📈 **Calculadora de ROI** com 3 cenários (Conservador/Moderado/Otimista)
- 🎨 **Dark theme** preto + verde neon
- 🌍 **Twemoji** para bandeiras reais (cross-platform)
- 📱 **100% responsivo** (mobile + desktop)

## 🚀 Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (cores customizadas)
- **React Hooks** (useState, useEffect)
- **Vercel** (deploy gratuito serverless)

## 📦 Como rodar local (opcional)

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## 🌐 Deploy

Conectado no GitHub → Vercel faz deploy automático a cada commit.

URL: `https://whatsapp-calc.vercel.app`

## 📄 Formato do CSV

```csv
country_code,name,phone,email,tags
BR,Ana Silva,+5511987654321,ana@email.com,vip
US,John Smith,+12125551234,john@email.com
CO,Maria Garcia,+573001234567,maria@email.com
```

**Obrigatório:** coluna `country_code` (ISO 2 letras).
**Opcional:** `name`, `phone`, `email`, `tags` (ignoradas pelo parser).

Países não reconhecidos caem automaticamente no fallback "Outros países".

## 💱 Cotação

- API: `https://api.frankfurter.dev/v1/latest?base=USD&symbols=BRL`
- Atualização: a cada 1 hora (cache serverless)
- Fallback: R$ 5,00/USD se a API falhar

## 🧾 Tabelas de Preços

### Meta API
Baseado em [developers.facebook.com/documentation/business-messaging/whatsapp/pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) (jul/2025+).

### Manychat
Baseado em [help.manychat.com WhatsApp pricing guide](https://help.manychat.com/hc/en-us/articles/14281380243740-WhatsApp-pricing-guide).

## 📝 Licença

MIT
