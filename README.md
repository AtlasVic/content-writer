# Content Writer AI

AI-powered content generation for blogs, social media, product descriptions, emails, and ads.

## Features

- **5 Content Types:** Blog Post, Social Media, Product Description, Email Template, Ad Copy
- **Multiple AI Models:** Anthropic (Claude), OpenAI (GPT), MiniMax, Ollama (local)
- **Dark Mode:** Toggle between light and dark themes
- **Copy to Clipboard:** One-click copy of generated content

## Tech Stack

- **Frontend:** Next.js 16 + TypeScript + TailwindCSS
- **Backend:** FastAPI (Python)
- **AI:** Anthropic, OpenAI, MiniMax, Ollama

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- (Optional) Ollama installed locally

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn anthropic openai httpx

# Create .env file with your API keys (see .env.example)
cp .env.example .env

uvicorn app.main:app --port 8002
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Running Both

```bash
# Terminal 1 - Backend
cd backend && uvicorn app.main:app --port 8002

# Terminal 2 - Frontend
cd frontend && npm run dev -- -p 3002
```

## Usage

1. Open http://localhost:3002
2. Select a content type (Blog, Social, Product, Email, Ad)
3. Choose an AI model
4. Enter your API key (not needed for Ollama)
5. Fill in the form fields
6. Click "Generate Content"

## API Keys

- **Anthropic:** Get from https://console.anthropic.com/settings/keys (starts with `sk-ant-api03-`)
- **OpenAI:** Get from https://platform.openai.com/api-keys (starts with `sk-`)
- **MiniMax:** Use format `group_id:api_key`
- **Ollama:** No key needed, just enter your model name (e.g., `llama3.2:1b`)

## Project Structure

```
content-writer/
├── backend/
│   ├── app/
│   │   └── main.py       # FastAPI backend
│   ├── .env.example      # Environment template
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/app/
│   │   └── page.tsx      # Main UI component
│   └── package.json     # Node dependencies
├── SPEC.md               # Project specification
└── README.md             # This file
```

## License

MIT