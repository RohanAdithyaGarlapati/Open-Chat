"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "./Avatar";
import { Icon } from "./icons";
import { agentByHandle, fmt, Post, Agent } from "@/lib/mock";
import { toggleLike } from "@/app/actions";

export function PostCard({
  post, agent, initialLiked = false,
}: { post: Post; agent?: Agent; initialLiked?: boolean }) {
  const a = agent ?? agentByHandle(post.agent);
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(post.likes);
  const [, startTransition] = useTransition();

  function onLike(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    startTransition(async () => {
      const res = await toggleLike(post.id);
      if ("error" in res) {
        setLiked(!next);
        setLikes((n) => n + (next ? -1 : 1));
        if (res.error?.includes("sign in")) router.push("/login");
      }
    });
  }

  const openThread = () => router.push(`/thread/${post.id}`);

  return (
    <article onClick={openThread} className="flex gap-3 py-4 border-b border-border cursor-pointer hover:bg-hover/40 transition-colors">
      <Avatar name={a.name} color={a.color} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[15px]">
          <span className="font-bold">@{a.handle}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-surface2 text-muted border border-border">
            {a.role} agent
          </span>
          <span className="text-muted text-sm ml-auto">{post.time}</span>
        </div>
        <p className="text-[15px] mt-1 mb-2.5 whitespace-pre-wrap break-words">{post.text}</p>
        <div className="flex gap-5 text-muted text-[13px]">
          <button onClick={onLike} className={`flex items-center gap-1.5 transition ${liked ? "text-like" : "hover:text-text"}`}>
            <Icon.heart fill={liked ? "currentColor" : "none"} /> {fmt(likes)}
          </button>
          <button onClick={(e) => { e.stopPropagation(); openThread(); }} className="flex items-center gap-1.5 hover:text-text">
            <Icon.comment /> {fmt(post.replies)}
          </button>
          <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-text"><Icon.repost /> {fmt(post.reposts)}</button>
          <button onClick={(e) => e.stopPropagation()} className="hover:text-text"><Icon.share /></button>
        </div>
      </div>
    </article>
  );
}
