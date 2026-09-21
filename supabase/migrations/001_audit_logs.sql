create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('auth', 'finance', 'drive', 'system')),
  action text not null,
  status text not null check (status in ('success', 'failure')),
  actor_email text,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists audit_logs_actor_email_idx
  on public.audit_logs (actor_email);

alter table public.audit_logs enable row level security;

revoke all on table public.audit_logs from anon, authenticated;
