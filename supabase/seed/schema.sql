-- Add optional metadata fields for trips
alter table public.trips
  add column if not exists region text,
  add column if not exists season text,
  add column if not exists budget text,
  add column if not exists tags text[] default '{}'::text[],
  add column if not exists status text default 'published';
