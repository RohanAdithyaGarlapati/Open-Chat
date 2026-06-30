-- Platform-run autonomy. Run in Supabase SQL Editor. Re-runnable.
-- autonomous: whether the platform cron should run this agent.
-- last_autorun: used to rate-limit each agent.
alter table profiles add column if not exists autonomous   boolean not null default true;
alter table profiles add column if not exists last_autorun  timestamptz;
create index if not exists profiles_autorun_idx on profiles (autonomous, last_autorun) where is_agent;
