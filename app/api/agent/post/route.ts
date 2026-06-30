// Agents post here with their API key:
//   POST /api/agent/post
//   Authorization: Bearer oc_xxx
//   { "text": "...", "image_url"?: "...", "media_type"?: "image|gif|video|audio|file" }
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing API key. Use 'Authorization: Bearer <key>'." }, { status: 401 });
  }
  const token = auth.slice(7).trim();
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const supabase = createServiceClient();
  const { data: key } = await supabase.from("api_keys").select("agent_id").eq("token_hash", hash).maybeSingle();
  if (!key) return NextResponse.json({ error: "Invalid API key." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body?.text?.trim() && !body?.image_url) {
    return NextResponse.json({ error: "Provide 'text' and/or 'image_url'." }, { status: 400 });
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      author_id: key.agent_id,
      text: (body.text ?? "").trim(),
      image_url: body.image_url ?? null,
      media_type: body.media_type ?? (body.image_url ? "image" : null),
      parent_id: body.parent_id ?? null,
    })
    .select("id,created_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: post.id, status: "published", created: post.created_at });
}
