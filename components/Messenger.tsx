"use client";
import { useState, useTransition, useRef, useEffect } from "react";
import { Avatar } from "./Avatar";
import { Icon } from "./icons";
import { loadConversation, sendMessage } from "@/app/actions";

type Convo = { otherId: string; handle: string; name: string; color: string; last?: string; time?: string };
type DM = { mine: boolean; body: string; time: string };

export function Messenger({
  initialConversations, people,
}: { initialConversations: Convo[]; people: Convo[] }) {
  const [convos, setConvos] = useState<Convo[]>(initialConversations);
  const [active, setActive] = useState<Convo | null>(initialConversations[0] ?? null);
  const [msgs, setMsgs] = useState<DM[]>([]);
  const [draft, setDraft] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [, start] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  function open(c: Convo) {
    setActive(c); setShowNew(false);
    start(async () => setMsgs(await loadConversation(c.otherId)));
  }
  useEffect(() => { if (active) start(async () => setMsgs(await loadConversation(active.otherId))); /* eslint-disable-next-line */ }, []);
  useEffect(() => { endRef.current?.scrollIntoView(); }, [msgs]);

  function send() {
    if (!draft.trim() || !active) return;
    const body = draft.trim();
    setDraft("");
    setMsgs((m) => [...m, { mine: true, body, time: "now" }]); // optimistic
    start(async () => {
      await sendMessage(active.otherId, body);
      setMsgs(await loadConversation(active.otherId));
      if (!convos.find((c) => c.otherId === active.otherId)) setConvos((cs) => [active, ...cs]);
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] h-[calc(100vh)]">
      {/* list */}
      <div className="border-r border-border p-3 overflow-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xl font-extrabold">Messages</h2>
          <button onClick={() => setShowNew((v) => !v)} className="p-2 rounded-lg hover:bg-hover" title="New message"><Icon.dm width={20} height={20} /></button>
        </div>

        {showNew && (
          <div className="mb-3">
            <div className="text-muted text-[13px] font-bold mb-1 px-1">Start a chat</div>
            {people.map((p) => (
              <button key={p.otherId} onClick={() => open(p)} className="flex gap-3 items-center p-2.5 rounded-xl w-full text-left hover:bg-hover">
                <Avatar name={p.name} color={p.color} size={34} />
                <div className="font-semibold text-sm">@{p.handle}</div>
              </button>
            ))}
            <div className="h-px bg-border my-2" />
          </div>
        )}

        {convos.length === 0 && !showNew && <div className="text-muted text-sm px-1">No conversations yet. Tap the icon to start one.</div>}
        {convos.map((c) => (
          <button key={c.otherId} onClick={() => open(c)}
            className={`flex gap-3 items-center p-2.5 rounded-xl w-full text-left hover:bg-hover ${active?.otherId === c.otherId ? "bg-surface2" : ""}`}>
            <Avatar name={c.name} color={c.color} size={34} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">@{c.handle}</div>
              {c.last && <div className="text-muted text-[13px] truncate">{c.last}</div>}
            </div>
            {c.time && <span className="text-muted text-xs">{c.time}</span>}
          </button>
        ))}
      </div>

      {/* conversation */}
      <div className="hidden md:flex flex-col h-screen">
        {!active ? (
          <div className="flex-1 grid place-items-center text-muted">Select a conversation</div>
        ) : (
          <>
            <div className="p-4 border-b border-border font-bold flex items-center gap-2.5">
              <Avatar name={active.name} color={active.color} size={34} /> @{active.handle}
            </div>
            <div className="flex-1 overflow-auto p-5 flex flex-col gap-2.5">
              {msgs.length === 0 && <div className="text-muted text-center mt-6">Say hello 👋</div>}
              {msgs.map((m, i) => (
                <div key={i} className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm ${m.mine ? "btn self-end rounded-br-md" : "bg-surface2 self-start rounded-bl-md"}`}>{m.body}</div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="flex gap-2.5 p-3.5 border-t border-border">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Send a message…" className="flex-1 bg-surface2 border border-border rounded-full px-4 py-2.5 outline-none text-sm" />
              <button onClick={send} className="btn font-bold text-sm px-4 rounded-lg">Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
