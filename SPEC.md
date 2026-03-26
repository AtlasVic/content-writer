# Content Writer AI - Specification

## Project Overview
- **Name:** Content Writer AI
- **Type:** Full-stack web application (Next.js + FastAPI)
- **Core functionality:** AI-powered content generation for various content types
- **Target users:** Content creators, marketers, small business owners

## Architecture

### Stack
- **Frontend:** Next.js 16 + TypeScript + TailwindCSS
- **Backend:** FastAPI (Python)
- **AI Providers:** Anthropic (Claude), OpenAI (GPT), MiniMax, Ollama (local)

### System Diagram
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Browser  │────▶│   Next.js FE     │────▶│   FastAPI BE   │
│   (Port 3002)   │     │   (Next.js 16)   │     │  (Port 8002)   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                        │
                      ┌─────────────────────────────────┼─────────────────┐
                      │                  AI Providers  │                 │
                      ▼                  ▼               ▼                 ▼
              ┌───────────────┐  ┌─────────────┐  ┌───────────┐  ┌───────────┐
              │  Anthropic   │  │   OpenAI    │  │ MiniMax   │  │  Ollama   │
              │  (Claude)     │  │  (GPT-4o)  │  │  (M2.1)   │  │  (Local)  │
              └───────────────┘  └─────────────┘  └───────────┘  └───────────┘
```

### API Endpoints

#### POST /generate
Generate content based on content type and model.

**Request:**
```json
{
  "content_type": "blog",
  "model": "claude-3-haiku-20240307",
  "inputs": {
    "topic": "...",
    "audience": "...",
    "tone": "...",
    "word_count": "500"
  },
  "api_key": "optional override"
}
```

**Response:**
```json
{
  "content": "generated text...",
  "model": "claude-3-haiku-20240307"
}
```

#### GET /health
Health check endpoint.

---

## UI/UX Specification

### Layout
- Single page application
- Header with app title and dark mode toggle
- Content type selector toolbar (horizontal buttons)
- Two-column layout: Form (left) | Output (right)

### Visual Design

#### Colors
- **Primary:** Indigo (#6366F1)
- **Background (Light):** Gray 50 (#F9FAFB)
- **Background (Dark):** Gray 900 (#111827)
- **API Key Section:** Yellow (#FEF3C7) / Dark: Yellow 900/30
- **Model Section:** Indigo 50 (#EEF2FF) / Dark: Indigo 900/30

#### Dark Mode
- Toggle button in header (🌙/☀️)
- Persists via CSS class on root element

### Components
1. **Content Type Buttons** - 5 types: Blog, Social, Product, Email, Ad
2. **API Key Input** - Yellow highlight, always visible
3. **Model Selector** - Dropdown with 6 options
4. **Dynamic Form Fields** - Changes based on content type
5. **Generate Button** - Full width, disabled during loading
6. **Output Panel** - Shows generated content + copy button

---

## Content Types

| Type | Fields |
|------|--------|
| Blog Post | topic, audience, tone, word_count |
| Social Media | topic, platform, tone, count |
| Product Description | product_name, features, audience, tone |
| Email Template | email_type, context, tone |
| Ad Copy | product, platform, goal, character_limit |

---

## Models

| Provider | Model ID | Description |
|----------|----------|-------------|
| Anthropic | claude-3-haiku-20240307 | Fast, cheap |
| Anthropic | claude-3-5-sonnet-20241022 | Better quality |
| OpenAI | gpt-4o-mini | Fast, cheap |
| OpenAI | gpt-4o | Best quality |
| MiniMax | abab6.5s-chat | Group ID required |
| Ollama | local model | No key needed |

---

## Project Structure
```
content-writer/
├── SPEC.md                 # This file
├── README.md               # Setup instructions
├── backend/
│   ├── README.md           # Backend setup
│   ├── requirements.txt    # Python deps
│   └── app/
│       └── main.py         # FastAPI app
└── frontend/
    ├── package.json        # Node deps
    ├── src/app/
    │   ├── page.tsx        # Main UI component
    │   ├── layout.tsx     # Root layout
    │   └── globals.css     # Tailwind
    └── tailwind.config.ts # Tailwind config
```

---

## Acceptance Criteria

- [x] Frontend loads without errors
- [x] All 5 content types work with appropriate prompts
- [x] Model selector shows all options
- [x] API calls work via backend (no CORS issues)
- [ ] Dark mode toggle works and persists
- [x] Output displays generated content
- [x] Copy button works
- [ ] Ollama works properly (debug needed)

---

## Setup Commands

### Backend
```bash
cd backend
pip install fastapi uvicorn anthropic openai httpx
uvicorn app.main:app --port 8002
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- -p 3002
```