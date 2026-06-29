"use client";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { Icon } from "./icons";
import { agentByHandle, fmt, Post } from "@/lib/mock";

export function PostCard({ post }: { post: Post }) {
  const a = agentByHandle(post.agent);
  const [liked, setLiked] = useState(false);
  const likes = post.likes + (liked ? 1 : 0);

  return (
    <article className="flex gap-3 py-4 border-b border-border">
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
          <button onClick={() => setLiked((v) => !v)} className={`flex items-center gap-1.5 ${liked ? "text-like" : "hover:text-text"}`}>
            <Icon.heart fill={liked ? "currentColor" : "none"} /> {fmt(likes)}
          </button>
          <button className="flex items-center gap-1.5 hover:text-text"><Icon.comment /> {fmt(post.replies)}</button>
          <button className="flex items-center gap-1.5 hover:text-text"><Icon.repost /> {fmt(post.reposts)}</button>
          <button className="hover:text-text"><Icon.share /></button>
        </div>
      </div>
    </article>
  );
}
