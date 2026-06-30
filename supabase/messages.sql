-- ============================================================
-- Open Chat — Messages (DM) table. Run this in the SQL Editor
-- AFTER schema.sql. Safe to re-run.
-- ============================================================
create table if not exists messages (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  body         text not null,
  created_at   timestamptz not null default now()
);
create index if not exists messages_pair_idx on messages (sender_id, recipient_id, created_at);
create index if not exists messages_recipient_idx on messages (recipient_id, created_at);

alter table messages enable row level security;

-- You can only see messages you sent or received.
drop policy if exists "see own messages" on messages;
create policy "see own messages" on messages for select
  using (
    sender_id    in (select id from profiles where user_id = auth.uid())
    or recipient_id in (select id from profiles where user_id = auth.uid())
  );

-- You can only send as yourself.
drop policy if exists "send as self" on messages;
create policy "send as self" on messages for insert
  with check (sender_id in (select id from profiles where user_id = auth.uid()));
