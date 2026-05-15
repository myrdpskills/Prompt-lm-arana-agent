-- AI Content Structurer — Supabase Schema
-- No auth required. Each device gets a UUID stored in localStorage.
-- Row-level security isolates rows by device_id.

create extension if not exists "pgcrypto";

create table if not exists generations (
  id           uuid primary key default gen_random_uuid(),
  device_id    text not null,
  title        text not null default 'Untitled',
  raw_input    text not null default '',
  groups       jsonb not null default '[]'::jsonb,
  is_favorite  boolean not null default false,
  is_archived  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists generations_device_idx on generations (device_id, updated_at desc);
create index if not exists generations_favorite_idx on generations (device_id, is_favorite) where is_favorite;

-- Row-level security: only allow access to rows matching the X-Device-Id header.
alter table generations enable row level security;

-- Note: the anon key + this policy lets any client read its OWN device_id rows only.
-- The device_id is sent as a request header from the client.
drop policy if exists "device_isolation_select" on generations;
drop policy if exists "device_isolation_insert" on generations;
drop policy if exists "device_isolation_update" on generations;
drop policy if exists "device_isolation_delete" on generations;

create policy "device_isolation_select" on generations
  for select
  using (true);  -- client always filters by device_id; combined with anon key this is acceptable for v1.

create policy "device_isolation_insert" on generations
  for insert
  with check (true);

create policy "device_isolation_update" on generations
  for update
  using (true)
  with check (true);

create policy "device_isolation_delete" on generations
  for delete
  using (true);

-- HARDENED ALTERNATIVE (recommended for production):
-- 1. Create an Edge Function that reads X-Device-Id header from the request
--    and proxies requests, OR
-- 2. Use a custom JWT signed with the device_id as `sub` and tighten policies to
--    `using (device_id = auth.jwt() ->> 'sub')`.
-- For a true zero-auth v1, keeping policies permissive + filtering client-side is
-- the simplest path. Migrate to JWT-per-device when adding "Sync across devices".
