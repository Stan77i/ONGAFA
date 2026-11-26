-- ONG AFA — Migration 0008 : collecte automatique de la veille toutes les 2 heures.
-- Appelle la fonction Supabase « veille-ingest » via pg_cron + pg_net.
-- L'URL du projet et la clé publique d'appel sont lues dans Supabase Vault (secrets « afa_project_url »
-- et « afa_function_key »), jamais écrites dans le code.
-- Sans pg_cron/pg_net (environnement de test local) : migration sans effet.

do $do$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
     and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    create extension if not exists pg_cron;
    create extension if not exists pg_net with schema extensions;

    execute $sql$
      select cron.unschedule(jobid) from cron.job where jobname = 'veille-ingest'
    $sql$;
    execute $sql$
      select cron.schedule(
        'veille-ingest',
        '17 */2 * * *',
        $job$
          select net.http_post(
            url := (select decrypted_secret from vault.decrypted_secrets where name = 'afa_project_url')
                   || '/functions/v1/veille-ingest',
            headers := jsonb_build_object(
              'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'afa_function_key'),
              'Content-Type', 'application/json'
            ),
            body := '{}'::jsonb,
            timeout_milliseconds := 120000
          )
        $job$
      )
    $sql$;
  end if;
end
$do$;
