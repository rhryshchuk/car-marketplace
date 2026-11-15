-- Car Marketplace: vehicles, photos, and storage.
-- Supabase Free only. Do not put the service role key in frontend code.
--
-- Administrator placeholder. After creating the single admin user, replace
-- every occurrence of this UUID with that user's id from Authentication → Users.
-- 00000000-0000-0000-0000-000000000000

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select auth.uid() = 'a7f9b9a5-7932-4ac9-8ded-0e8c8e16eba9'::uuid;
$$;

comment on function public.is_admin() is
  'True only for the single administrator. Replace the UUID placeholder before use.';

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.vehicles (
  id bigint generated always as identity primary key,
  brand text not null,
  model text not null,
  year integer not null,
  price numeric(12, 2) not null,
  mileage integer not null,
  fuel text not null,
  body_type text not null,
  image text not null,
  status text not null,
  created_at timestamptz not null default now(),
  constraint vehicles_brand_not_blank check (char_length(btrim(brand)) > 0),
  constraint vehicles_model_not_blank check (char_length(btrim(model)) > 0),
  constraint vehicles_fuel_not_blank check (char_length(btrim(fuel)) > 0),
  constraint vehicles_body_type_not_blank check (char_length(btrim(body_type)) > 0),
  constraint vehicles_image_not_blank check (char_length(btrim(image)) > 0),
  constraint vehicles_year_range check (year between 1900 and 2100),
  constraint vehicles_price_non_negative check (price >= 0),
  constraint vehicles_mileage_non_negative check (mileage >= 0),
  constraint vehicles_status_allowed check (
    status in ('available', 'expected', 'sold', 'hidden')
  )
);

comment on table public.vehicles is
  'Company inventory. Public catalog shows available, expected, and sold. Hidden is admin-only.';

comment on column public.vehicles.price is 'USD.';
comment on column public.vehicles.mileage is 'Kilometers.';
comment on column public.vehicles.image is
  'Main image URL. Kept equal to the first photo by sort_order.';

create index vehicles_public_status_idx
  on public.vehicles (status)
  where status in ('available', 'expected', 'sold');

create table public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id bigint not null references public.vehicles (id) on delete cascade,
  url text not null,
  storage_path text not null,
  sort_order integer not null default 0,
  constraint vehicle_photos_url_not_blank check (char_length(btrim(url)) > 0),
  constraint vehicle_photos_storage_path_not_blank check (char_length(btrim(storage_path)) > 0),
  constraint vehicle_photos_sort_order_non_negative check (sort_order >= 0),
  constraint vehicle_photos_vehicle_sort_unique unique (vehicle_id, sort_order)
);

comment on table public.vehicle_photos is
  'Photo files for one vehicle. The lowest sort_order is the main image.';

create index vehicle_photos_vehicle_id_idx
  on public.vehicle_photos (vehicle_id, sort_order);

create or replace function public.set_vehicle_main_image()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_vehicle_id bigint := coalesce(new.vehicle_id, old.vehicle_id);
  main_url text;
begin
  select photo.url
  into main_url
  from public.vehicle_photos as photo
  where photo.vehicle_id = target_vehicle_id
  order by photo.sort_order asc, photo.id asc
  limit 1;

  if main_url is not null then
    update public.vehicles
    set image = main_url
    where id = target_vehicle_id;
  end if;

  return coalesce(new, old);
end;
$$;

create trigger vehicle_photos_sync_main_image
after insert or update or delete on public.vehicle_photos
for each row
execute function public.set_vehicle_main_image();

alter table public.vehicles enable row level security;
alter table public.vehicle_photos enable row level security;

create policy vehicles_public_read
on public.vehicles
for select
to anon, authenticated
using (
  status in ('available', 'expected', 'sold')
  or public.is_admin()
);

create policy vehicles_admin_insert
on public.vehicles
for insert
to authenticated
with check (public.is_admin());

create policy vehicles_admin_update
on public.vehicles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy vehicles_admin_delete
on public.vehicles
for delete
to authenticated
using (public.is_admin());

create policy vehicle_photos_public_read
on public.vehicle_photos
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.vehicles as vehicle
    where vehicle.id = vehicle_photos.vehicle_id
      and vehicle.status in ('available', 'expected', 'sold')
  )
);

create policy vehicle_photos_admin_insert
on public.vehicle_photos
for insert
to authenticated
with check (public.is_admin());

create policy vehicle_photos_admin_update
on public.vehicle_photos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy vehicle_photos_admin_delete
on public.vehicle_photos
for delete
to authenticated
using (public.is_admin());

grant select on public.vehicles to anon, authenticated;
grant insert, update, delete on public.vehicles to authenticated;
grant select on public.vehicle_photos to anon, authenticated;
grant insert, update, delete on public.vehicle_photos to authenticated;

-- Private bucket. Visitors can read a file only when its vehicle is public.
-- A public bucket would expose hidden vehicles by direct URL.
-- Store each file as {vehicle_id}/{filename}. Limit: 5 MB, jpeg/png/webp.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-photos',
  'vehicle-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.vehicle_id_from_storage_path(object_name text)
returns bigint
language plpgsql
stable
as $$
declare
  folder text := (storage.foldername(object_name))[1];
begin
  if folder is null or folder !~ '^[0-9]+$' then
    return null;
  end if;

  return folder::bigint;
end;
$$;

revoke all on function public.vehicle_id_from_storage_path(text) from public;
grant execute on function public.vehicle_id_from_storage_path(text) to anon, authenticated;

create policy vehicle_photos_storage_public_read
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'vehicle-photos'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.vehicles as vehicle
      where vehicle.id = public.vehicle_id_from_storage_path(name)
        and vehicle.status in ('available', 'expected', 'sold')
    )
  )
);

create policy vehicle_photos_storage_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'vehicle-photos'
  and public.is_admin()
);

create policy vehicle_photos_storage_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'vehicle-photos' and public.is_admin())
with check (bucket_id = 'vehicle-photos' and public.is_admin());

create policy vehicle_photos_storage_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'vehicle-photos' and public.is_admin());
