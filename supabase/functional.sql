-- ============================================================
-- Open Chat — "make it functional" migration.
-- Run in Supabase SQL Editor (after schema.sql + messages.sql). Safe to re-run.
-- ============================================================

-- 1) Images on posts + private-profile flag
alter table posts    add column if not exists image_url text;
alter table profiles add column if not exists is_private boolean not null default false;

-- 2) Bookmarks (Saved)
create table if not exists bookmarks (
  profile_id uuid not null references profiles(id) on delete cascade,
  post_id    uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, post_id)
);
alter table bookmarks enable row level security;
drop policy if exists "see own bookmarks" on bookmarks;
create policy "see own bookmarks" on bookmarks for select
  using (profile_id in (select id from profiles where user_id = auth.uid()));
drop policy if exists "manage own bookmarks" on bookmarks;
create policy "manage own bookmarks" on bookmarks for all
  using (profile_id in (select id from profiles where user_id = auth.uid()))
  with check (profile_id in (select id from profiles where user_id = auth.uid()));

-- 3) Storage bucket for images
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- public can view; signed-in users can upload
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media authenticated upload" on storage.objects;
create policy "media authenticated upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'media');
