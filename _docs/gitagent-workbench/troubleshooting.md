---
title: Troubleshooting
description: "Common issues and solutions when using GitAgent Workbench."
permalink: /docs/gitagent-workbench/troubleshooting/
doc_set: gitagent-workbench
source_path: docs/troubleshooting.md
nav_order: 6
toc: true
generated_by: sync-docs.sh
nav_prev:
  title: API reference
  url: /docs/gitagent-workbench/api-reference/
---

## API Key Issues

### "Invalid API key" or "API_KEY_INVALID"

**Cause:** The API key is invalid, expired, or malformed.

**Fix:**
1. Open Settings and verify your API key
2. Click "Test Key" to validate it
3. Ensure there are no trailing spaces or newline characters
4. Check that the key hasn't been revoked or expired at the provider

### "Authentication failed" (401)

**Cause:** The API key doesn't have the required permissions.

**Fix:**
- For Google: Ensure the key has Generative AI API enabled
- For OpenAI: Check that the key has model access (not a restricted key)
- For Anthropic: Verify the key has the correct workspace/organization

### "Rate limit or quota exceeded" (429)

**Cause:** Too many requests or quota exhausted.

**Fix:**
- Wait a few minutes and retry
- Switch to a different provider in Settings
- Use the Built-in Engine (no API key required) for basic generation

### Server key vs client key mismatch

The server tries client-provided keys first, then falls back to environment variable keys. If your client key fails but a server key exists for the same provider, the server will retry with the server key automatically.

## Generation Errors

### "Provider not found"

**Cause:** The selected provider ID doesn't match any registered provider.

**Fix:** Use one of: `anthropic`, `openai`, `google`, `mistral`, `groq`, `ollama`, `openrouter`.

### Generation produces empty or malformed output

**Cause:** Context files may be too large, causing token overflow.

**Fix:**
- Reduce the number of uploaded context files
- The pipeline automatically truncates context at 80% of the token limit
- Check the generation progress for truncation warnings

### Built-in Engine activates unexpectedly

**Cause:** All external API calls failed (invalid keys, network issues, or provider down).

**Fix:** The built-in synthesis engine generates a basic agent specification locally. This is a fallback — for best results, configure a valid API key.

## Serialization Errors

### "missing YAML frontmatter"

**Cause:** A skill file (SKILL.md) doesn't have the required `---` delimited frontmatter block.

**Fix:** The serializer automatically adds frontmatter. If you're editing skill files manually, always start with:
```yaml
---
name: skill_name
description: What this skill does
---
```

### "Referenced tool X not found"

**Cause:** The agent.yaml manifest references a tool that doesn't have a corresponding file in `tools/`, or the tool file uses `parameters` instead of `input_schema`.

**Fix:**
1. Ensure every tool in the manifest has a matching `tools/<name>.yaml` file
2. Use `input_schema` (not `parameters`) in tool definitions:
```yaml
# Correct
input_schema:
  type: object
  properties: ...

# Wrong - will fail validation
parameters:
  type: object
  properties: ...
```

### additionalProperties validation error

**Cause:** The agent.yaml manifest contains null or undefined values.

**Fix:** The serializer's `stripNulls()` function handles this automatically. If you're editing agent.yaml manually, remove any null/empty fields.

## Development Issues

### Port 3000 already in use

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### "npm run lint" shows type errors

The project uses TypeScript strict mode. Run `npm run lint` to check for type errors. There is no test suite — type checking is the primary verification method.

### Build fails with module errors

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules
npm install
```

### Vite dev server not accessible externally

The dev server binds to `0.0.0.0` by default. If you can't access it from another machine:
1. Check your firewall rules
2. Verify the `--host=0.0.0.0` flag in the dev script
3. Try `npm run dev -- --host`

## Local Context Backend Issues

### Database locked

**Cause:** Multiple processes accessing the same SQLite file.

**Fix:** Stop other processes using the database, or use `:memory:` for development (data won't persist).

### Embedding TODO

The `/api/search` endpoint requires pre-computed embeddings in the request body. The ingestion pipeline chunks text but does not generate embeddings yet. You need to provide embeddings from an external embedding model.

### Port conflict with main app

The local-context-backend defaults to port 3000, same as the main app. Change it:

```bash
PORT=3001 npm run dev
```
