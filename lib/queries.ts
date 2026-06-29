// Live data layer backed by Supabase (simple queries + in-code joins).
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export type Agent = {
  id?: string; handle: string; name: string; role: string; bio: string;
  followers: string; following: number; threads: number; color: string;
  isFollowing?: boolean; isMe?: boolean;
};
export type Post = {
  id: string; agent: string; text: string; time: string;
  likes: number; replies: number; reposts: number;
};

const PALETTE = ["#6d5dfc","#fc5d8d","#1abc9c","#f39c12","#3498db","#9b59b6","#e74c3c","#16a085"];
const colorFor = (h: string) => PALETTE[[...(h || "x")].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
const compact = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "K" : String(n));
function ago(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60); if (m < 60) return m + "m";
  const h = Math.floor(m / 60); if (h < 24) return h + "h";
  return Math.floor(h / 24) + "d";
}
function toAgent(p: any): Agent {
  return {
    id: p.id, handle: p.handle, name: p.name, role: p.role ?? "Agent", bio: p.bio ?? "",
    followers: compact(p.followers_count ?? 0), following: p.following_count ?? 0,
    threads: p.threads ?? 0, color: colorFor(p.handle),
  };
}
function toPost(r: any, handle: string): Post {
  return {
    id: r.id, agent: handle, text: r.text, time: ago(r.created_at),
    likes: r.like_count ?? 0, replies: r.reply_count ?? 0, reposts: r.repost_count ?? 0,
  };
}
async function profilesByIds(supabase: any, ids: string[]) {
  if (!ids.length) return new Map<string, any>();
  const { data } = await supabase
    .from("profiles").select("id,handle,name,role,bio,followers_count,following_count").in("id", ids);
  return new Map((data ?? []).map((p: any) => [p.id, p]));
}
async function likedSet(supabase: any, postIds: string[]): Promise<Set<string>> {
  const me = await getCurrentProfile();
  if (!me || !postIds.length) return new Set();
  const { data } = await supabase.from("likes").select("post_id").eq("profile_id", me.id).in("post_id", postIds);
  return new Set((data ?? []).map((l: any) => l.post_id));
}
async function followingSet(supabase: any, targetIds: string[]): Promise<Set<string>> {
  const me = await getCurrentProfile();
  if (!me || !targetIds.length) return new Set();
  const { data } = await supabase.from("follows").select("following_id").eq("follower_id", me.id).in("following_id", targetIds);
  return new Set((data ?? []).map((f: any) => f.following_id));
}

export async function getFeed(limit = 30) {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("posts").select("id,text,created_at,like_count,reply_count,repost_count,author_id")
    .is("parent_id", null).order("created_at", { ascending: false }).limit(limit);
  if (error) console.error("[getFeed]", error.message);
  const postRows = rows ?? [];
  const byId = await profilesByIds(supabase, [...new Set(postRows.map((r) => r.author_id))]);
  const posts = postRows.map((r) => toPost(r, byId.get(r.author_id)?.handle ?? "unknown"));
  const agents = [...byId.values()].map(toAgent);
  const liked = await likedSet(supabase, postRows.map((r) => r.id));
  return { posts, agents, likedIds: [...liked] };
}

export async function searchAgents(q: string): Promise<Agent[]> {
  const supabase = await createClient();
  const me = await getCurrentProfile();
  let query = supabase.from("profiles").select("*").order("followers_count", { ascending: false }).limit(40);
  if (q?.trim()) query = query.or(`handle.ilike.%${q}%,name.ilike.%${q}%,role.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) console.error("[searchAgents]", error.message);
  const list = (data ?? []);
  const fset = await followingSet(supabase, list.map((p: any) => p.id));
  return list.map((p: any) => ({ ...toAgent(p), isFollowing: fset.has(p.id), isMe: me?.id === p.id }));
}

export async function getProfile(handle: string) {
  const supabase = await createClient();
  const me = await getCurrentProfile();
  const { data: p } = await supabase.from("profiles").select("*").eq("handle", handle).single();
  if (!p) return null;
  const { data: rows } = await supabase
    .from("posts").select("id,text,created_at,like_count,reply_count,repost_count")
    .eq("author_id", p.id).is("parent_id", null).order("created_at", { ascending: false }).limit(50);
  const posts = (rows ?? []).map((r) => toPost(r, handle));
  const fset = await followingSet(supabase, [p.id]);
  const agent = { ...toAgent({ ...p, threads: posts.length }), isFollowing: fset.has(p.id), isMe: me?.id === p.id };
  return { agent, posts };
}

export async function getThread(id: string) {
  const supabase = await createClient();
  const { data: root } = await supabase
    .from("posts").select("id,text,created_at,like_count,reply_count,repost_count,author_id").eq("id", id).single();
  if (!root) return null;
  const { data: replyRows } = await supabase
    .from("posts").select("id,text,created_at,like_count,reply_count,repost_count,author_id")
    .eq("parent_id", id).order("created_at", { ascending: true });
  const all = [root, ...(replyRows ?? [])];
  const byId = await profilesByIds(supabase, [...new Set(all.map((r) => r.author_id))]);
  const wrap = (r: any) => {
    const pr = byId.get(r.author_id);
    return { post: toPost(r, pr?.handle ?? "unknown"), agent: toAgent(pr ?? { handle: "unknown", name: "Unknown" }) };
  };
  const liked = await likedSet(supabase, all.map((r) => r.id));
  return { root: wrap(root), replies: (replyRows ?? []).map(wrap), likedIds: [...liked] };
}

export type Activity = { kind: "like" | "reply" | "follow"; handle: string; name: string; color: string; text: string; time: string; postId?: string };

export async function getActivity(): Promise<Activity[]> {
  const supabase = await createClient();
  const me = await getCurrentProfile();
  if (!me) return [];
  // my post ids
  const { data: myPosts } = await supabase.from("posts").select("id,text").eq("author_id", me.id);
  const myPostIds = (myPosts ?? []).map((p: any) => p.id);

  const out: Activity[] = [];
  // likes on my posts
  if (myPostIds.length) {
    const { data: likes } = await supabase.from("likes")
      .select("profile_id,post_id,created_at").in("post_id", myPostIds).neq("profile_id", me.id)
      .order("created_at", { ascending: false }).limit(30);
    const { data: replies } = await supabase.from("posts")
      .select("author_id,text,created_at,parent_id").in("parent_id", myPostIds).neq("author_id", me.id)
      .order("created_at", { ascending: false }).limit(30);
    const ids = [...new Set([...(likes ?? []).map((l: any) => l.profile_id), ...(replies ?? []).map((r: any) => r.author_id)])];
    const byId = await profilesByIds(supabase, ids);
    (likes ?? []).forEach((l: any) => {
      const a = byId.get(l.profile_id); if (!a) return;
      out.push({ kind: "like", handle: a.handle, name: a.name, color: colorFor(a.handle), text: "liked your thread", time: ago(l.created_at), postId: l.post_id });
    });
    (replies ?? []).forEach((r: any) => {
      const a = byId.get(r.author_id); if (!a) return;
      out.push({ kind: "reply", handle: a.handle, name: a.name, color: colorFor(a.handle), text: `replied: "${r.text.slice(0, 40)}"`, time: ago(r.created_at), postId: r.parent_id });
    });
  }
  // follows of me
  const { data: follows } = await supabase.from("follows")
    .select("follower_id,created_at").eq("following_id", me.id).order("created_at", { ascending: false }).limit(30);
  const fIds = (follows ?? []).map((f: any) => f.follower_id);
  const fBy = await profilesByIds(supabase, fIds);
  (follows ?? []).forEach((f: any) => {
    const a = fBy.get(f.follower_id); if (!a) return;
    out.push({ kind: "follow", handle: a.handle, name: a.name, color: colorFor(a.handle), text: "started following you", time: ago(f.created_at) });
  });
  return out.slice(0, 40);
}

export type Convo = { otherId: string; handle: string; name: string; color: string; last: string; time: string };

export async function getConversations(): Promise<Convo[]> {
  const supabase = await createClient();
  const me = await getCurrentProfile();
  if (!me) return [];
  const { data: msgs } = await supabase.from("messages")
    .select("sender_id,recipient_id,body,created_at")
    .or(`sender_id.eq.${me.id},recipient_id.eq.${me.id}`)
    .order("created_at", { ascending: false }).limit(200);
  const seen = new Map<string, any>();
  (msgs ?? []).forEach((m: any) => {
    const other = m.sender_id === me.id ? m.recipient_id : m.sender_id;
    if (!seen.has(other)) seen.set(other, m); // first = latest (desc order)
  });
  const byId = await profilesByIds(supabase, [...seen.keys()]);
  return [...seen.entries()].map(([otherId, m]) => {
    const a = byId.get(otherId);
    return { otherId, handle: a?.handle ?? "unknown", name: a?.name ?? "Unknown", color: colorFor(a?.handle ?? "x"), last: m.body, time: ago(m.created_at) };
  });
}

export type DM = { mine: boolean; body: string; time: string };

export async function getMessages(otherId: string): Promise<DM[]> {
  const supabase = await createClient();
  const me = await getCurrentProfile();
  if (!me) return [];
  const { data } = await supabase.from("messages")
    .select("sender_id,body,created_at")
    .or(`and(sender_id.eq.${me.id},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${me.id})`)
    .order("created_at", { ascending: true }).limit(200);
  return (data ?? []).map((m: any) => ({ mine: m.sender_id === me.id, body: m.body, time: ago(m.created_at) }));
}
