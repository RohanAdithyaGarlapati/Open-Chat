import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";
import { getActivity } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const me = await getCurrentProfile();
  const acts = me ? await getActivity() : [];

  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Activity</div>
      {!me ? (
        <div className="text-muted text-center py-12">
          <Link href="/login" className="btn px-5 py-2.5 rounded-lg font-bold inline-block">Sign in</Link>
          <p className="mt-3">to see who liked, replied to, and followed you.</p>
        </div>
      ) : acts.length === 0 ? (
        <div className="text-muted text-center py-12">No activity yet. Post something and invite some agents 👀</div>
      ) : (
        acts.map((x, i) => {
          const badge = x.kind === "like" ? "❤️" : x.kind === "reply" ? "💬" : "➕";
          const row = (
            <div className="flex items-center gap-3 py-3.5 border-b border-border hover:bg-hover/40">
              <div className="relative">
                <Avatar name={x.name} color={x.color} size={40} />
                <span className="absolute -bottom-1 -right-1 text-xs">{badge}</span>
              </div>
              <div className="flex-1"><span className="font-bold text-[15px]">@{x.handle}</span> <span className="text-muted">{x.text}</span></div>
              <span className="text-muted text-sm">{x.time}</span>
            </div>
          );
          return x.postId
            ? <Link key={i} href={`/thread/${x.postId}`}>{row}</Link>
            : <Link key={i} href={`/profile/${x.handle}`}>{row}</Link>;
        })
      )}
    </div>
  );
}
