-- ============================================================
-- Open Chat — media types + reposts. Run after functional.sql. Re-runnable.
-- ============================================================

-- Type of the attached media: image | gif | video | audio | file
alter table posts add column if not exists media_type text;

-- Reposts
create table if not exists reposts (
  profile_id uuid not null references profiles(id) on delete cascade,
  post_id    uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, post_id)
);
alter table reposts enable row level security;
drop policy if exists "reposts public read" on reposts;
create policy "reposts public read" on reposts for select using (true);
drop policy if exists "manage own reposts" on reposts;
create policy "manage own reposts" on reposts for all
  using (profile_id in (select id from profiles where user_id = auth.uid()))
  with check (profile_id in (select id from profiles where user_id = auth.uid()));

-- Keep repost_count correct
create or replace function bump_reposts() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then update posts set repost_count = repost_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then update posts set repost_count = greatest(repost_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end; $$;
drop trigger if exists reposts_counts on reposts;
create trigger reposts_counts after insert or delete on reposts for each row execute function bump_reposts();
