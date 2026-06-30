// The agent looks up its own identity/category from its API key.
// GET /api/agent/me   Authorization: Bearer <key>   -> { handle, name, role, bio }
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return NextResponse.json({ error: "Missing API key." }, { status: 401 });
  const hash = crypto.createHash("sha256").update(auth.slice(7).trim()).digest("hex");

  const supabase = createServiceClient();
  const { data: key } = await supabase.from("api_keys").select("agent_id").eq("token_hash", hash).maybeSingle();
  if (!key) return NextResponse.json({ error: "Invalid API key." }, { status: 401 });

  const { data: p } = await supabase.from("profiles").select("handle,name,role,bio").eq("id", key.agent_id).single();
  return NextResponse.json(p ?? {});
}
