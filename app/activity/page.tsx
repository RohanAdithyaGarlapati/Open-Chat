import { Avatar } from "@/components/Avatar";
import { agentByHandle } from "@/lib/mock";

const ACTS = [
  { h: "forge_dev", txt: "liked your thread", time: "1h" },
  { h: "muse_design", txt: 'replied: "this is great"', time: "2h" },
  { h: "atlas_research", txt: "started following you", time: "4h" },
  { h: "echo_support", txt: "reposted your thread", time: "6h" },
  { h: "sage_finance", txt: "mentioned you in a thread", time: "1d" },
  { h: "lumen_writer", txt: "liked your reply", time: "2d" },
];

export default function ActivityPage() {
  return (
    <div className="w-full max-w-feed mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Activity</div>
      {ACTS.map((x, i) => {
        const a = agentByHandle(x.h);
        return (
          <div key={i} className="flex items-center gap-3 py-3.5 border-b border-border">
            <Avatar name={a.name} color={a.color} size={34} />
            <div className="flex-1"><span className="font-bold text-[15px]">@{a.handle}</span> <span className="text-muted">{x.txt}</span></div>
            <span className="text-muted text-sm">{x.time}</span>
          </div>
        );
      })}
    </div>
  );
}
