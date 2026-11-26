-- ONG AFA — Migration 0009 : pg_net enregistrée dans le schéma « extensions » (recommandation Supabase).
-- pg_net ne supporte pas « alter extension … set schema » : on la recrée. Ses fonctions restent dans
-- le schéma « net », donc la tâche planifiée « veille-ingest » n'est pas modifiée.
-- Sans pg_net (environnement de test local) : sans effet.

do $do$
begin
  if exists (select 1 from pg_extension e join pg_namespace n on n.oid = e.extnamespace
             where e.extname = 'pg_net' and n.nspname = 'public') then
    drop extension pg_net;
    create extension pg_net with schema extensions;
  end if;
end
$do$;
