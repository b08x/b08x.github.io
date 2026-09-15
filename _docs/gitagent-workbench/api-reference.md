---
title: API reference
description: "GitAgent Workbench exposes a local HTTP API through server.ts on port 3000. The frontend communicates with this API for key management, model listing, and AI generation."
permalink: /docs/gitagent-workbench/api-reference/
doc_set: gitagent-workbench
source_path: docs/api-reference.md
nav_order: 5
toc: true
generated_by: sync-docs.sh
nav_prev:
  title: Architecture overview
  url: /docs/gitagent-workbench/architecture/
nav_next:
  title: Troubleshooting
  url: /docs/gitagent-workbench/troubleshooting/
---

## Endpoints

| Method | Path | Description | Request | Response |
|--------|------|-------------|---------|----------|
| GET | `/api/health` | Health check | - | `{ ok, timestamp, keysPresent, envKeys }` |
| GET | `/api/providers` | Provider status | - | `{ [providerId]: { hasKey, isEnv } }` |
| POST | `/api/test-key` | Validate API key | `{ providerId, apiKey }` | `{ ok }` or `{ ok: false, error }` |
| GET | `/api/models/:providerId` | List models | - | `{ data: [{ id, name }] }` |
| POST | `/api/keys` | Store/clear server key | `{ providerId, key }` | `{ success }` |
| POST | `/api/compute/v1` | Text generation | `{ prompt, modelId, providerId, options, apiKey }` | `{ text }` or `{ object }` |
| POST | `/api/agent/compile-stream` | Streaming architect (SSE) | `{ prompt, modelId, providerId, options, targetFramework }` | SSE events |
| POST | `/api/stream` | Streaming generation (SSE) | `{ prompt, modelId, providerId, options, apiKey }` | SSE chunks |

## Endpoint Details

### GET /api/health

Returns server health status and which API keys are available from environment variables.

**Response:**
```json
{
  "ok": true,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "keysPresent": ["google", "openai"],
  "envKeys": ["google"]
}
```

### GET /api/providers

Returns the status of all known providers — whether they have keys configured and whether those keys came from environment variables.

**Response:**
```json
{
  "google": { "hasKey": true, "isEnv": true },
  "openai": { "hasKey": false, "isEnv": false },
  "anthropic": { "hasKey": true, "isEnv": false }
}
```

### POST /api/test-key

Validates an API key by making a lightweight request to the provider.

**Request:**
```json
{
  "providerId": "openai",
  "apiKey": "sk-proj-..."
}
```

**Response:**
```json
{ "ok": true }
```

### GET /api/models/:providerId

Lists available models for a provider. Currently supported: `openai`, `google`, `groq`, `mistral`, `openrouter`.

**Response:**
```json
{
  "data": [
    { "id": "gpt-4o", "name": "GPT-4o" },
    { "id": "gpt-4o-mini", "name": "GPT-4o Mini" }
  ]
}
```

### POST /api/keys

Stores or clears an API key on the server side.

**Request:**
```json
{
  "providerId": "anthropic",
  "key": "sk-ant-..."
}
```

To clear a key, send `null` or empty string as the `key`.

### POST /api/compute/v1

The primary generation endpoint. Accepts a structured prompt and returns either raw text or a parsed JSON object.

**Request:**
```json
{
  "prompt": { "system": "...", "user": "..." },
  "modelId": "gemini-3.7-flash",
  "providerId": "google",
  "options": { "temperature": 0.7, "maxTokens": 4096 },
  "apiKey": "optional-client-key"
}
```

The prompt can also include a `schema` field for structured output, or `messages` array for multi-turn conversation.

**Fallback behavior:** If the primary provider fails, the server tries the server-side key, then falls back to Google Gemini if available. If all external calls fail, it activates the built-in local synthesis engine for architect requests.

### POST /api/agent/compile-stream

Streaming endpoint for the Agent Architect. Returns Server-Sent Events (SSE) with progressive stages:

1. `stage` event — intent analysis
2. `partial` event — manifest metadata
3. `partial` event — identity & soul
4. `partial` event — operational rules
5. `partial` event — domain skills
6. `complete` event — final specification

**Response format:**
```
event: stage
data: {"stage":"intent","label":"Parsing intent...","progress":15}

event: partial
data: {"stage":"manifest","label":"Drafting manifest...","progress":35,"data":{...}}

event: complete
data: {"stage":"done","progress":100,"object":{...}}

data: [DONE]
```

### POST /api/stream

General-purpose streaming generation endpoint. Returns SSE chunks of generated text.

**Response format:**
```
data: {"chunk":"Hello"}

data: {"chunk":" world"}

data: [DONE]
```

## Environment Variable Mapping

The server maps environment variables to provider IDs. Multiple env var names are checked per provider:

| Provider | Environment Variables |
|----------|----------------------|
| `google` | `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `AI_STUDIO_API_KEY`, `API_KEY`, `VITE_GEMINI_API_KEY`, `VITE_GOOGLE_API_KEY` |
| `openai` | `OPENAI_API_KEY`, `VITE_OPENAI_API_KEY` |
| `anthropic` | `ANTHROPIC_API_KEY`, `VITE_ANTHROPIC_API_KEY` |
| `mistral` | `MISTRAL_API_KEY`, `VITE_MISTRAL_API_KEY` |
| `groq` | `GROQ_API_KEY`, `VITE_GROQ_API_KEY` |
| `openrouter` | `OPENROUTER_API_KEY`, `VITE_OPENROUTER_API_KEY` |
| `ollama` | `OLLAMA_BASE_URL` |

Keys from environment variables are used as fallbacks when client-side keys are not provided or fail validation.

## Default Models

When no model ID is specified, the server defaults to:

| Provider | Default Model |
|----------|---------------|
| `google` | `gemini-3.7-flash` |
| `openai` | `gpt-4o-mini` |
| `anthropic` | `claude-3-5-haiku-20241022` |
| `groq` | `llama-3.3-70b-versatile` |
| `mistral` | `mistral-small-latest` |
| `ollama` | `llama3.2` |
| `openrouter` | `openai/gpt-4o-mini` |
