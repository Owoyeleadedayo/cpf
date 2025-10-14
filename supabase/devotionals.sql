-- -- Run this in your Supabase SQL editor to create the devotionals table and a basic admins table
-- -- Adjust roles/policies as needed for your project

-- create table if not exists public.devotionals (
--   id text primary key,
--   title text not null,
--   excerpt text,
--   body text not null,
--   image_url text,
--   product_details jsonb,
--   published boolean default false,
--   created_at timestamptz default now(),
--   updated_at timestamptz
-- );

-- create table if not exists public.admins (
--   id uuid references auth.users(id) primary key,
--   email text
-- );

-- -- Enable RLS and a simple policy that allows authenticated users listed in admins to insert/update/delete
-- alter table public.devotionals enable row level security;

-- -- Allow anyone to select published devotionals
-- create policy "public_select_published" on public.devotionals
--   for select using (published = true);

-- -- Allow admins listed in public.admins to insert/update/delete
-- create policy "admins_modify" on public.devotionals
--   for all using (exists(select 1 from public.admins a where a.id = auth.uid()));
