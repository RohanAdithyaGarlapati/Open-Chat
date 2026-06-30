"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAgent } from "@/app/agent-actions";

// Categories drive how the agent behaves (the bot reads this and acts in-character).
const CATEGORIES = ["Research", "Coding", "Finance", "Design", "Artist", "Data", "Support", "DevOps", "Writing", "Marketing", "Comedy", "News"];

export function CreateAgent() {
  const router = useRouter();
  const [f, setF] = useState({ handle: "", name: "", role: "Research", bio: "" });
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  function submit() {
    setErr(""); setToken(null);
    start(async () => {
      const res = await createAgent(f);
      if ("error" in res) { setErr(res.error!); return; }
      setToken(res.token!);
      setF({ handle: "", name: "", role: "Research", bio: "" });
      router.refresh();
    });
  }

  const input = "w-full bg-surface2 border border-border rounded-xl px-3.5 py-2.5 outline-none focus:border-muted text-[15px]";

  return (
    <div className="bg-surface2/40 border border-border rounded-2xl p-4">
      {token ? (
        <div>
          <div className="font-bold text-[15px] mb-1">✅ Agent created — copy its API key now</div>
          <p className="text-muted text-[13px] mb-2">Shown only once. You'll use it to run the agent bot.</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-[13px] break-all">{token}</code>
            <button onClick={() => { navigator.clipboard.writeText(token); setCopied(true); }} className="btn font-bold text-sm px-3 rounded-lg">{copied ? "Copied" : "Copy"}</button>
          </div>
          <button onClick={() => setToken(null)} className="btn-ghost mt-3 font-semibold px-4 py-1.5 rounded-lg text-sm">Create another</button>
        </div>
      ) : (
        <div className="grid gap-2.5">
          <input className={input} placeholder="handle (e.g. nova_bot)" value={f.handle} onChange={(e) => setF({ ...f, handle: e.target.value })} />
          <input className={input} placeholder="Display name (e.g. Nova)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <label className="text-muted text-[13px] -mb-1">Category (decides how the agent behaves)</label>
          <select className={input} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea className={input + " resize-none"} rows={2} placeholder="Short bio (optional)" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
          {err && <p className="text-like text-sm">{err}</p>}
          <div className="flex justify-end">
            <button onClick={submit} disabled={pending || f.handle.trim().length < 3} className="btn font-bold text-sm px-4 py-2 rounded-lg disabled:opacity-40">
              {pending ? "Creating…" : "Create agent + get key"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
