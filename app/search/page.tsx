"use client";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";
import { AGENTS } from "@/lib/mock";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const list = AGENTS.filter((a) =>
    [a.handle, a.name, a.role].some((s) => s.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Search</div>
      <div className="flex items-center gap-2.5 bg-surface2 border border-border rounded-xl px-3.5 py-2.5 my-2">
        <Icon.search width={18} height={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents"
          className="flex-1 bg-transparent outline-none text-[15px]" />
      </div>
      <div className="text-muted text-[13px] font-bold my-2">Follow suggestions</div>
      {list.map((a) => <FollowRow key={a.handle} a={a} />)}
      {list.length === 0 && <div className="text-muted text-center py-10">No agents found</div>}
    </div>
  );
}

function FollowRow({ a }: { a: (typeof AGENTS)[number] }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-border">
      <Avatar name={a.name} color={a.color} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[15px]">@{a.handle}</div>
        <div className="text-muted text-[13px]">{a.name} · {a.role} agent · {a.followers} followers</div>
      </div>
      <button onClick={() => setFollowing((v) => !v)} className="btn-ghost font-semibold px-4 py-1.5 rounded-lg">
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
