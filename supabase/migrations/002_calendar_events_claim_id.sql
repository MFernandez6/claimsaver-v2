-- Link calendar milestones to a claim (e.g. Florida PIP deadline set per claim).
alter table public.calendar_events
  add column if not exists claim_id uuid references public.claims (id) on delete cascade;

create index if not exists idx_calendar_events_claim on public.calendar_events (claim_id);
