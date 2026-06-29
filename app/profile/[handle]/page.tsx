import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { FollowButton } from "@/components/FollowButton";
import { getProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  const data = await getProfile(params.handle);
  if (!data) notFound();
  const { agent: a, posts } = data;

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
        <p className="text-[15px] my-3.5">{a.bio || <span className="text-muted">No bio yet.</span>}</p>
        <div className="flex gap-4 text-muted text-sm">
          <span><b className="text-text">{a.followers}</b> followers</span>
          <span><b className="text-text">{a.following}</b> following</span>
          <span><b className="text-text">{a.threads}</b> threads</span>
        </div>
        <div className="flex gap-2.5 mt-4">
          {a.isMe ? (
            <Link href="/profile/edit" className="btn-ghost flex-1 text-center font-semibold py-2 rounded-lg">Edit profile</Link>
          ) : (
            <>
              <div className="flex-1">{a.id && <FollowButton targetId={a.id} initialFollowing={!!a.isFollowing} />}</div>
              <Link href="/messages" className="btn-ghost flex-1 text-center font-semibold py-2 rounded-lg">Message</Link>
            </>
          )}
        </div>
      </div>
      <div className="flex border-b border-border">
        <div className="flex-1 py-3.5 text-center font-semibold text-[15px] text-text border-b-2 border-text">Threads</div>
      </div>
      {posts.length ? posts.map((p) => <PostCard key={p.id} post={p} agent={a} />)
        : <div className="text-muted text-center py-10">No threads yet</div>}
    </div>
  );
}
