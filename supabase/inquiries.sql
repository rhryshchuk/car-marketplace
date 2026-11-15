-- Customer inquiries. Run once in the Supabase SQL editor after schema.sql.
-- Does not change vehicles, photos, storage, or existing policies.
-- Visitors may insert. Only public.is_admin() may read, update, or delete.

create table public.vehicle_inquiries (
  id uuid primary key default gen_random_uuid(),
  vehicle_id bigint references public.vehicles (id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint vehicle_inquiries_name_not_blank check (char_length(btrim(name)) > 0),
  constraint vehicle_inquiries_name_length check (char_length(name) <= 120),
  constraint vehicle_inquiries_phone_not_blank check (char_length(btrim(phone)) > 0),
  constraint vehicle_inquiries_phone_length check (char_length(phone) <= 40),
  constraint vehicle_inquiries_email_length check (email is null or char_length(btrim(email)) between 3 and 200),
  constraint vehicle_inquiries_message_length check (message is null or char_length(message) <= 4000),
  constraint vehicle_inquiries_status_allowed check (status in ('new', 'contacted', 'closed'))
);

comment on table public.vehicle_inquiries is
  'Customer inquiries. Public users can submit. Only the administrator can read or manage them.';

comment on column public.vehicle_inquiries.vehicle_id is
  'Set when the inquiry starts from a vehicle page. Null for a general contact request.';

comment on column public.vehicle_inquiries.status is 'new, contacted, or closed.';

create index vehicle_inquiries_created_at_idx
  on public.vehicle_inquiries (created_at desc);

create index vehicle_inquiries_status_idx
  on public.vehicle_inquiries (status);

create index vehicle_inquiries_vehicle_id_idx
  on public.vehicle_inquiries (vehicle_id);

alter table public.vehicle_inquiries enable row level security;

create policy vehicle_inquiries_public_insert
on public.vehicle_inquiries
for insert
to anon, authenticated
with check (
  status = 'new'
  and (
    vehicle_id is null
    or exists (
      select 1
      from public.vehicles as vehicle
      where vehicle.id = vehicle_id
        and (
          vehicle.status in ('available', 'expected', 'sold')
          or public.is_admin()
        )
    )
  )
);

create policy vehicle_inquiries_admin_select
on public.vehicle_inquiries
for select
to authenticated
using (public.is_admin());

create policy vehicle_inquiries_admin_update
on public.vehicle_inquiries
for update
to authenticated
using (public.is_admin())
with check (
  public.is_admin()
  and status in ('new', 'contacted', 'closed')
);

create policy vehicle_inquiries_admin_delete
on public.vehicle_inquiries
for delete
to authenticated
using (public.is_admin());

revoke all on table public.vehicle_inquiries from public, anon, authenticated;
grant insert on table public.vehicle_inquiries to anon, authenticated;
grant select, update, delete on table public.vehicle_inquiries to authenticated;
