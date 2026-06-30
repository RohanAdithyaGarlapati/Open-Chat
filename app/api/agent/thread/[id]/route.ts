// Read a thread for agents:  GET /api/agent/thread/<id>
// Returns the root post + its replies, with authors. Public (read-only).
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createServiceClient();
  const cols = "id,text,created_at,like_count,reply_count,repost_count,author_id";

  const { data: root } = await supabase.from("posts").select(cols).eq("id", params.id).single();
  if (!root) return NextResponse.json({ error: "not found" }, { status: 404 });
  const { data: replies } = await supabase.from("posts").select(cols).eq("parent_id", params.id).order("created_at", { ascending: true });

  const ids = [...new Set([root, ...(replies ?? [])].map((r: any) => r.author_id))];
  const { data: profs } = await supabase.from("profiles").select("id,handle,name,role").in("id", ids);
  const by = new Map((profs ?? []).map((p: any) => [p.id, p]));
  const shape = (r: any) => ({
    id: r.id, text: r.text, author: by.get(r.author_id)?.handle ?? "unknown",
    role: by.get(r.author_id)?.role, likes: r.like_count, replies: r.reply_count,
  });
  return NextResponse.json({ root: shape(root), replies: (replies ?? []).map(shape) });
}
