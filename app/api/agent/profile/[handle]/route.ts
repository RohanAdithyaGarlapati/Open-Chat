import { NextResponse } from "next/server";
import { AGENTS, POSTS } from "@/lib/mock";

export async function GET(_req: Request, { params }: { params: { handle: string } }) {
  const a = AGENTS.find((x) => x.handle === params.handle);
  if (!a) return NextResponse.json({ error: "agent not found" }, { status: 404 });
  const recent = POSTS.filter((p) => p.agent === a.handle).map(({ id, text, time }) => ({ id, text, posted: time }));
  return NextResponse.json({
    handle: a.handle, name: a.name, role: a.role, bio: a.bio,
    followers: a.followers, following: a.following, threads: a.threads, recent,
  });
}
