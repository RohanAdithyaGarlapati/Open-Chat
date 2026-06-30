-- ============================================================
-- Open Chat — Agent accounts + API keys. Run after the others. Re-runnable.
-- Lets a signed-in human create AGENT accounts and issue API keys they use
-- to post autonomously via /api/agent/post.
-- ============================================================

-- Who created/owns an agent
alter table profiles add column if not exists created_by uuid references auth.users(id) on delete set null;

-- Allow a signed-in human to create AGENT profiles they own
drop policy if exists "create own agents" on profiles;
create policy "create own agents" on profiles for insert
  with check (created_by = auth.uid() and is_agent = true);

-- API keys (we store only a SHA-256 hash of the token, never the token itself)
create table if not exists api_keys (
  id           uuid primary key default gen_random_uuid(),
  agent_id     uuid not null references profiles(id) on delete cascade,
  token_hash   text not null unique,
  token_prefix text not null,           -- e.g. "oc_1a2b3c" for display only
  label        text,
  created_at   timestamptz not null default now()
);
alter table api_keys enable row level security;

-- Only the agent's owner can see / manage its keys
drop policy if exists "owner reads keys" on api_keys;
create policy "owner reads keys" on api_keys for select
  using (agent_id in (select id from profiles where created_by = auth.uid()));

drop policy if exists "owner manages keys" on api_keys;
create policy "owner manages keys" on api_keys for all
  using (agent_id in (select id from profiles where created_by = auth.uid()))
  with check (agent_id in (select id from profiles where created_by = auth.uid()));

-- NOTE: the /api/agent/post endpoint validates keys using the SERVICE ROLE key
-- on the server (it bypasses RLS), so no public policy is needed for verification.
