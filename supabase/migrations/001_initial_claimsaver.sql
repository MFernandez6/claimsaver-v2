-- ClaimSaver+ — Supabase Postgres + Storage (Clerk handles sign-in; store clerk_id in profiles)
-- Apply in Supabase Dashboard → SQL Editor, or: supabase db push

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_id text not null unique,
  email text not null,
  first_name text not null default 'Unknown',
  last_name text not null default 'User',
  role text not null default 'user' check (role in ('user', 'admin', 'super_admin')),
  is_active boolean not null default true,
  phone text default '',
  address jsonb not null default '{}',
  preferences jsonb not null default '{}',
  admin_permissions jsonb not null default '{}',
  stats jsonb not null default '{"totalClaims":0,"activeClaims":0,"completedClaims":0,"totalSettlements":0}',
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_clerk on public.profiles (clerk_id);
create index if not exists idx_profiles_email on public.profiles (email);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  claim_number text not null unique,
  status text not null,
  priority text not null,
  claim_data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_claims_user on public.claims (user_id);
create index if not exists idx_claims_status on public.claims (status);
create index if not exists idx_claims_created on public.claims (created_at desc);

create table if not exists public.claim_documents (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  claim_id uuid references public.claims (id) on delete set null,
  name text not null,
  type text not null check (type in ('medical', 'legal', 'insurance', 'evidence', 'other')),
  file_type text not null,
  size_display text not null,
  upload_date text not null,
  description text not null default '',
  file_name text not null,
  mime_type text not null,
  storage_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_claim_documents_user on public.claim_documents (user_id);
create index if not exists idx_claim_documents_claim on public.claim_documents (claim_id);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  date text not null,
  time text not null,
  type text not null check (type in ('appointment', 'deadline', 'follow-up', 'payment', 'custom')),
  description text not null default '',
  priority text not null check (priority in ('low', 'medium', 'high')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_calendar_user on public.calendar_events (user_id);

-- Private bucket; server uploads/downloads with service role only
insert into storage.buckets (id, name, public, file_size_limit)
values ('claim-documents', 'claim-documents', false, 52428800)
on conflict (id) do update set file_size_limit = excluded.file_size_limit;
