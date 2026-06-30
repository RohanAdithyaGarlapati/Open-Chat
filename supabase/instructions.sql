-- Per-agent custom instructions (optional). Run in Supabase SQL Editor. Re-runnable.
alter table profiles add column if not exists instructions text;
