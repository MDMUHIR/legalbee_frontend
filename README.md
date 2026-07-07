<p align="center">
  <img src="src/assets/legal-bee-logo.png" alt="Legal Bee Logo" width="120" />
</p>

<h1 align="center">LEGAL BEE</h1>
<p align="center"><strong>AI-Powered Legal Assistant for Bangladesh</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/react-18-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/typescript-5.8-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-5.4-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwind-3.4-38bdf8?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/python-fastapi-green?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

---

## Overview

**Legal Bee** is an AI-powered legal assistant that provides instant, citation-backed answers to questions about Bangladeshi law. Built on a multi-agent Retrieval-Augmented Generation (RAG) architecture, it searches through a vector database of Bangladesh's Acts, Ordinances, Rules, and Amendments to deliver accurate, verifiable legal information — in both English and Bengali.

> **Disclaimer:** Legal Bee provides general legal information. It is **not** a substitute for professional legal advice from a qualified lawyer.

---

## Features

### Core Capabilities
- **Legal Q&A** — Ask any question about Bangladeshi law, from criminal penalties to constitutional rights
- **Law Search** — Search across the entire legal corpus with metadata filters (act name, year, section, chapter)
- **Fact Analysis** — Describe a real-world scenario and receive a structured legal analysis
- **Act Summarization** — Get concise summaries of any Bangladeshi Act or Ordinance
- **Amendment Tracking** — Compare laws before and after amendments

### AI & Accuracy
- **5 specialized agents** behind an intelligent query router that auto-detects intent
- **Anti-hallucination** — all answers are grounded in retrieved legal text with verified citations
- **Confidence scoring** — every response includes a High / Medium / Low confidence rating
- **Bilingual** — full English and Bengali support for both input and output

### User Experience
- **Professional chat interface** with rich markdown rendering (headings, blockquotes, lists, code)
- **Collapsible citations** showing the exact legal source for every answer
- **Voice input** (Bengali speech recognition) and **text-to-speech** output
- **Dark / light mode** with system preference detection
- **Responsive design** — works on desktop, tablet, and mobile
- **Emergency contacts** — quick-access panel with Bangladesh emergency hotlines

### Platform
- **Lawyer directory** — browse verified legal professionals by specialty
- **Supabase authentication** — email/password registration and session management

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui |
| **Routing** | React Router v6 |
| **Data Fetching** | TanStack React Query v5 |
| **Markdown Rendering** | react-markdown + remark-gfm |
| **Typography** | @tailwindcss/typography |
| **Icons** | Lucide React |
| **Auth** | Supabase |
| **Voice** | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| **Notifications** | Sonner + shadcn/ui Toast |
| **Backend** | Python FastAPI |
| **Vector DB** | Qdrant (BGE-M3 embeddings) |
| **Orchestration** | LangGraph multi-agent workflow |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                   │
│  ┌───────────┐  ┌──────────────┐  ┌───────────┐  ┌───────────┐ │
│  │ Chat UI   │  │ Lawyer Dir   │  │ Emergency │  │ Settings  │ │
│  │ (Markdown,│  │ (Directory,  │  │ (Hotlines)│  │ (Theme,   │ │
│  │  Voice,   │  │  Reviews)    │  │           │  │  Auth)    │ │
│  │  TTS)     │  │              │  │           │  │           │ │
│  └─────┬─────┘  └──────────────┘  └───────────┘  └───────────┘ │
│        │                                                         │
│  ┌─────┴─────┐                                                   │
│  │ API Layer │  (fetch wrapper + React Query)                   │
│  └─────┬─────┘                                                   │
└────────┼────────────────────────────────────────────────────────┘
         │  HTTPS
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + LangGraph)                 │
│                                                                   │
│  ┌──────────────┐                                                │
│  │ Query Router │  intent detection + language detection         │
│  └──────┬───────┘                                                │
│         │                                                         │
│    ┌────┼────┬──────────┬──────────┐                             │
│    ▼    ▼     ▼          ▼          ▼                             │
│  ┌────┐┌────┐┌────────┐┌────────┐┌────────┐                    │
│  │Law ││Fact││  Act   ││Amend.  ││ Legal  │                    │
│  │Srch││Anlys││Summary ││Compare ││  QA    │                    │
│  └──┬─┘└──┬─┘└───┬────┘└───┬────┘└───┬────┘                    │
│     │     │      │          │          │                          │
│     └─────┴──────┴──────────┴──────────┘                         │
│                       │                                           │
│              ┌────────┴────────┐                                  │
│              │  Qdrant Vector  │  BGE-M3 embeddings               │
│              │    Database     │  (Bangladeshi laws)              │
│              └────────┬────────┘                                  │
│                       │                                           │
│              ┌────────┴────────┐                                  │
│              │   Citation      │  verify + format references      │
│              │   Verification  │                                  │
│              └─────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
```

The **Query Router** classifies every user question into one of five intent types and routes it to the appropriate specialized agent. Each agent retrieves relevant legal chunks from Qdrant, verifies citations, and returns a confidence-scored response with traceable references.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/legalbee.git
cd legalbee

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Backend API URL (defaults to Hugging Face Spaces deployment)
VITE_API_BASE_URL=https://your-api-url.com

# Supabase (for authentication)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:8080` with hot module replacement.

### Production Build

```bash
npm run build
npm run preview    # preview the production build locally
```

---

## API Backend

The frontend communicates with a **Python FastAPI** backend. See [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md) for the complete API reference.

### Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/chat` | Legal Q&A (auto intent detection + language detection) |
| `POST` | `/api/search` | Raw law search with metadata filters |
| `POST` | `/api/analyze` | Fact analysis from real-world scenarios |
| `POST` | `/api/summary` | Act / Ordinance summarization |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/languages` | Supported languages (en, bn) |

### Running the backend locally

```bash
cd backend
python -m app.main
# or
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API docs are available at:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

---

## Project Structure

```
legalbee/
├── index.html                      # Entry HTML
├── package.json                    # Dependencies & scripts
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind + typography config
├── tsconfig.json                   # TypeScript configuration
├── .env.example                    # Environment variables template
├── API_DOCUMENTATION.md            # Backend API reference
├── AUTH_SETUP.md                   # Authentication setup guide
├── public/                         # Static assets
└── src/
    ├── main.tsx                    # React entry point
    ├── App.tsx                     # Root component (routing + providers)
    ├── index.css                   # Global styles (Tailwind + design system)
    ├── lib/
    │   ├── config.ts               # API configuration & endpoints
    │   └── utils.ts                # cn() utility (clsx + tailwind-merge)
    ├── types/
    │   └── api.ts                  # TypeScript interfaces for all API responses
    ├── services/
    │   └── api.ts                  # Typed fetch wrapper for all endpoints
    ├── hooks/
    │   ├── use-mobile.tsx          # Mobile viewport detection
    │   └── use-toast.ts            # Toast notification state
    ├── pages/
    │   ├── Index.tsx               # Main chat page
    │   └── NotFound.tsx            # 404 page
    ├── components/
    │   ├── chat/
    │   │   └── ChatInterface.tsx   # Chat UI (markdown, voice, TTS)
    │   ├── layout/
    │   │   └── Header.tsx          # Navigation bar with actions
    │   ├── emergency/
    │   │   └── EmergencyButton.tsx # Emergency hotlines modal
    │   ├── sponsorship/
    │   │   └── SponsorshipPage.tsx # Lawyer directory & reviews
    │   └── ui/                     # shadcn/ui components (40+)
    │       ├── DisclaimerBanner.tsx
    │       ├── ThemeToggle.tsx
    │       └── ...
    └── assets/
        └── legal-bee-logo.png
```

---

## Key Features in Detail

### Professional Chat Interface

The chat UI renders bot responses as rich markdown with the `@tailwindcss/typography` plugin:

- **`#` / `##` / `###`** → Hierarchical headings
- **`>`** → Blockquoted legal text excerpts with accent border
- **`-` / `*`** → Bullet-point lists
- **`` ` ``** → Inline code formatting
- **Citations** → Collapsible dropdown showing exact legal references
- **Confidence badge** → Color-coded pill (High/Medium/Low)

### Voice & Accessibility

- **Speech-to-text:** Bengali voice input using the Web Speech API (`bn-BD` locale)
- **Text-to-speech:** Bot responses can be read aloud in Bengali
- Both features work entirely client-side with no external dependencies

### Emergency Contacts

A dedicated panel with verified Bangladesh emergency hotlines:
- National Emergency Service: **999**
- Women & Children Helpline: **109**
- National Human Rights: **16108**
- Anti-Corruption Commission: **106**
- And more — each with direct call (`tel:`) links

### Authentication (Supabase)

See [`AUTH_SETUP.md`](AUTH_SETUP.md) for setup instructions. Requires environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Contributing

Contributions are welcome. Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgements

- **[shadcn/ui](https://ui.shadcn.com/)** — beautifully designed React components
- **[Qdrant](https://qdrant.tech/)** — high-performance vector search
- **[LangGraph](https://langchain.com/langgraph)** — agent orchestration framework
- **[BGE-M3](https://huggingface.co/BAAI/bge-m3)** — multilingual embedding model
- **Bangladesh Legislative Information System** — source of legal texts
