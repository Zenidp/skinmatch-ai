# SkinMatch AI — Project Context

> **Tagline:** *"Personalized skincare for every skin, every climate"*
> **Hackathon:** DevNetwork [AI + ML] Hackathon 2026
> **Sponsor Challenges:** 
> - Perfect Corp — Building the Next Generation of AI-Driven Consumer Experiences ($2,500 cash)
> - Crusoe — Build a Hermes/NemoClaw Agent running Nvidia Nemotron on Crusoe Cloud (NVIDIA DGX Spark)
> - TrueFoundry — Resilient Agents ($1,500 cash)
> **Developer:** Solo developer, Full Stack
> **Deadline:** May 28, 2026 — 10:00 AM PT

---

## 1. Problem Statement

The global skincare market is worth **$189.3 billion** (Grand View Research, 2026), yet most AI-powered skincare solutions are built and trained primarily for Western, 4-season climates — leaving a massive, underserved population behind.

**Key pain points — backed by data:**
- **37% of Gen Z** feel overwhelmed when buying skincare products due to conflicting information and too many choices *(Professional Beauty UK, March 2026)*
- **63% of people** don't actually know their real skin type, meaning the majority are buying products that don't work — or actively damage their skin *(Skin Trust Club / Labskin clinical study, 2022)*
- **90% of consumers** feel frustrated trying to find skincare that actually works for them *(Drive Research, 2025)*
- **68% of consumers** are now actively seeking skincare personalized to their own skin profile — but current AI tools fail to serve tropical and diverse skin types *(Business Research Insights, 2026)*
- Tropical skin types (oily, humid-climate, acne-prone) have fundamentally different needs compared to skin in 4-season climates — yet no major AI tool addresses this gap

**Market opportunity:**
- Global skincare market: **$189.3B** (2026) → **$310.6B** by 2033 *(Grand View Research / DataM Intelligence)*
- AI beauty personalization market: **$2.3B** in 2026 → **$16.4B** by 2036 at **21.7% CAGR** *(Future Market Insights, 2026)*
- Personalized beauty products market growing at **41.5% CAGR** through 2035 *(Business Research Insights, 2026)*
- Asia-Pacific leads growth with **47% regional expansion** in tech-driven beauty *(Business Research Insights, 2026)*

**Core insight:**
> There is no AI skincare advisor built specifically for tropical, diverse skin types — with product recommendations that are globally accessible and climate-aware. SkinMatch AI fills that gap.

---

## 2. Solution

**SkinMatch AI** is a web application that uses computer vision and AI skin analysis to deliver hyper-personalized skincare routines for Gen Z users — with a unique focus on tropical and diverse skin types that are underserved by existing solutions.

**How it works:**
1. User takes or uploads a photo of their face
2. Perfect Corp's AI Skin Analysis API analyzes the skin — detecting skin type (oily, dry, combination, sensitive), concerns (acne, dark spots, wrinkles, pores), and skin tone
3. Nvidia Nemotron via Crusoe Cloud (primary LLM) generates a personalized skincare routine — with automatic fallback to Llama 3, then Qwen (both via Crusoe Cloud) if the primary is unavailable
4. App recommends globally accessible products (CeraVe, The Ordinary, Innisfree, Cosrx, etc.) tailored to the user's skin profile and concern
5. User receives a shareable skin report card — experience is uninterrupted even during LLM or infrastructure failures

---

## 3. Target Users

| Segment | Description |
|---|---|
| **Primary** | Gen Z (15–25 years old), globally — especially in Asia, Southeast Asia, Latin America, and Africa |
| **Secondary** | Millennials (25–35) who are new to skincare and overwhelmed by choices |
| **Tertiary** | Skincare brands and retailers looking for a white-label AI advisor tool |

**User Persona:**
> *Rina, 20, college student. She wants to start a skincare routine but doesn't know where to begin. She's tried 3 products that broke her out and wasted $60. She has oily, acne-prone skin but every app she's tried recommends products made for dry skin. She wants something that actually understands her skin.*

---

## 4. Key Features

### MVP (Must-have for submission)
- **Face Photo Upload / Camera Capture** — mobile-friendly, instant preview
- **AI Skin Analysis** — powered by Perfect Corp API; detects skin type, concerns, and tone
- **Personalized Routine Generator** — morning & night routine, powered by Claude AI
- **Product Recommendations** — curated global products per skin concern, with price range filters
- **Skin Report Card** — shareable summary of skin analysis results

### Bonus Features (if time permits)
- **Climate Mode** — toggle between tropical / temperate / cold climate for adjusted recommendations
- **Budget Filter** — filter products by price range ($, $$, $$$)
- **Progress Tracker** — save and compare skin analysis results over time
- **Routine Reminder** — simple notification to stay consistent

---

## 5. Tech Stack

| Layer | Technology | Cost | Reason |
|---|---|---|---|
| **Frontend** | React + TailwindCSS | Free | Fast to build, responsive, modern UI |
| **Framework** | Next.js | Free | SSR + API routes in one project |
| **AI Skin Analysis** | Perfect Corp API | Free (Pegasus1000) | Core hackathon requirement |
| **LLM Primary** | Nvidia Nemotron via Crusoe Cloud Managed Inference | Free (sponsor) | Powerful open-source LLM, Crusoe challenge |
| **LLM Fallback 1** | Llama 3 via Crusoe Cloud | Free (sponsor) | First resilience layer |
| **LLM Fallback 2** | Qwen via Crusoe Cloud | Free (sponsor) | Second resilience layer |
| **LLM Fallback 3** | Static JSON rules engine | Free | Final fallback, zero dependency |
| **AI Gateway** | TrueFoundry AI Gateway | Free (sponsor) | LLM routing, retries, observability |
| **Product Database** | Static JSON / Supabase | Free | Curated global skincare products |
| **Deployment** | Vercel | Free | Instant deployment, global CDN |
| **Version Control** | GitHub | Free | Standard |

> 💰 **Total project cost: $0** — 100% powered by hackathon sponsor credits

---

## 6. Multi-Challenge Architecture

SkinMatch AI is designed to satisfy **3 sponsor challenges simultaneously** through a layered, resilient architecture.

---

### 6a. Perfect Corp API Integration

**APIs to be used:**
- `AI Skin Analysis API` — primary feature; analyzes uploaded face photo
- `GenAI Text-to-Image API` (bonus) — visualize skin improvement scenarios

**Setup:**
- Redeem code: `Pegasus1000` at [yce.perfectcorp.com](https://yce.perfectcorp.com/api-console/en/redeem-code/)
- 1,000 free API units ($179 value) already available
- Contact for questions: valerie_torres@perfectcorp.com

**API Flow:**
```
User uploads photo
  → Send to Perfect Corp Skin Analysis API
  → Receive: skin_type, concerns[], skin_tone, scores{}
  → Pass results to LLM Fallback Chain (see 6b)
  → Display to user as Skin Report Card
```

---

### 6b. Resilient LLM Fallback Chain (Crusoe + TrueFoundry)

This is the core resilience layer of SkinMatch AI — satisfying both the **Crusoe** and **TrueFoundry** challenges.

**Fallback Chain Architecture:**
```
Skin Analysis Results (from Perfect Corp)
          ↓
  TrueFoundry AI Gateway
  (LLM routing + monitoring)
          ↓
  ┌───────────────────────────────┐
  │  PRIMARY:                     │
  │  Nvidia Nemotron via          │
  │  Crusoe Cloud Managed         │
  │  Inference                    │
  │  → Generate skincare routine  │
  └───────────────┬───────────────┘
                  │ ❌ Fails / Times out / Rate limited
                  ↓
  ┌───────────────────────────────┐
  │  FALLBACK 1:                  │
  │  Llama 3 via Crusoe Cloud     │
  │  → Same routine generation    │
  └───────────────┬───────────────┘
                  │ ❌ Still fails
                  ↓
  ┌───────────────────────────────┐
  │  FALLBACK 2:                  │
  │  Qwen via Crusoe Cloud        │
  │  → Minimal routine output     │
  └───────────────┬───────────────┘
                  │ ❌ All LLMs down
                  ↓
  ┌───────────────────────────────┐
  │  FALLBACK 3: Static rules     │
  │  engine (JSON-based)          │
  │  → Pre-written routine by     │
  │    skin type                  │
  └───────────────────────────────┘
          ↓
  User always gets a response ✅
  Total infrastructure cost: $0 ✅
```

**What TrueFoundry AI Gateway handles:**
- LLM request routing between Claude ↔ Crusoe models
- Automatic retry with exponential backoff
- Real-time observability & error logging
- Brownout detection (partial failures)
- User-facing graceful degradation messaging

**Resources:**
- TrueFoundry AI Gateway docs: https://www.truefoundry.com/docs/ai-gateway/intro-to-llm-gateway
- TrueFoundry Discord: https://discord.com/channels/1397947827921096845/1503438187941462268
- Crusoe contact: eacheampong@crusoe.ai

---

### 6c. Challenge-to-Feature Mapping

| Sponsor | Challenge | How SkinMatch AI Satisfies It |
|---|---|---|
| **Perfect Corp** | AI-driven consumer experience | Face analysis → personalized skincare routine UI |
| **Crusoe** | Run Nemotron/open-source LLM on Crusoe Cloud | Llama/Qwen on Crusoe as fallback LLM inference |
| **TrueFoundry** | Resilient agent under infrastructure chaos | Full fallback chain: Claude → Crusoe → Static, via TrueFoundry Gateway |

---

## 7. Business Model & Feasibility

SkinMatch AI has a clear path to becoming a sustainable business:

| Model | Description |
|---|---|
| **Freemium (B2C)** | Free basic analysis (1x/month), premium for unlimited + detailed routine ($4.99/month) |
| **White-label (B2B)** | License the technology to skincare brands (e.g., CeraVe, Innisfree) to embed on their websites |
| **Affiliate Revenue** | Earn commission on product purchases made through recommendations |
| **API-as-a-Service** | Sell the climate-aware skin analysis layer to other health & beauty apps |

**Market opportunity — verified data:**
- Global skincare market: **$189.3B** (2026), growing to **$310.6B** by 2033 *(Grand View Research / DataM Intelligence)*
- AI beauty personalization market: **$2.3B** → **$16.4B** by 2036 at **21.7% CAGR** *(Future Market Insights, 2026)*
- Personalized beauty products market: **$6.43B** in 2026, projected **$207B** by 2035 at **41.5% CAGR** *(Business Research Insights, 2026)*
- **68% of consumers** seek personalized skincare — but current tools don't serve tropical/diverse skin *(Business Research Insights, 2026)*
- Asia-Pacific leads with **47% regional expansion** in tech-driven beauty experiences *(Business Research Insights, 2026)*

---

## 8. Judging Criteria Alignment

### ✅ Progress
- Fully functional web app with real API integration across all 3 sponsor challenges
- End-to-end flow: photo upload → analysis → routine → recommendations
- Live fallback chain demonstrable (can be tested by killing Claude API)
- Clean, polished UI with demo video (1–3 minutes)

### ✅ Concept
- Solves a real, documented problem: wrong skincare products = wasted money + damaged skin
- Addresses an underserved global demographic (tropical skin, Gen Z, diverse skin tones)
- Resilience layer solves a real infrastructure problem: AI apps breaking when LLMs go down

### ✅ Feasibility
- Multiple clear monetization paths (B2C, B2B, affiliate)
- Scalable tech stack with low infrastructure cost and built-in redundancy
- Massive and growing TAM with strong tailwinds (Gen Z skincare boom, AI beauty market growth)
- Resilient architecture makes it production-ready from day one

---

## 9. Competitive Differentiators

| Feature | SkinMatch AI | Generic Skincare Apps |
|---|---|---|
| Tropical/climate-aware | ✅ Yes | ❌ No |
| Diverse skin tone focus | ✅ Yes | ⚠️ Partial |
| AI-generated routines | ✅ Yes (Nemotron/Llama/Qwen) | ❌ No |
| Global product database | ✅ Yes | ⚠️ Western-focused |
| Real skin analysis (CV) | ✅ Yes (Perfect Corp) | ⚠️ Self-reported only |
| Gen Z UI/UX | ✅ Yes | ❌ Dated |
| Resilient / always-on LLM | ✅ Yes (4-level fallback) | ❌ No |
| Multi-LLM support | ✅ Yes (Nemotron + Llama + Qwen) | ❌ No |
| Zero infrastructure cost | ✅ Yes (100% sponsor credits) | ❌ N/A |

---

## 10. 3-Day Development Timeline

| Day | Date | Goals |
|---|---|---|
| **Day 1** | May 26 | Project setup, Perfect Corp API integration, core UI (upload + results page) |
| **Day 2** | May 27 | Claude API integration, product recommendation logic, UI polish, mobile responsive |
| **Day 3** | May 28 | Bug fixes, demo video recording, DevPost project page write-up, SUBMIT by 10 AM PT |

---

## 11. Submission Requirements Checklist

**Perfect Corp Challenge:**
- [ ] Registered on DevPost under Perfect Corp challenge
- [ ] At least 1 Perfect Corp API integrated and demonstrated
- [ ] Project page with write-up & screenshots
- [ ] Demo video (1–3 minutes) showing end-to-end experience
- [ ] Clear consumer/retail value demonstrated
- [ ] Ready for exit interview if chosen as winner
- [ ] Questionnaire completed (if winner)

**Crusoe Challenge:**
- [ ] Registered on DevPost under Crusoe challenge
- [x] Nemotron running on Crusoe Cloud Managed Inference (`hack-crusoe/Nemotron-3-Nano-30B-A3B-FP8`)
- [x] Agent calling Crusoe inference endpoint — confirmed `llm_source: nemotron` ✅
- [x] Contact eacheampong@crusoe.ai → API key & model sudah diterima

**TrueFoundry Challenge:**
- [ ] Registered on DevPost under TrueFoundry challenge
- [ ] TrueFoundry AI Gateway integrated as LLM router
- [ ] Fallback chain demonstrated (Claude → Crusoe → Static)
- [ ] Error handling & graceful degradation shown in demo video
- [ ] Join Discord: https://discord.com/channels/1397947827921096845/1503438187941462268

---

## 12. Project Structure (Actual)

```
skinmatch-ai/
├── app/
│   ├── layout.tsx                # Root layout + metadata
│   ├── globals.css               # Tailwind CSS + CSS variables + Framer Motion keyframes
│   │                             #   (@keyframes float, shimmer, pulse-ring; .orb, .glass-card, .shimmer-text)
│   ├── page.tsx                  # Landing page — animated hero, floating orbs, glassmorphism cards
│   ├── analyze/
│   │   └── page.tsx              # Upload & camera page — gradient bg, sticky blur header
│   ├── results/
│   │   └── page.tsx              # Skin report card — gradient bg, sticky blur header
│   └── api/
│       ├── analyze/
│       │   └── route.ts          # Perfect Corp API handler (POST) — maxDuration: 60s
│       └── routine/
│           └── route.ts          # LLM fallback chain handler (POST)
├── components/
│   ├── CameraCapture.tsx         # Camera/upload/preview — AnimatePresence slide transitions
│   ├── SkinReportCard.tsx        # Skin profile + routine + products — staggered card reveals
│   ├── RoutineStep.tsx           # Routine step card — slide-in + badge pop-in animation
│   ├── ProductCard.tsx           # Product card — whileInView + hover lift + tap scale
│   └── FallbackBanner.tsx        # UI notice when fallback LLM is active
├── data/
│   ├── products.json             # Tidak dipakai — LLM generate produk secara dinamis
│   └── static-routines.json     # Fallback L5: pre-written routines untuk 5 skin types
├── lib/
│   ├── perfectcorp.ts            # Perfect Corp API client — 4-step async flow + SkinAnalysisResult types
│   ├── llm-gateway.ts            # TrueFoundry AI Gateway client — handle reasoning model (content null)
│   ├── crusoe.ts                 # Crusoe Cloud client — model constants (Nemotron/Llama/Qwen)
│   ├── fallback-chain.ts         # Orchestrates 5-level fallback chain + RoutineResult types
│   └── static-routines.ts       # Reads static-routines.json → RoutineResult
├── .env.local                    # API keys (tidak di-commit)
├── .env.example                  # Template env vars
├── next.config.ts                # Next.js config
├── tsconfig.json                 # TypeScript config
├── postcss.config.mjs            # PostCSS + Tailwind v4 config
├── eslint.config.mjs             # ESLint config
├── package.json                  # Dependencies (incl. framer-motion)
└── CONTEXT.md                    # This file
```

---

## 13. Progress

### Sesi 1 — 25 Mei 2026

**Status: Setup selesai. Project siap untuk integrasi API.**

#### Selesai
- [x] Next.js 15 + TypeScript + Tailwind CSS v4 project setup (manual — folder tidak kosong)
- [x] Install semua dependencies: `next`, `react`, `axios`, `react-webcam`, `lucide-react`, `clsx`, `tailwind-merge`
- [x] Semua halaman dibuat: landing (`/`), analyze (`/analyze`), results (`/results`)
- [x] API routes dibuat: `POST /api/analyze`, `POST /api/routine`
- [x] Semua 5 components dibuat dengan UI fungsional
- [x] Semua 4 lib files dibuat: `perfectcorp.ts`, `crusoe.ts`, `llm-gateway.ts`, `fallback-chain.ts`
- [x] `static-routines.json` terisi lengkap untuk 5 skin types (oily, dry, combination, sensitive, normal)
- [x] `.env.local` + `.env.example` template dibuat
- [x] `npm run build` → **sukses, 0 TypeScript errors**
- [x] Full flow data sudah tersambung: upload → `/api/analyze` → `/api/routine` → results page via `sessionStorage`

#### Belum dikerjakan (Next Session)
- [ ] Setup TrueFoundry Virtual Model di dashboard + isi `TRUEFOUNDRY_API_KEY`
- [ ] UI polish: tampilan landing, analyze, results page — mobile responsive
- [ ] `products.json` diisi dengan database produk nyata
- [ ] Test full end-to-end dengan foto wajah asli
- [ ] Register di DevPost untuk ketiga sponsor challenge
- [ ] Demo video (1–3 menit)

---

### Sesi 2 — 25 Mei 2026

**Status: Perfect Corp API + Crusoe/Nemotron aktif. `/api/routine` returns `llm_source: nemotron` ✅**

#### Selesai
- [x] `.gitignore` dibuat — `.env.local` terlindungi dari git
- [x] `.env.example` dibersihkan dari secret yang tidak sengaja masuk
- [x] **Perfect Corp API** — 4-step async flow diimplementasi di `lib/perfectcorp.ts`:
  - Step 1: `POST /s2s/v2.0/file/skin-analysis` → dapat presigned S3 URL + `file_id`
  - Step 2: `PUT` image langsung ke S3
  - Step 3: `POST /s2s/v2.0/task/skin-analysis` → dapat `task_id`
  - Step 4: `GET` poll sampai `task_status: success`
- [x] Perfect Corp response parsing difix — semua response dibungkus `{ status, data: { ... } }`
- [x] `dst_actions` difix: `dark_circle_v2` (bukan `dark_circle`), tambah `oiliness`, `age_spot`, `skin_type`
- [x] **Crusoe Cloud** — API key dari Emmanuel Acheampong (Crusoe DevRel)
  - Model: `hack-crusoe/Nemotron-3-Nano-30B-A3B-FP8` (hackathon-specific deployment)
  - Nemotron adalah reasoning model — `content` bisa `null`, fallback ke field `reasoning`
  - `max_tokens` dinaikkan ke 3000 agar ada ruang untuk thinking + output JSON
  - API key mengandung `$` → harus di-escape dengan `\$` di `.env.local`
- [x] **TrueFoundry AI Gateway** — `lib/llm-gateway.ts` diupdate:
  - Base URL: `https://gateway.truefoundry.ai`
  - Virtual model name dikonfigurasi via `TRUEFOUNDRY_MODEL_ID` env var
- [x] **Fallback chain** direvisi jadi 5 level di `lib/fallback-chain.ts`:
  - L1: TrueFoundry Gateway (internal routing: Nemotron → Llama → Qwen via priority)
  - L2: Nemotron langsung ke Crusoe (bypass TrueFoundry)
  - L3: Llama-3.3 langsung ke Crusoe
  - L4: Qwen langsung ke Crusoe
  - L5: Static JSON rules engine
- [x] `/api/routine` endpoint — dikonfirmasi `llm_source: nemotron` ✅

#### Belum dikerjakan (Next Session)
- [x] Setup TrueFoundry Virtual Model di dashboard + isi `TRUEFOUNDRY_API_KEY` ← selesai Sesi 3
- [x] UI polish: tampilan landing, analyze, results page — animasi + mobile responsive ← selesai Sesi 3
- [ ] Test full end-to-end dengan foto wajah asli
- [ ] Register di DevPost untuk ketiga sponsor challenge
- [ ] Demo video (1–3 menit)

---

### Sesi 3 — 25 Mei 2026

**Status: TrueFoundry aktif + UI polish dengan Framer Motion selesai ✅**

#### Selesai
- [x] **TrueFoundry AI Gateway** — setup selesai:
  - Provider: `crusoe-cloud` (Self-Hosted, OpenAI-compatible, URL: `https://api.inference.crusoecloud.com/v1`)
  - Models: Nemotron-3-Nano ✅, Llama-3.3-70B ✅, Qwen3-235B ✅ (3/3 passed)
  - Qwen model name difix: `Qwen/Qwen3-235B-A22B-Instruct-2507` (bukan `qwen/Qwen3-235B-A22B`)
  - Virtual Model Group: `skinmatch-ai` → Virtual Model: `skinmatch-routine` (Priority routing: Nemotron→Llama→Qwen)
  - `TRUEFOUNDRY_MODEL_ID=skinmatch-ai/skinmatch-routine` (format: group/model)
  - `TRUEFOUNDRY_API_KEY` terisi → L1 gateway confirmed working (`llm_source: truefoundry`)
  - Fix di `lib/llm-gateway.ts`: handle Nemotron reasoning model (`content: null` → fallback ke `reasoning` field), `max_tokens` dinaikkan ke 3000
  - Fix di `lib/crusoe.ts`: Qwen model name diupdate ke `Qwen/Qwen3-235B-A22B-Instruct-2507`
- [x] **UI Polish** — Framer Motion animations:
  - `framer-motion` diinstall
  - `app/globals.css`: CSS keyframes `float`, `float-slow`, `shimmer`, `pulse-ring`; class `.orb`, `.orb-rose`, `.orb-purple`, `.orb-peach`, `.shimmer-text`, `.glass-card`
  - `app/page.tsx`: floating gradient orbs, hero stagger fade-up, "your routine." shimmer text, feature cards glassmorphism + whileInView + hover lift
  - `app/analyze/page.tsx`: gradient background, sticky blur header, entrance animation
  - `app/results/page.tsx`: gradient background, sticky blur header, entrance animation
  - `components/CameraCapture.tsx`: AnimatePresence slide transition antar mode, button whileHover/whileTap
  - `components/SkinReportCard.tsx`: staggered card reveals, concern tags pop-in, emoji section headers
  - `components/ProductCard.tsx`: whileInView + hover lift + tap scale, stagger by index
  - `components/RoutineStep.tsx`: slide-in dari kiri + badge scale pop-in dengan stagger
- [x] `products.json` — tidak perlu diisi, LLM generate produk secara dinamis (field `products` di `RoutineResult`)
- [x] `npm run build` → sukses, 0 TypeScript errors

#### Belum dikerjakan (Next Session)
- [x] Test full end-to-end dengan foto wajah asli ← selesai Sesi 3
- [ ] Register di DevPost untuk ketiga sponsor challenge
- [ ] Deploy ke Vercel
- [ ] Demo video (1–3 menit)

---

### Sesi 3 (lanjutan) — 25 Mei 2026

**Status: End-to-end test BERHASIL dengan foto wajah asli ✅**

#### Selesai
- [x] **End-to-end test** dengan foto wajah asli — full pipeline confirmed:
  - Upload foto → Perfect Corp API → skin_type: `normal`, skin_tone: `light-medium` ✅
  - LLM routine generation → 5 morning steps + 4 night steps ✅
  - 6 product recommendations (CeraVe, The Ordinary, Cosrx, Innisfree, La Roche-Posay, Neutrogena) ✅
  - Results page tampil sempurna dengan semua animasi Framer Motion ✅

#### Belum dikerjakan (Next Session)
- [ ] Register di DevPost untuk ketiga sponsor challenge
- [ ] Deploy ke Vercel
- [ ] Demo video (1–3 menit)

---

## 14. Catatan Sesi Terakhir

**Sesi: 25 Mei 2026 (Sesi 3)**

- TrueFoundry Personal Access Token hanya tampil **sekali** saat dibuat — jika tidak disalin saat itu, harus buat token baru
- TrueFoundry `TRUEFOUNDRY_MODEL_ID` harus format `group/model` → `skinmatch-ai/skinmatch-routine` (bukan hanya `skinmatch-routine`)
- Qwen model name di Crusoe: `Qwen/Qwen3-235B-A22B-Instruct-2507` (bukan `qwen/Qwen3-235B-A22B`) — ditemukan via `GET /v1/models`
- Nemotron via TrueFoundry Gateway juga bisa return `content: null` (reasoning model) — fix sama seperti direct Crusoe: tambah fallback baca dari `reasoning` field di `lib/llm-gateway.ts`
- TrueFoundry gateway kadang return empty untuk Nemotron → L1 skip ke L2 (direct Crusoe) secara otomatis, user selalu dapat response
- Framer Motion `ease: "easeOut"` tidak bisa dipakai sebagai string di `transition` prop — solusi: hapus `ease` (pakai default Framer Motion) atau gunakan bezier array `[number, number, number, number]`
- `bg-gradient-to-br` harus ditulis sebagai `bg-linear-to-br` di Tailwind v4 (canonical class)
- `products.json` tidak perlu diisi — LLM sudah generate produk secara dinamis sebagai bagian dari `RoutineResult.products`

---

*Last updated: May 25, 2026 — Sesi 3*
*Hackathon: DevNetwork [AI + ML] Hackathon 2026*
*Challenges: Perfect Corp + Crusoe + TrueFoundry*