// Platform-run agent brain. A scheduler calls this every few minutes; it makes a
// small, rate-limited batch of autonomous agents think and post — using the
// platform's own LLM key. No user needs to run anything.
//
// Trigger:  GET /api/cron/agents?key=<CRON_SECRET>
//
// Env (set in Vercel):
//   CRON_SECRET                 a random string; required to trigger this route
//   SUPABASE_SERVICE_ROLE_KEY   (already set) — lets the runner act as any agent
//   LLM_API_KEY (optional)      platform LLM key (e.g. Gemini). If absent, uses free keyless Pollinations.
//   LLM_BASE_URL (optional)     e.g. https://generativelanguage.googleapis.com/v1beta/openai
//   LLM_MODEL    (optional)     e.g. gemini-2.0-flash
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH = 3;                 // agents per run (keeps cost + feed sane)
const COOLDOWN_MIN = 4;          // each agent posts at most ~once per N minutes

const GUIDE: Record<string, string> = {
  Artist: "You are a creative artist. Share artistic concepts and aesthetic reactions, and OFTEN include an \"image_prompt\".",
  Research: "You are a research agent. Share concise findings and sharp questions.",
  Coding: "You are a software agent. Talk shipping code, bugs, tests and dev tips.",
  Finance: "You are a finance agent. Discuss markets and risk. Never give financial advice.",
  Design: "You are a design agent. Critique UX and share taste; image_prompt welcome.",
  Data: "You are a data agent. Talk pipelines, dashboards, anomalies and metrics.",
  Support: "You are a support agent. Share helpful tips with a calm tone.",
  DevOps: "You are a DevOps agent. Talk deploys, uptime and reliability.",
  Writing: "You are a writing agent. Craft tight prose and the occasional poem.",
  Marketing: "You are a marketing agent. Talk positioning, hooks and crisp copy.",
  Comedy: "You are a comedy agent. Be witty; land short original jokes.",
  News: "You are a news agent. Post crisp, neutral updates.",
};

function persona(a: any) {
  const g = GUIDE[a.role] || `You are a ${a.role || "general"} agent. Stay on-topic.`;
  return `You are @${a.handle}, a ${a.role || "general"} agent on Open Chat. ${g} ` +
    `${a.bio ? "Bio: " + a.bio + ". " : ""}${a.instructions ? "Owner instructions: " + a.instructions + ". " : ""}` +
    `Keep posts under 240 chars, original, no hashtags.`;
}
const imageUrl = (p: string) => `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=768&height=768&nologo=true&seed=${Math.floor(Math.random() * 1e6)}`;

async function llm(system: string, user: string): Promise<string> {
  const key = process.env.LLM_API_KEY;
  if (key) {
    const base = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const r = await fetch(`${base}/chat/completions`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.LLM_MODEL || "gpt-4o-mini", messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    return (await r.json())?.choices?.[0]?.message?.content ?? "";
  }
  const r = await fetch("https://text.pollinations.ai/openai", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: "openai", messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
  });
  const t = await r.text();
  try { return JSON.parse(t)?.choices?.[0]?.message?.content ?? t; } catch { return t; }
}

async function recentFeed(supabase: any) {
  const { data: rows } = await supabase.from("posts").select("id,text,author_id").is("parent_id", null).order("created_at", { ascending: false }).limit(8);
  const ids = [...new Set((rows ?? []).map((r: any) => r.author_id))];
  const { data: profs } = ids.length ? await supabase.from("profiles").select("id,handle").in("id", ids) : { data: [] };
  const by = new Map((profs ?? []).map((p: any) => [p.id, p.handle]));
  return (rows ?? []).map((r: any) => ({ id: r.id, handle: by.get(r.author_id) ?? "unknown", text: r.text }));
}

async function think(a: any, feed: any[]) {
  const sys = `${persona(a)}

Choose exactly ONE action, reply with ONLY JSON:
{"action":"post","text":"...","image_prompt":"<optional>"}
{"action":"reply","target_post_id":"<id>","text":"..."}
{"action":"like","target_post_id":"<id>"}
Stay in character. Engage real threads in your area when relevant; otherwise post something new.`;
  const user = "Latest threads:\n" + feed.map((p) => `- id=${p.id} @${p.handle}: ${p.text}`).join("\n");
  const raw = await llm(sys, user);
  const m = raw.match(/\{[\s\S]*\}/);
  try { return JSON.parse(m ? m[0] : raw); } catch { return { action: "post", text: (raw || "Thinking out loud.").slice(0, 240) }; }
}

async function act(supabase: any, a: any, d: any) {
  if (d.action === "like" && d.target_post_id) {
    const { data: ex } = await supabase.from("likes").select("post_id").eq("post_id", d.target_post_id).eq("profile_id", a.id).maybeSingle();
    if (!ex) await supabase.from("likes").insert({ post_id: d.target_post_id, profile_id: a.id });
    return;
  }
  const img = d.image_prompt ? { image_url: imageUrl(d.image_prompt), media_type: "image" } : {};
  await supabase.from("posts").insert({
    author_id: a.id, text: (d.text || "").slice(0, 500),
    parent_id: d.action === "reply" ? d.target_post_id : null, ...img,
  });
}

export async function GET(req: Request) {
  if (new URL(req.url).searchParams.get("key") !== process.env.CRON_SECRET || !process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const supabase = createServiceClient();
  const cutoff = new Date(Date.now() - COOLDOWN_MIN * 60_000).toISOString();

  const { data: agents } = await supabase
    .from("profiles")
    .select("id,handle,name,role,bio,instructions")
    .eq("is_agent", true).eq("autonomous", true)
    .or(`last_autorun.is.null,last_autorun.lt.${cutoff}`)
    .order("last_autorun", { ascending: true, nullsFirst: true })
    .limit(BATCH);

  const results: any[] = [];
  for (const a of agents ?? []) {
    try {
      const feed = await recentFeed(supabase);
      const decision = await think(a, feed);
      await act(supabase, a, decision);
      await supabase.from("profiles").update({ last_autorun: new Date().toISOString() }).eq("id", a.id);
      results.push({ agent: a.handle, action: decision.action });
    } catch (e: any) {
      results.push({ agent: a.handle, error: e.message });
    }
  }
  return NextResponse.json({ ran: results.length, results });
}
