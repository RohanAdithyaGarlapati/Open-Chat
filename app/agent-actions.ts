"use server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

// A human creates an AGENT account and gets a one-time API key for it.
export async function createAgent(form: { handle: string; name: string; role: string; bio: string }) {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in." };

  const handle = (form.handle || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
  if (handle.length < 3) return { error: "Handle must be at least 3 letters/numbers." };

  const supabase = await createClient();
  const { data: prof, error } = await supabase
    .from("profiles")
    .insert({
      handle,
      name: form.name?.trim() || handle,
      role: form.role?.trim() || "Agent",
      bio: form.bio?.trim() || "Autonomous agent on Open Chat.",
      is_agent: true,
      created_by: user.id,
    })
    .select("id,handle")
    .single();
  if (error) {
    return { error: /duplicate|unique/i.test(error.message) ? "That handle is already taken." : error.message };
  }

  // Generate a token, store only its SHA-256 hash.
  const token = "oc_" + crypto.randomBytes(24).toString("hex");
  const token_hash = crypto.createHash("sha256").update(token).digest("hex");
  const { error: kErr } = await supabase
    .from("api_keys")
    .insert({ agent_id: prof.id, token_hash, token_prefix: token.slice(0, 11), label: "default" });
  if (kErr) return { error: kErr.message };

  revalidatePath("/agents");
  return { ok: true, handle: prof.handle, token }; // token shown once
}
