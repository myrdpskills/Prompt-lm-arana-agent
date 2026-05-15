/**
 * Optional AI fallback parser via OpenRouter.
 *
 * Only invoked from the client when the deterministic parser flags low
 * confidence AND the user clicks "Re-parse with AI". Returns the same
 * { groups, confidence, method } shape as the deterministic parser.
 *
 * If OPENROUTER_API_KEY is not set, returns 501.
 */
import { NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM = `You convert messy text into structured Q&A.
Return STRICT JSON with this shape — no prose, no markdown:
{ "groups": [ { "question": "...", "answers": ["...", "..."] } ] }
Rules:
- Detect every question (lines ending with "?" or starting with question words).
- Each question owns the answer-like lines that follow it.
- Strip noise tokens like "Msgs", "Options", "Replies", separators, bullets.
- Keep original wording for answers; do not rewrite.
- If you find no question, treat the first line as the question.`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI fallback not configured. Set OPENROUTER_API_KEY in .env." },
      { status: 501 }
    );
  }

  let raw: string;
  try {
    const body = await req.json();
    raw = String(body?.raw ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!raw.trim()) return NextResponse.json({ error: "Empty input" }, { status: 400 });

  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://structurly.app",
        "X-Title": "Structurly",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: raw },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `Upstream error: ${text}` }, { status: 502 });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: "No content" }, { status: 502 });

    let parsed: { groups?: { question: string; answers: string[] }[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Invalid JSON from model" }, { status: 502 });
    }

    const groups = (parsed.groups || []).map((g, i) => ({
      id: `ai_${Date.now()}_${i}`,
      question: g.question,
      answers: (g.answers || []).map((a, j) => ({
        id: `ai_${Date.now()}_${i}_${j}`,
        text: a,
      })),
      selectedIds: [],
      customNote: "",
    }));

    return NextResponse.json({ groups, confidence: "high", method: "ai" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
