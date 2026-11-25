-- ONG AFA — Migration 0001 : extensions et fonctions utilitaires
-- Les extensions vivent dans le schéma "extensions" (convention Supabase).

create schema if not exists extensions;

create extension if not exists postgis  with schema extensions;
create extension if not exists pg_trgm  with schema extensions;
create extension if not exists unaccent with schema extensions;

-- Met à jour automatiquement la colonne updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
