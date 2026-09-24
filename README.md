# ModelForge — AI Model Experimentation Platform

ModelForge is a full-stack, developer-first AI experimentation platform built for engineers and researchers to discover, execute, benchmark, and orchestrate multiple machine learning architectures through a unified studio interface.

---

## Key Features

- **Multi-Modal AI Exploration**: Browse, filter, and inspect detailed architecture cards, parameter configurations, and task metadata for cutting-edge models.
- **Dynamic Task-Tailored Playground**:
  - **LLM Reasoning**: Multi-turn prompts, hyperparameter controls (temperature, max tokens), and markdown synthesis.
  - **Sentiment Analysis**: Polarity detection gauge and probability distribution metrics.
  - **Neural Machine Translation**: Instant translation between languages with built-in voice pronunciation synthesis.
  - **Document Summarization**: Abstractive text distillation with word counts and compression ratio telemetry.
  - **Vision Classification**: Vision Transformer (ViT) patch classification with top-5 confidence breakdowns.
  - **Object Detection**: ResNet-50 DETR object extraction with interactive canvas bounding box overlays.
  - **Multimodal Visual QA**: Qwen2.5-VL vision-language understanding for scene description and visual reasoning.
  - **Acoustic Speech-to-Text**: Whisper Large v3 automatic speech recognition with file uploads and in-browser live microphone recording.
  - **Dense Text Embeddings**: 384-dimensional vector coordinate generation with dimensional heatmaps.
  - **Latent Diffusion Generation**: 4-step photorealistic image generation via FLUX.1-schnell with fullscreen inspect and download.
- **Multi-Model Comparison Arena**: Concurrent side-by-side benchmark execution on identical inputs with latency profiling.
- **Visual Workflow Graph Builder**: Chain models into multi-stage autonomous pipelines (e.g., Speech → Sentiment → LLM Briefing, or Image → Detection → VQA) using a drag-and-drop node graph canvas powered by React Flow.
- **Experiment Telemetry & History**: Searchable, filterable audit ledger with JSON payload inspection, re-run actions, and JSON export.
- **API & Code Generator**: Automatic generation of copy-paste ready snippets in Python (`huggingface_hub`), JavaScript (`@huggingface/inference`), cURL, and ModelForge SDK.
- **Supabase Cloud Sync & Auth**: User session management, experiment persistence, and workflow storage with local sandbox fallback.
- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Fast fuzzy search and keyboard shortcut launcher.

---

## Supported Model Architectures

ModelForge provides initial integration with 10 Hugging Face model providers:

| # | Model Identifier | Task / Modality | Architecture / Provider |
|---|-------------------|-----------------|-------------------------|
| 1 | `openai/gpt-oss-120b` | Text Generation & Reasoning | High-capacity open LLM |
| 2 | `distilbert/distilbert-base-uncased-finetuned-sst-2-english` | Text Classification | DistilBERT Transformer |
| 3 | `Helsinki-NLP/opus-mt-en-fr` | Neural Machine Translation | OPUS-MT Seq2Seq |
| 4 | `facebook/bart-large-cnn` | Abstractive Summarization | Meta BART Large CNN |
| 5 | `google/vit-base-patch16-224` | Image Classification | Google Vision Transformer (ViT-B/16) |
| 6 | `facebook/detr-resnet-50` | Object Detection | Meta DETR Transformer + ResNet-50 |
| 7 | `Qwen/Qwen2.5-VL-3B-Instruct` | Visual Question Answering | Qwen Multimodal Vision-Language |
| 8 | `openai/whisper-large-v3` | Speech-to-Text (ASR) | OpenAI Whisper Large v3 |
| 9 | `sentence-transformers/all-MiniLM-L6-v2` | Dense Text Embeddings | 384-dim Sentence Transformer |
| 10 | `black-forest-labs/FLUX.1-schnell` | Text-to-Image Generation | 12B Rectified Flow Transformer |

---

## Architecture & Security

ModelForge separates the frontend experimentation studio from the backend inference gateway to prevent API secret leakage:

```
┌──────────────────────────────┐
│       Frontend (Client)      │
│  React 19 + Vite + Tailwind  │
│  React Flow + Framer Motion  │
└──────────────┬───────────────┘
               │  /api proxy (no tokens on client)
               ▼
┌──────────────────────────────┐
│       Backend (Server)       │
│    Node.js + Express.js      │
│  Secure Hugging Face Proxy   │
└──────┬────────────────┬──────┘
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│Hugging Face │  │  Supabase   │
│Inference API│  │Database/Auth│
└─────────────┘  └─────────────┘
```

- **Zero Client Token Exposure**: All inference requests are authenticated server-side using the `HF_TOKEN` environment variable.
- **Resilient Fallback Simulator**: High-fidelity responses are generated automatically if an upstream model is cold-starting or when testing in sandbox environments.

---

## Technology Stack

### Frontend
- **Framework**: React 19, Vite 8
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Graph & Node Canvas**: `@xyflow/react` (React Flow)
- **Animations & Micro-interactions**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **Cloud Client**: `@supabase/supabase-js`

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **File Handling**: Multer (in-memory buffer parsing for images/audio)
- **Inference Client**: `@huggingface/inference` & direct REST routers
- **Database**: Supabase Client / PostgreSQL

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Installation

Install all client and server dependencies:

```bash
# Install root, server, and client dependencies
npm run install:all
```

Or manually:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Environment Variables

Create `.env` inside the `server/` directory (refer to `server/.env.example`):

```env
PORT=5005
NODE_ENV=development

# Hugging Face Access Token
HF_TOKEN=your_huggingface_token_here

# Supabase Configuration (Optional for cloud sync; local sandbox works out of the box)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup (Optional)

If using Supabase for cloud persistence, execute the migration script provided in [`supabase_schema.sql`](./supabase_schema.sql) in your Supabase SQL Editor.

### 4. Running Locally

Start the backend server and frontend client:

```bash
# Terminal 1 - Start backend server (port 5005)
npm run dev:server

# Terminal 2 - Start frontend dev server
npm run dev:client
```

Open your browser at `http://localhost:5173` (or the port displayed by Vite).

---

## Project Structure

```
ModelForge/
├── client/                      # React Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Navbar, Sidebar, CommandPalette, Toast
│   │   │   ├── models/          # ModelCard, ModelSelector
│   │   │   └── playground/      # Dynamic inputs & tailored output visualizers
│   │   ├── context/             # AuthContext (Supabase / Guest Sandbox)
│   │   ├── pages/               # Landing, Dashboard, Explorer, Playground, Compare, Workflows, History, ApiCode, Settings
│   │   ├── services/            # API client layer & Supabase helpers
│   │   ├── App.jsx              # Main router and layout
│   │   ├── index.css            # Tailwind & glassmorphism styles
│   │   └── main.jsx             # React entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express Backend
│   ├── src/
│   │   ├── config/              # Model catalog registry (10 models) & Supabase config
│   │   ├── routes/              # Model inference, Compare, Workflow, Experiment, and Code routes
│   │   ├── services/            # Hugging Face inference gateway, Workflow graph engine, Experiment store
│   │   └── index.js             # Express application entrypoint
│   ├── .env.example
│   └── package.json
│
├── supabase_schema.sql          # Supabase SQL database schema
├── .env.example                 # Root environment template
├── .gitignore
├── package.json
└── README.md
```

---

## Future Roadmap

- Additional Model Providers (Google Gemini, OpenAI, Anthropic, Ollama, Replicate).
- Batch inference and dataset CSV upload benchmarking.
- Model latency and cost optimization recommendation engine.
- Fine-tuning telemetry and dataset evaluation pipelines.
