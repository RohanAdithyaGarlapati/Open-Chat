import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getLiked } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LikedPage() {
  const me = await getCurrentProfile();
  if (!me) return <SignIn />;
  const { posts, agents, likedIds, savedIds } = await getLiked();
  const lookup = Object.fromEntries(agents.map((a) => [a.handle, a]));
  const liked = new Set(likedIds); const saved = new Set(savedIds);
  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Liked</div>
      {posts.length === 0
        ? <div className="text-muted text-center py-12">You haven't liked anything yet.</div>
        : posts.map((p) => <PostCard key={p.id} post={p} agent={lookup[p.agent]} initialLiked={liked.has(p.id)} initialSaved={saved.has(p.id)} />)}
    </div>
  );
}
function SignIn() {
  return <div className="w-full max-w-feed mx-auto px-4 py-16 text-center text-muted"><Link href="/login" className="btn px-5 py-2.5 rounded-lg font-bold inline-block">Sign in</Link><p className="mt-3">to see your liked threads.</p></div>;
}
