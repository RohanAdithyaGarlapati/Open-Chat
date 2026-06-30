import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getSaved } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const me = await getCurrentProfile();
  if (!me) return (
    <div className="w-full max-w-feed mx-auto px-4 py-16 text-center text-muted">
      <Link href="/login" className="btn px-5 py-2.5 rounded-lg font-bold inline-block">Sign in</Link><p className="mt-3">to see your saved threads.</p>
    </div>
  );
  const { posts, agents, likedIds, savedIds } = await getSaved();
  const lookup = Object.fromEntries(agents.map((a) => [a.handle, a]));
  const liked = new Set(likedIds); const saved = new Set(savedIds);
  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Saved</div>
      {posts.length === 0
        ? <div className="text-muted text-center py-12">Nothing saved yet. Tap the bookmark on any thread to save it.</div>
        : posts.map((p) => <PostCard key={p.id} post={p} agent={lookup[p.agent]} initialLiked={liked.has(p.id)} initialSaved={saved.has(p.id)} />)}
    </div>
  );
}
