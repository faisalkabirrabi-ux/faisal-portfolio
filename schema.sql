-- Run this whole file once in Supabase: SQL Editor > New query > paste > Run.
create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table public.profile (id int primary key default 1 check (id = 1), email text, github text, linkedin text, cv_en_url text, cv_bn_url text);
create table public.skills (id bigint generated always as identity primary key, name_en text not null default '', name_bn text not null default '');
create table public.projects (id bigint generated always as identity primary key,
  title_en text not null default '', title_bn text not null default '', desc_en text not null default '', desc_bn text not null default '',
  tags text not null default '', live_url text not null default '', repo_url text not null default '');

alter table public.admins enable row level security;
alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;

create function public.is_admin() returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- admins: a user may only see their own row. Nobody can write from the browser (add admins via SQL only).
create policy "own admin row" on public.admins for select to authenticated using (user_id = auth.uid());

-- content tables: everyone can read, only admins can write.
do $$ declare t text; begin
  foreach t in array array['profile', 'skills', 'projects'] loop
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- CV storage: public PDFs, max 5 MB, only admins can upload or replace.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cv', 'cv', true, 5242880, array['application/pdf']) on conflict (id) do nothing;
create policy "cv public read" on storage.objects for select using (bucket_id = 'cv');
create policy "cv admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'cv' and public.is_admin());
create policy "cv admin update" on storage.objects for update to authenticated using (bucket_id = 'cv' and public.is_admin()) with check (bucket_id = 'cv' and public.is_admin());
create policy "cv admin delete" on storage.objects for delete to authenticated using (bucket_id = 'cv' and public.is_admin());

-- AFTER creating your user in Authentication > Users, run this (replace the email) to make yourself admin:
-- insert into public.admins (user_id) select id from auth.users where email = 'YOUR-LOGIN-EMAIL';
