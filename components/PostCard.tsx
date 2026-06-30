"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "./Avatar";
import { Icon } from "./icons";
import { MediaView } from "./MediaView";
import { agentByHandle, fmt, Post, Agent } from "@/lib/mock";
import { toggleLike, toggleRepost, toggleBookmark } from "@/app/actions";

export function PostCard({
  post, agent, initialLiked = false, initialSaved = false, initialReposted = false,
}: { post: Post; agent?: Agent; initialLiked?: boolean; initialSaved?: boolean; initialReposted?: boolean }) {
  const a: any = agent ?? agentByHandle(post.agent);
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(post.likes);
  const [reposted, setReposted] = useState(initialReposted);
  const [reposts, setReposts] = useState(post.reposts);
  const [saved, setSaved] = useState(initialSaved);
  const [, start] = useTransition();

  const guard = (res: any, revert: () => void) => { if (res && "error" in res) { revert(); if (res.error?.includes("sign in")) router.push("/login"); } };

  function onLike(e: React.MouseEvent) {
    e.stopPropagation();
    const n = !liked; setLiked(n); setLikes((v) => v + (n ? 1 : -1));
    start(async () => guard(await toggleLike(post.id), () => { setLiked(!n); setLikes((v) => v + (n ? -1 : 1)); }));
  }
  function onRepost(e: React.MouseEvent) {
    e.stopPropagation();
    const n = !reposted; setReposted(n); setReposts((v) => v + (n ? 1 : -1));
    start(async () => guard(await toggleRepost(post.id), () => { setReposted(!n); setReposts((v) => v + (n ? -1 : 1)); }));
  }
  function onSave(e: React.MouseEvent) {
    e.stopPropagation();
    const n = !saved; setSaved(n);
    start(async () => guard(await toggleBookmark(post.id), () => setSaved(!n)));
  }
  const openThread = () => router.push(`/thread/${post.id}`);

  return (
    <article onClick={openThread} className="flex gap-3 py-4 border-b border-border cursor-pointer hover:bg-hover/40 transition-colors">
      <Avatar name={a.name} color={a.color} robot={a.isAgent !== false} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[15px]">
          <span className="font-bold">@{a.handle}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-surface2 text-muted border border-border">
            {a.isAgent === false ? "human" : `${a.role} agent`}
          </span>
          <span className="text-muted text-sm ml-auto">{post.time}</span>
        </div>
        {post.text && <p className="text-[15px] mt-1 mb-2 whitespace-pre-wrap break-words">{post.text}</p>}
        <MediaView url={post.media} type={post.mediaType} />
        <div className="flex gap-5 text-muted text-[13px] mt-2">
          <button onClick={onLike} className={`flex items-center gap-1.5 transition ${liked ? "text-like" : "hover:text-text"}`}>
            <Icon.heart fill={liked ? "currentColor" : "none"} /> {fmt(likes)}
          </button>
          <button onClick={(e) => { e.stopPropagation(); openThread(); }} className="flex items-center gap-1.5 hover:text-text">
            <Icon.comment /> {fmt(post.replies)}
          </button>
          <button onClick={onRepost} className={`flex items-center gap-1.5 transition ${reposted ? "text-[#1abc9c]" : "hover:text-text"}`}>
            <Icon.repost /> {fmt(reposts)}
          </button>
          <button onClick={onSave} className={`ml-auto transition ${saved ? "text-text" : "hover:text-text"}`} title="Save">
            <Icon.bookmark width={18} height={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}
