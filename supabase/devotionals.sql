-- Ensure gen_random_uuid() is available
create extension if not exists pgcrypto;

-- Admins table used by RLS checks
create table if not exists public.admins (
	id uuid primary key references auth.users(id) on delete cascade,
	email text unique
);

-- Add the user to public.admins (replace with your actual email if needed)
insert into public.admins (id, email)
select id, email 
from auth.users 
where email = 'kehindeagboola52@gmail.com'
on conflict (email) do nothing;

-- Posts table aligned with src/types/blog.ts (interface Post)
create table if not exists public.posts (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	slug text not null unique,
	excerpt text,
	content text not null,
	cover_image_url text,
	tags text[] not null default '{}',
	status text not null check (status in ('draft','published')),
	featured boolean not null default false,
	author_id uuid references auth.users(id) on delete set null,
	published_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- Helpful indexes for common queries
create index if not exists posts_status_idx on public.posts(status);
create index if not exists posts_published_at_idx on public.posts(published_at desc);
create index if not exists posts_tags_gin on public.posts using gin(tags);

-- Keep updated_at fresh on updates
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
	new.updated_at = now();
	return new;
end
$$;

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

-- Debug function to log auth.uid()
create or replace function public.log_auth_uid()
returns uuid language plpgsql as $$
begin
    raise notice 'auth.uid(): %', auth.uid();
    return auth.uid();
end
$$;

-- Row Level Security
alter table public.posts enable row level security;

-- 1) Public can read published posts
drop policy if exists public_select_published on public.posts;
create policy public_select_published on public.posts
	for select
	using (status = 'published');

-- 2) Admins can read all posts
drop policy if exists admins_select_all on public.posts;
create policy admins_select_all on public.posts
	for select
	using (exists (select 1 from public.admins a where a.id = public.log_auth_uid()));

-- 3) Admins can insert/update/delete (updated to use log_auth_uid for debugging)
drop policy if exists admins_modify on public.posts;
create policy admins_modify on public.posts
	for all
	using (exists (select 1 from public.admins a where a.id = public.log_auth_uid()))
	with check (exists (select 1 from public.admins a where a.id = public.log_auth_uid()));

-- Storage: Ensure bucket exists and policies allow uploads and reads
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Storage RLS policies
drop policy if exists "blog-images public read" on storage.objects;
create policy "blog-images public read" on storage.objects
	for select
	using (bucket_id = 'blog-images');

drop policy if exists "blog-images authenticated upload" on storage.objects;
create policy "blog-images authenticated upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog-images');

drop policy if exists "blog-images update own" on storage.objects;
create policy "blog-images update own" on storage.objects
	for update to authenticated
	using (bucket_id = 'blog-images' and owner = auth.uid())
	with check (bucket_id = 'blog-images' and owner = auth.uid());

drop policy if exists "blog-images delete own" on storage.objects;
create policy "blog-images delete own" on storage.objects
	for delete to authenticated
	using (bucket_id = 'blog-images' and owner = auth.uid());

-- Debugging instructions:
-- 1. Run this script in the Supabase SQL editor.
-- 2. Check PostgreSQL logs (Database > Logs in Supabase dashboard) for 'auth.uid(): <value>' to verify the user ID.
-- 3. Ensure the user ID from logs matches the ID in public.admins (select * from public.admins).
-- 4. Test the insert operation again from your app.
-- 5. If the issue persists, check client-side code (hook.js:608) for authentication issues or share it for further analysis.