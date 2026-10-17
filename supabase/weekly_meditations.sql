-- Enable pgcrypto for gen_random_uuid if needed
create extension if not exists pgcrypto;

-- Create weekly_meditations table
create table if not exists public.weekly_meditations (
	id uuid primary key default gen_random_uuid(),
	title text not null default 'Weekly Prayer & Meditation',
	greeting text default 'Good morning Covenant People of God😊.',
	scripture_reference text not null,
	scripture_text text not null,
	declaration text not null,
	week_date text,
	status text not null default 'published' check (status in ('draft','published')),
	is_active boolean not null default true,
	author_id uuid references auth.users(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists weekly_meditations_status_idx on public.weekly_meditations(status);
create index if not exists weekly_meditations_is_active_idx on public.weekly_meditations(is_active);
create index if not exists weekly_meditations_created_at_idx on public.weekly_meditations(created_at desc);

-- Trigger for updated_at
drop trigger if exists set_weekly_meditations_updated_at on public.weekly_meditations;
create trigger set_weekly_meditations_updated_at
before update on public.weekly_meditations
for each row execute function public.set_updated_at();

-- RLS Policies
alter table public.weekly_meditations enable row level security;

-- 1) Public can read published meditations
drop policy if exists public_select_published_meditations on public.weekly_meditations;
create policy public_select_published_meditations on public.weekly_meditations
	for select
	using (status = 'published');

-- 2) Admins can read all meditations
drop policy if exists admins_select_all_meditations on public.weekly_meditations;
create policy admins_select_all_meditations on public.weekly_meditations
	for select
	using (exists (select 1 from public.admins a where a.id = auth.uid()));

-- 3) Admins can insert/update/delete meditations
drop policy if exists admins_modify_meditations on public.weekly_meditations;
create policy admins_modify_meditations on public.weekly_meditations
	for all
	using (exists (select 1 from public.admins a where a.id = auth.uid()))
	with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- Insert initial Weekly Meditation sample
insert into public.weekly_meditations (
	title,
	greeting,
	scripture_reference,
	scripture_text,
	declaration,
	week_date,
	status,
	is_active
)
values (
	'Weekly Prayer & Meditation',
	'Good morning Covenant People of God😊.',
	'Psalm 115:9-15',
	'O Israel, trust and take refuge in the Lord! [Lean on, rely on, and be confident in Him!] He is their Help and their Shield. O house of Aaron [the priesthood], trust in and lean on the Lord! He is their Help and their Shield. You who [reverently] fear the Lord, trust in and lean on the Lord! He is their Help and their Shield. The Lord has been mindful of us, He will bless us: He will bless the house of Israel, He will bless the house of Aaron [the priesthood], He will bless those who reverently and worshipfully fear the Lord, both small and great. [Ps. 103:11; Rev. 11:18; 19:5.] May the Lord give you increase more and more, you and your children. May you be blessed of the Lord, Who made heaven and earth!',
	'This week, trust and take refuge in the Lord God, the maker of heaven and earth, and there shall be showers of blessings upon you and your household in Jesus name. Amen!',
	'Week of Praise & Refuge',
	'published',
	true
)
on conflict do nothing;
