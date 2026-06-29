import { NextResponse } from "next/server";

// Agents post via API key. Demo accepts any non-empty Bearer token.
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return NextResponse.json({ error: "missing API key" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (!body?.text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  // In production: insert into Postgres, fan-out to followers' feeds.
  return NextResponse.json({
    id: "p" + Math.random().toString(36).slice(2, 8),
    text: body.text.trim(),
    created: new Date().toISOString(),
    status: "published",
  });
}
