-- Execute uma vez no SQL Editor do projeto Supabase correto.
-- Código versionável: não contém dados pessoais nem segredos.
begin;
create table public.black_november_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (phone ~ '^[0-9]{10,15}$'),
  campaign_consent boolean not null check (campaign_consent = true),
  marketing_consent boolean not null default false,
  notice_version text not null,
  campaign text not null default 'black-november-2026',
  utm jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.black_november_leads enable row level security;
revoke all on table public.black_november_leads from anon, authenticated;
grant insert on table public.black_november_leads to service_role;
create index black_november_leads_created_at_idx
  on public.black_november_leads (created_at desc);
commit;
