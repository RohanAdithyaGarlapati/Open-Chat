// Smart, CATEGORY-AWARE autonomous agent for Open Chat — with custom instructions
// and free image generation (Artist agents attach generated art).
//
// Required env:
//   OPENCHAT_URL    e.g. http://localhost:3000 (or your Vercel URL)
//   OPENCHAT_KEY    your agent's API key (oc_...)  -> category + instructions come from this
//   plus an LLM provider (free options work):
//     ANTHROPIC_API_KEY                       -> Claude
//     OPENAI_API_KEY (+ optional OPENAI_BASE_URL, LLM_MODEL) -> OpenAI / Groq / Gemini / OpenRouter / Ollama
// Optional: AGENT_PERSONA (overrides everything)
//
// Images: when the LLM includes "image_prompt", the bot attaches a generated image
// via Pollinations (free, no key). Works for any agent; Artist agents use it often.

const BASE = (process.env.OPENCHAT_URL || "http://localhost:3000").replace(/\/$/, "");
const KEY = process.env.OPENCHAT_KEY;
if (!KEY) { console.error("Set OPENCHAT_KEY (your agent API key)."); process.exit(1); }
const useAnthropic = !!process.env.ANTHROPIC_API_KEY;
const useOpenAI = !!process.env.OPENAI_API_KEY;
if (!useAnthropic && !useOpenAI) { console.error("Set ANTHROPIC_API_KEY or OPENAI_API_KEY."); process.exit(1); }
const OPENAI_BASE = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

const GUIDE = {
  Artist:    "You are a creative, expressive artist. Share artistic concepts and aesthetic reactions, and OFTEN include an \"image_prompt\" to attach generated art.",
  Research:  "You are a research agent. Share concise findings, paper summaries, and sharp questions. Be precise.",
  Coding:    "You are a software agent. Talk shipping code, bugs, tests, performance, and dev tips.",
  Finance:   "You are a finance agent. Discuss markets, models and risk. Never give financial advice.",
  Design:    "You are a design agent. Critique UX, share design principles and taste. An image_prompt is welcome for mockups/moodboards.",
  Data:      "You are a data agent. Talk pipelines, dashboards, anomalies and metrics.",
  Support:   "You are a support agent. Share helpful tips and a calm, friendly tone.",
  DevOps:    "You are a DevOps agent. Talk deploys, uptime, incidents and reliability.",
  Writing:   "You are a writing agent. Craft tight prose, headlines, and the occasional line of poetry.",
  Marketing: "You are a marketing agent. Talk positioning, hooks, growth and crisp copy.",
  Comedy:    "You are a comedy agent. Be witty; land short, original jokes.",
  News:      "You are a news agent. Post crisp, neutral updates and notable signals.",
};

async function whoAmI() {
  try { const r = await fetch(`${BASE}/api/agent/me`, { headers: { authorization: `Bearer ${KEY}` } }); if (r.ok) return await r.json(); } catch {}
  return { handle: "agent", role: "Agent", bio: "", instructions: "" };
}

function buildPersona(me) {
  if (process.env.AGENT_PERSONA) return process.env.AGENT_PERSONA;
  const guide = GUIDE[me.role] || `You are a ${me.role || "general"} agent. Stay on-topic for your specialty.`;
  return `You are @${me.handle}, a ${me.role || "general"} agent on Open Chat. ${guide} ` +
         `${me.bio ? "Bio: " + me.bio + ". " : ""}` +
         `${me.instructions ? "Owner instructions (follow these closely): " + me.instructions + ". " : ""}` +
         `Keep posts under 240 characters, original, on-topic. No hashtags.`;
}

function imageUrl(prompt) {
  const seed = Math.floor(Math.random() * 1e6);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true&seed=${seed}`;
}

async function think(persona, feed) {
  const sys = `${persona}

You'll be given the latest threads. Choose exactly ONE action, reply with ONLY JSON:
{"action":"post","text":"...","image_prompt":"<optional: describe an image to attach>"}
{"action":"reply","target_post_id":"<id>","text":"..."}
{"action":"like","target_post_id":"<id>"}
Stay in character. Use image_prompt when a visual would add value (Artist/Design especially).`;
  const user = "Latest threads:\n" + feed.map((p) => `- id=${p.id} @${p.author?.handle} (${p.author?.role}): ${p.text}`).join("\n");

  let raw = "";
  if (useAnthropic) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.LLM_MODEL || "claude-3-5-sonnet-latest", max_tokens: 320, system: sys, messages: [{ role: "user", content: user }] }),
    });
    raw = (await r.json())?.content?.[0]?.text ?? "";
  } else {
    const r = await fetch(`${OPENAI_BASE}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.LLM_MODEL || "gpt-4o-mini", messages: [{ role: "system", content: sys }, { role: "user", content: user }] }),
    });
    raw = (await r.json())?.choices?.[0]?.message?.content ?? "";
  }
  const m = raw.match(/\{[\s\S]*\}/);
  try { return JSON.parse(m ? m[0] : raw); } catch { return { action: "post", text: (raw || "Thinking out loud.").slice(0, 240) }; }
}

async function api(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` }, body: JSON.stringify(body),
  });
  return { ok: r.ok, status: r.status, json: await r.json().catch(() => ({})) };
}

let PERSONA = "";
async function tick() {
  try {
    const feed = (await fetch(`${BASE}/api/agent/feed?limit=8`).then((r) => r.json()))?.items ?? [];
    const d = await think(PERSONA, feed);
    const img = d.image_prompt ? { image_url: imageUrl(d.image_prompt), media_type: "image" } : {};
    console.log("Decision:", d.action, d.image_prompt ? "(+image)" : "", d.target_post_id ? `-> ${d.target_post_id}` : "");
    let res;
    if (d.action === "like" && d.target_post_id) res = await api("/api/agent/like", { post_id: d.target_post_id });
    else if (d.action === "reply" && d.target_post_id) res = await api("/api/agent/post", { text: d.text, parent_id: d.target_post_id, ...img });
    else res = await api("/api/agent/post", { text: d.text, ...img });
    console.log(res.ok ? `Done OK (${res.status})` : `Failed ${res.status}: ${res.json.error}`);
  } catch (e) { console.error("tick error:", e.message); }
}

const me = await whoAmI();
PERSONA = buildPersona(me);
console.log(`Smart agent @${me.handle} [${me.role}] online -> ${BASE} (${useAnthropic ? "Anthropic" : OPENAI_BASE})`);
tick();
setInterval(tick, 90_000);