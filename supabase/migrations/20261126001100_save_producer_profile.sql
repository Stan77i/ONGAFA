-- ONG AFA — Migration 0011 : enregistrement atomique d'un profil producteur.
-- Une seule transaction pour : consentement, profil, cultures, besoins, téléphone.
-- SECURITY INVOKER : toutes les règles RLS et les déclencheurs s'appliquent normalement.

create or replace function public.save_producer_profile(p jsonb)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid  uuid := (select auth.uid());
  v_slug text;
  v_name text := btrim(p ->> 'display_name');
begin
  if v_uid is null then
    raise exception 'Connexion requise' using errcode = '42501';
  end if;

  -- Consentement (enregistré une fois, avec sa version)
  if not exists (select 1 from public.consents where user_id = v_uid and consent_type = 'producer_data' and revoked_at is null) then
    if coalesce(p ->> 'consent_version', '') = '' then
      raise exception 'Consentement requis' using errcode = '42501';
    end if;
    insert into public.consents (user_id, consent_type, version) values (v_uid, 'producer_data', p ->> 'consent_version');
  end if;

  select slug into v_slug from public.producers where user_id = v_uid;
  if v_slug is null then
    v_slug := btrim(regexp_replace(lower(extensions.unaccent(v_name)), '[^a-z0-9]+', '-', 'g'), '-');
    v_slug := left(coalesce(nullif(v_slug, ''), 'producteur'), 60) || '-' || substr(md5(random()::text), 1, 5);
    insert into public.producers (user_id, slug, display_name) values (v_uid, v_slug, v_name);
  end if;

  update public.producers set
    display_name      = v_name,
    region_id         = nullif(p ->> 'region_id', '')::uuid,
    city              = nullif(btrim(p ->> 'city'), ''),
    village           = nullif(btrim(p ->> 'village'), ''),
    description       = nullif(btrim(p ->> 'description'), ''),
    experience_years  = nullif(p ->> 'experience_years', '')::int,
    total_area_ha     = nullif(p ->> 'total_area_ha', '')::numeric,
    production_note   = nullif(btrim(p ->> 'production_note'), ''),
    availability_note = nullif(btrim(p ->> 'availability_note'), ''),
    visibility        = coalesce(nullif(p ->> 'visibility', ''), 'members')::public.visibility_level
  where user_id = v_uid;

  delete from public.producer_crops where producer_id = v_uid;
  insert into public.producer_crops (producer_id, crop_id, area_ha)
  select v_uid, (c ->> 'crop_id')::uuid, nullif(c ->> 'area_ha', '')::numeric
  from jsonb_array_elements(coalesce(p -> 'crops', '[]'::jsonb)) c;

  delete from public.producer_needs where producer_id = v_uid;
  insert into public.producer_needs (producer_id, need, note)
  select v_uid, (n ->> 'need')::public.producer_need, nullif(btrim(n ->> 'note'), '')
  from jsonb_array_elements(coalesce(p -> 'needs', '[]'::jsonb)) n;

  if nullif(btrim(p ->> 'phone'), '') is not null then
    insert into public.user_private (user_id, phone, phone_visibility)
    values (v_uid, btrim(p ->> 'phone'), coalesce(nullif(p ->> 'phone_visibility', ''), 'private')::public.visibility_level)
    on conflict (user_id) do update set phone = excluded.phone, phone_visibility = excluded.phone_visibility;
  else
    update public.user_private set phone = null where user_id = v_uid;
  end if;

  return v_slug;
end;
$$;

revoke all on function public.save_producer_profile(jsonb) from public, anon;
grant execute on function public.save_producer_profile(jsonb) to authenticated;
