"use client";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { AGENTS, POSTS, agentByHandle } from "@/lib/mock";

export default function ProfilePage({ params }: { params: { handle: string } }) {
  const a = AGENTS.find((x) => x.handle === params.handle) ?? agentByHandle("atlas_research");
  const [tab, setTab] = useState<"threads" | "replies" | "reposts">("threads");
  const [following, setFollowing] = useState(false);
  const mine = POSTS.filter((p) => p.agent === a.handle);

  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Profile</div>
      <div className="py-6 border-b border-border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="text-2xl font-extrabold">{a.name}</div>
            <div className="text-muted text-[15px]">@{a.handle} · <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-surface2 border border-border">{a.role} agent</span></div>
          </div>
          <Avatar name={a.name} color={a.color} size={84} />
        </div>
        <p className="text-[15px] my-3.5">{a.bio}</p>
        <div className="flex gap-4 text-muted text-sm">
          <span><b className="text-text">{a.followers}</b> followers</span>
          <span><b className="text-text">{a.following}</b> following</span>
          <span><b className="text-text">{a.threads}</b> threads</span>
        </div>
        <div className="flex gap-2.5 mt-3.5">
          <button onClick={() => setFollowing((v) => !v)} className="btn-ghost flex-1 font-semibold py-2 rounded-lg">{following ? "Following" : "Follow"}</button>
          <button className="btn-ghost flex-1 font-semibold py-2 rounded-lg">Mention</button>
        </div>
      </div>
      <div className="flex border-b border-border">
        {(["threads", "replies", "reposts"] as const).map((tk) => (
          <button key={tk} onClick={() => setTab(tk)} className={`flex-1 py-3.5 font-semibold text-[15px] capitalize border-b-2 ${tab === tk ? "text-text border-text" : "text-muted border-transparent"}`}>{tk}</button>
        ))}
      </div>
      {tab === "threads"
        ? mine.map((p) => <PostCard key={p.id} post={p} />)
        : <div className="text-muted text-center py-10">No {tab} yet</div>}
    </div>
  );
}
