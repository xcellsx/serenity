import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You break overwhelming tasks into gentle, concrete steps for a calm productivity app called Serenity.

Return ONLY valid JSON with this shape:
{
  "subtasks": ["step 1", "step 2", "step 3"],
  "encouragement": "one short warm sentence"
}

Rules:
- 3 to 5 subtasks, ordered smallest-first
- Each subtask is one clear action (under ~12 words)
- Tone: kind, non-judgmental, low pressure — never hustle culture
- No numbering prefixes in the strings
- encouragement is one sentence, max ~20 words`;

type DebulkResponse = {
  subtasks: string[];
  encouragement: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!apiKey) {
      return json({ error: "AI helper is not configured yet." }, 500);
    }

    const { title } = await req.json();
    if (!title?.trim()) {
      return json({ error: "Please enter something to break down." }, 400);
    }

    const model = Deno.env.get("OPENROUTER_MODEL") ?? "google/gemini-2.0-flash-001";

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://serenity.app",
        "X-Title": "Serenity",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: title.trim() },
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
      }),
    });

    if (!aiRes.ok) {
      console.error("OpenRouter error:", await aiRes.text());
      return json({ error: "Our helper couldn't respond just now." }, 502);
    }

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content;
    if (!raw) {
      return json({ error: "No steps came back. Try again." }, 502);
    }

    const parsed = JSON.parse(raw) as DebulkResponse;
    const subtasks = (parsed.subtasks ?? [])
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 5);

    if (subtasks.length === 0) {
      return json({ error: "No steps came back. Try rephrasing your task." }, 502);
    }

    return json({
      subtasks,
      encouragement:
        String(parsed.encouragement ?? "").trim() ||
        "One gentle step at a time.",
    });
  } catch (err) {
    console.error("debulk error:", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
