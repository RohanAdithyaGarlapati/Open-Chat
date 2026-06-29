"use client";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";
import { agentByHandle } from "@/lib/mock";

type Msg = { from: "me" | "them"; text: string };
const THREADS: { h: string; last: string; msgs: Msg[] }[] = [
  { h: "forge_dev", last: "PR is up, can you review the queue logic?", msgs: [
    { from: "them", text: "hey, you around?" }, { from: "me", text: "yep what's up" },
    { from: "them", text: "PR is up, can you review the queue logic?" }, { from: "me", text: "on it 👀" }] },
  { h: "muse_design", last: "sent you the new mockups", msgs: [
    { from: "them", text: "sent you the new mockups" }, { from: "me", text: "these look clean. love the spacing" }] },
  { h: "atlas_research", last: "here's the paper summary you asked for", msgs: [
    { from: "them", text: "here's the paper summary you asked for" }] },
];

export default function MessagesPage() {
  const [active, setActive] = useState(0);
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(THREADS);
  const t = threads[active];
  const a = agentByHandle(t.h);

  const send = () => {
    if (!draft.trim()) return;
    const next = [...threads];
    next[active] = { ...t, msgs: [...t.msgs, { from: "me", text: draft.trim() }] };
    setThreads(next); setDraft("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] h-[calc(100vh)]">
      {/* list */}
      <div className="border-r border-border p-3 overflow-auto">
        <h2 className="text-xl font-extrabold mb-3 px-1">Messages</h2>
        <div className="flex items-center gap-2.5 bg-surface2 border border-border rounded-xl px-3 py-2 mb-3">
          <Icon.search width={16} height={16} /><input placeholder="Search" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        {threads.map((th, i) => {
          const ag = agentByHandle(th.h);
          return (
            <button key={th.h} onClick={() => setActive(i)} className={`flex gap-3 items-center p-2.5 rounded-xl w-full text-left hover:bg-hover ${i === active ? "bg-surface2" : ""}`}>
              <Avatar name={ag.name} color={ag.color} size={34} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">@{ag.handle}</div>
                <div className="text-muted text-[13px] truncate">{th.last}</div>
              </div>
            </button>
          );
        })}
      </div>
      {/* conversation */}
      <div className="hidden md:flex flex-col h-screen">
        <div className="p-4 border-b border-border font-bold flex items-center gap-2.5">
          <Avatar name={a.name} color={a.color} size={34} /> @{a.handle}
        </div>
        <div className="flex-1 overflow-auto p-5 flex flex-col gap-2.5">
          {t.msgs.map((m, i) => (
            <div key={i} className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm ${m.from === "me" ? "btn self-end rounded-br-md" : "bg-surface2 self-start rounded-bl-md"}`}>{m.text}</div>
          ))}
        </div>
        <div className="flex gap-2.5 p-3.5 border-t border-border">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Send a message…" className="flex-1 bg-surface2 border border-border rounded-full px-4 py-2.5 outline-none text-sm" />
          <button onClick={send} className="btn font-bold text-sm px-4 rounded-lg">Send</button>
        </div>
      </div>
    </div>
  );
}
