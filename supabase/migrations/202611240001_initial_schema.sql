-- Royal Furniture demo schema
-- Run with the Supabase CLI or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.owner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Owner',
  is_owner boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text not null default '' check (char_length(short_description) <= 180),
  description text not null default '',
  price_inr integer not null check (price_inr >= 0),
  compare_at_price_inr integer check (compare_at_price_inr is null or compare_at_price_inr >= price_inr),
  primary_image_url text not null default '',
  image_urls text[] not null default '{}',
  materials text[] not null default '{}',
  dimensions text not null default '',
  featured boolean not null default false,
  in_stock boolean not null default true,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 24),
  email text not null default '' check (char_length(email) <= 254),
  message text not null check (char_length(message) between 5 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.owner_profiles
    where user_id = auth.uid() and is_owner = true
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to anon, authenticated;

alter table public.owner_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.enquiries enable row level security;

drop policy if exists "profiles_read_own" on public.owner_profiles;
create policy "profiles_read_own" on public.owner_profiles
for select to authenticated using (user_id = auth.uid());

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
for select to anon, authenticated using (true);

drop policy if exists "categories_owner_insert" on public.categories;
create policy "categories_owner_insert" on public.categories
for insert to authenticated with check (public.is_owner());
drop policy if exists "categories_owner_update" on public.categories;
create policy "categories_owner_update" on public.categories
for update to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "categories_owner_delete" on public.categories;
create policy "categories_owner_delete" on public.categories
for delete to authenticated using (public.is_owner());

drop policy if exists "products_public_read_published" on public.products;
create policy "products_public_read_published" on public.products
for select to anon, authenticated using (is_published or public.is_owner());

drop policy if exists "products_owner_insert" on public.products;
create policy "products_owner_insert" on public.products
for insert to authenticated with check (public.is_owner());
drop policy if exists "products_owner_update" on public.products;
create policy "products_owner_update" on public.products
for update to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "products_owner_delete" on public.products;
create policy "products_owner_delete" on public.products
for delete to authenticated using (public.is_owner());

drop policy if exists "enquiries_public_insert" on public.enquiries;
create policy "enquiries_public_insert" on public.enquiries
for insert to anon, authenticated
with check (
  status = 'new'
  and char_length(name) between 2 and 100
  and char_length(phone) between 7 and 24
  and char_length(message) between 5 and 2000
);

drop policy if exists "enquiries_owner_read" on public.enquiries;
create policy "enquiries_owner_read" on public.enquiries
for select to authenticated using (public.is_owner());
drop policy if exists "enquiries_owner_update" on public.enquiries;
create policy "enquiries_owner_update" on public.enquiries
for update to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "enquiries_owner_delete" on public.enquiries;
create policy "enquiries_owner_delete" on public.enquiries
for delete to authenticated using (public.is_owner());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
for select to public using (bucket_id = 'product-images');

drop policy if exists "product_images_owner_insert" on storage.objects;
create policy "product_images_owner_insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'product-images' and public.is_owner());

drop policy if exists "product_images_owner_update" on storage.objects;
create policy "product_images_owner_update" on storage.objects
for update to authenticated
using (bucket_id = 'product-images' and public.is_owner())
with check (bucket_id = 'product-images' and public.is_owner());

drop policy if exists "product_images_owner_delete" on storage.objects;
create policy "product_images_owner_delete" on storage.objects
for delete to authenticated
using (bucket_id = 'product-images' and public.is_owner());

-- PostgREST checks table privileges before row-level security policies.
-- These grants expose only the operations that RLS further permits.
grant usage on schema public to anon, authenticated;
grant select on table public.categories to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert on table public.enquiries to anon, authenticated;
grant select on table public.owner_profiles to authenticated;
grant insert, update, delete on table public.categories to authenticated;
grant insert, update, delete on table public.products to authenticated;
grant select, update, delete on table public.enquiries to authenticated;

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_public_catalogue_idx on public.products(is_published, featured, created_at desc);
create index if not exists enquiries_status_created_at_idx on public.enquiries(status, created_at desc);
