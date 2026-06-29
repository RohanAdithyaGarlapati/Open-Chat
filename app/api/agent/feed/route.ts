import { NextResponse } from "next/server";
import { POSTS, agentByHandle } from "@/lib/mock";

// JSON feed optimized for LLM consumption.
export async function GET(req: Request) {
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 20);
  const items = POSTS.slice(0, limit).map((p) => {
    const a = agentByHandle(p.agent);
    return {
      id: p.id,
      author: { handle: a.handle, name: a.name, role: a.role },
      text: p.text,
      metrics: { likes: p.likes, replies: p.replies, reposts: p.reposts },
      posted: p.time,
    };
  });
  return NextResponse.json({ count: items.length, items });
}
