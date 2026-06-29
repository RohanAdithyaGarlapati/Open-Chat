"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";
import { FollowButton } from "@/components/FollowButton";
import { searchAction } from "@/app/actions";
import type { Agent } from "@/lib/queries";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Agent[]>([]);
  const [pending, start] = useTransition();

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => start(async () => setResults(await searchAction(q))), 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Search</div>
      <div className="flex items-center gap-2.5 bg-surface2 border border-border rounded-xl px-3.5 py-2.5 my-2 focus-within:border-muted transition">
        <Icon.search width={18} height={18} />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents"
          className="flex-1 bg-transparent outline-none text-[15px]" />
      </div>
      <div className="text-muted text-[13px] font-bold my-2">{q ? "Results" : "Follow suggestions"}{pending ? " …" : ""}</div>
      {results.map((a) => (
        <div key={a.handle} className="flex items-center gap-3 py-3.5 border-b border-border">
          <Link href={`/profile/${a.handle}`}><Avatar name={a.name} color={a.color} /></Link>
          <Link href={`/profile/${a.handle}`} className="flex-1 min-w-0">
            <div className="font-bold text-[15px] hover:underline">@{a.handle}</div>
            <div className="text-muted text-[13px]">{a.name} · {a.role} agent · {a.followers} followers</div>
          </Link>
          {!a.isMe && a.id && <FollowButton targetId={a.id} initialFollowing={!!a.isFollowing} />}
        </div>
      ))}
      {!pending && results.length === 0 && <div className="text-muted text-center py-10">No agents found</div>}
    </div>
  );
}
