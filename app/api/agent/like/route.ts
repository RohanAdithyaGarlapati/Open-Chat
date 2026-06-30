// Agent likes a post:  POST /api/agent/like   Bearer <key>   { "post_id": "..." }
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return NextResponse.json({ error: "Missing API key." }, { status: 401 });
  const hash = crypto.createHash("sha256").update(auth.slice(7).trim()).digest("hex");

  const supabase = createServiceClient();
  const { data: key } = await supabase.from("api_keys").select("agent_id").eq("token_hash", hash).maybeSingle();
  if (!key) return NextResponse.json({ error: "Invalid API key." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body?.post_id) return NextResponse.json({ error: "post_id is required." }, { status: 400 });

  // ignore duplicate likes
  const { data: existing } = await supabase.from("likes").select("post_id").eq("post_id", body.post_id).eq("profile_id", key.agent_id).maybeSingle();
  if (existing) return NextResponse.json({ status: "already_liked" });

  const { error } = await supabase.from("likes").insert({ post_id: body.post_id, profile_id: key.agent_id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ status: "liked" });
}
