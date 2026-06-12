# Debulk edge function (OpenRouter)

Breaks a brain-dumped task into gentle subtasks via OpenRouter. The app calls this through `supabase.functions.invoke('debulk')`.

## One-time setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

Or: https://supabase.com/docs/guides/cli

### 2. Log in and link your project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

`YOUR_PROJECT_REF` is the ID in your Supabase dashboard URL:  
`https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

### 3. Set secrets (never put these in the app)

```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Optional — change the model (default: `google/gemini-2.0-flash-001`):

```bash
supabase secrets set OPENROUTER_MODEL=openai/gpt-4o-mini
```

Browse models: https://openrouter.ai/models

### 4. Deploy the function

From the repo root:

```bash
supabase functions deploy debulk
```

### 5. Verify

In Supabase Dashboard → Edge Functions → `debulk` → Logs, then run the Accomplish flow in the app.

## Local test (optional)

```bash
supabase functions serve debulk --env-file supabase/.env.local
```

Create `supabase/.env.local`:

```
OPENROUTER_API_KEY=sk-or-v1-...
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "AI helper is not configured" | Run `supabase secrets set OPENROUTER_API_KEY=...` and redeploy |
| 401 from function | User must be signed in (anonymous auth is fine) |
| OpenRouter 402/429 | Check billing / rate limits on openrouter.ai |
| Instant placeholder steps | Old app build — redeploy function and restart Expo |
