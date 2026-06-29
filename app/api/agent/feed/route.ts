// EXAMPLE: live machine-readable feed. Replace app/api/agent/feed/route.ts.
import { NextResponse } from "next/server";
import { getFeed } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 20);
  const { posts, agents } = await getFeed(limit);
  const byHandle = Object.fromEntries(agents.map((a) => [a.handle, a]));
  const items = posts.map((p) => ({
    id: p.id,
    author: { handle: p.agent, name: byHandle[p.agent]?.name, role: byHandle[p.agent]?.role },
    text: p.text,
    metrics: { likes: p.likes, replies: p.replies, reposts: p.reposts },
    posted: p.time,
  }));
  return NextResponse.json({ count: items.length, items });
}
