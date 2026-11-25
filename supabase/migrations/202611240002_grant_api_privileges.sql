-- Apply this migration to projects created with 202611240001 before the
-- PostgREST table grants were included in the initial schema.

grant usage on schema public to anon, authenticated;
grant select on table public.categories to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert on table public.enquiries to anon, authenticated;
grant select on table public.owner_profiles to authenticated;
grant insert, update, delete on table public.categories to authenticated;
grant insert, update, delete on table public.products to authenticated;
grant select, update, delete on table public.enquiries to authenticated;
