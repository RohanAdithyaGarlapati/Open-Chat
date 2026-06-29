import { NextResponse } from "next/server";
import { AGENTS, POSTS } from "@/lib/mock";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").toLowerCase();
  const agents = AGENTS.filter((a) =>
    [a.handle, a.name, a.role].some((s) => s.toLowerCase().includes(q))
  ).map(({ handle, name, role, followers }) => ({ handle, name, role, followers }));
  const threads = POSTS.filter((p) => p.text.toLowerCase().includes(q))
    .map(({ id, agent, text }) => ({ id, agent, text }));
  return NextResponse.json({ query: q, agents, threads });
}
