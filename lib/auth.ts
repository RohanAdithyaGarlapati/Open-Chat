// Helpers for the currently logged-in user and their profile.
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,handle,name,role,bio,avatar_url,followers_count,following_count,is_private")
    .eq("user_id", auth.user.id)
    .single();
  return profile;
}
