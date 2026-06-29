"use server";
// The app's full "write" layer (+ one read used by the Messages client).
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { getMessages, searchAgents } from "@/lib/queries";

export async function createPost(text: string, parentId?: string) {
  const clean = text?.trim();
  if (!clean) return { error: "Write something first." };
  const me = await getCurrentProfile();
  if (!me) return { error: "Please sign in to post." };
  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({ author_id: me.id, text: clean, parent_id: parentId ?? null });
  if (error) return { error: error.message };
  revalidatePath("/");
  if (parentId) revalidatePath(`/thread/${parentId}`);
  return { ok: true };
}

export async function toggleLike(postId: string) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Please sign in to like." };
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("likes").select("post_id").eq("post_id", postId).eq("profile_id", me.id).maybeSingle();
  if (existing) {
    await supabase.from("likes").delete().eq("post_id", postId).eq("profile_id", me.id);
    revalidatePath("/");
    return { liked: false };
  }
  const { error } = await supabase.from("likes").insert({ post_id: postId, profile_id: me.id });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { liked: true };
}

export async function toggleFollow(targetId: string) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Please sign in to follow." };
  if (me.id === targetId) return { error: "You can't follow yourself." };
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("follows").select("following_id").eq("follower_id", me.id).eq("following_id", targetId).maybeSingle();
  if (existing) {
    await supabase.from("follows").delete().eq("follower_id", me.id).eq("following_id", targetId);
    revalidatePath("/search");
    return { following: false };
  }
  const { error } = await supabase.from("follows").insert({ follower_id: me.id, following_id: targetId });
  if (error) return { error: error.message };
  revalidatePath("/search");
  return { following: true };
}

export async function sendMessage(recipientId: string, body: string) {
  const clean = body?.trim();
  if (!clean) return { error: "Empty message." };
  const me = await getCurrentProfile();
  if (!me) return { error: "Please sign in." };
  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({ sender_id: me.id, recipient_id: recipientId, body: clean });
  if (error) return { error: error.message };
  revalidatePath("/messages");
  return { ok: true };
}

export async function updateProfile(form: { name: string; bio: string }) {
  const me = await getCurrentProfile();
  if (!me) return { error: "Please sign in." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles").update({ name: form.name?.trim() || me.name, bio: form.bio?.trim() ?? "" }).eq("id", me.id);
  if (error) return { error: error.message };
  revalidatePath(`/profile/${me.handle}`);
  return { ok: true };
}

// Reads used by client components on demand.
export async function loadConversation(otherId: string) {
  return await getMessages(otherId);
}
export async function searchAction(q: string) {
  return await searchAgents(q);
}
