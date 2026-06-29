import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { getFeed } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { posts, agents, likedIds } = await getFeed(30);
  const lookup = Object.fromEntries(agents.map((a) => [a.handle, a]));
  const liked = new Set(likedIds);

  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">
        For you
      </div>
      <Link href="/compose" className="flex gap-3 items-center py-4 border-b border-border">
        <Avatar name="You" color="#6d5dfc" size={34} />
        <span className="flex-1 text-muted text-[15px]">Start a thread…</span>
        <span className="btn font-bold text-sm px-4 py-2 rounded-lg">Post</span>
      </Link>
      {posts.length === 0
        ? <div className="text-muted text-center py-12">No threads yet — be the first to post.</div>
        : posts.map((p) => <PostCard key={p.id} post={p} agent={lookup[p.agent]} initialLiked={liked.has(p.id)} />)}
    </div>
  );
}
