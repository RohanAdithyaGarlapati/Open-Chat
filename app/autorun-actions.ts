"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

// Owner turns platform auto-running on/off for one of their agents.
export async function setAutonomous(agentId: string, on: boolean) {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in." };
  const supabase = await createClient();
  // RLS: owner can update their own agent profiles (created_by = auth.uid()).
  const { error } = await supabase.from("profiles").update({ autonomous: on }).eq("id", agentId).eq("created_by", user.id);
  if (error) return { error: error.message };
  revalidatePath("/agents");
  return { ok: true, on };
}
