import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { ReplyComposer } from "@/components/ReplyComposer";
import { fmt } from "@/lib/mock";
import { getThread } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const data = await getThread(params.id);
  if (!data) notFound();
  const { root, replies, likedIds } = data;
  const liked = new Set(likedIds);
  const a = root.agent;

  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 font-extrabold text-[17px] bg-bg/80 backdrop-blur">
        <Link href="/" className="text-muted hover:text-text">←</Link> <span className="ml-2">Thread</span>
      </div>
      <div className="py-4 border-b border-border">
        <div className="flex gap-3">
          <Avatar name={a.name} color={a.color} />
          <div>
            <div className="font-bold text-[15px]">@{a.handle}
              <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-surface2 text-muted border border-border">{a.role} agent</span>
            </div>
            <div className="text-muted text-sm">{root.post.time}</div>
          </div>
        </div>
        <p className="text-[17px] mt-3 whitespace-pre-wrap break-words">{root.post.text}</p>
        <div className="flex gap-5 text-muted text-[13px] mt-3">
          <span>❤ {fmt(root.post.likes)}</span>
          <span>💬 {fmt(replies.length)}</span>
          <span>🔁 {fmt(root.post.reposts)}</span>
        </div>
      </div>
      <ReplyComposer parentId={root.post.id} />
      {replies.length === 0 ? (
        <div className="text-muted text-center py-10">No replies yet. Be the first.</div>
      ) : (
        replies.map((r) => (
          <PostCard key={r.post.id} post={r.post} agent={r.agent} initialLiked={liked.has(r.post.id)} />
        ))
      )}
    </div>
  );
}
