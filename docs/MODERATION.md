# Modération de la communauté

## Règles appliquées automatiquement (en base)

| Situation                                                                      | Effet                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Membre avec moins de 2 contenus validés                                        | Sujet ou réponse **en attente** de validation          |
| Message contenant un lien, envoyé par un membre peu actif                      | En attente, même pour un membre confirmé récent        |
| Modérateur ou administrateur                                                   | Publié directement                                     |
| Plus de 10 sujets ou 60 réponses par jour, ou 2 envois en moins de 20 secondes | Refusé (message clair)                                 |
| 3 signalements distincts sur un contenu publié                                 | **Masqué automatiquement** en attendant l'examen       |
| Témoignage                                                                     | Toujours en attente, publié seulement après validation |
| Compte suspendu ou banni                                                       | Ne peut plus rien publier                              |

Tout contenu en attente reste visible **par son auteur seul**, avec la mention « En attente de validation ».
Chaque décision est enregistrée dans `moderation_actions` (qui, quand, statut avant et après, motif).

## Décider (en attendant le back-office, phase 9)

Les décisions passent par la fonction `moderate_content`, qui vérifie le droit de modérer, enregistre la
décision et clôt les signalements liés. Statuts : `published`, `hidden` (masqué, réversible), `removed`.

`moderate_content` s'appelle depuis une session connectée avec un compte modérateur ou administrateur (c'est
ce que fera le back-office). **Dans l'éditeur SQL de Supabase**, personne n'est « connecté » : la fonction y
répond « Permission refusée ». Utiliser alors la procédure « Depuis l'éditeur SQL » plus bas.

Voir ce qui attend :

```sql
select 'sujet' as type, id, author_name, title as texte, created_at from public.posts where status = 'pending'
union all
select 'réponse', id, author_name, left(body, 80), created_at from public.comments where status = 'pending'
union all
select 'témoignage', id, name, left(quote, 80), created_at from public.testimonials where status = 'pending'
order by created_at;
```

Voir les signalements ouverts :

```sql
select target_type, target_id, reason, count(*) as nb, min(created_at) as premier
from public.reports where status = 'open' group by 1, 2, 3 order by nb desc;
```

Valider, masquer :

```sql
select public.moderate_content('post', '<id>', 'published', 'Question utile');
select public.moderate_content('comment', '<id>', 'hidden', 'Publicité');
select public.moderate_content('testimonial', '<id>', 'published');
```

### Depuis l'éditeur SQL de Supabase (propriétaire du projet)

Modifier le statut directement, puis noter la décision (l'auteur reste vide) :

```sql
update public.posts set status = 'published' where id = '<id>';
insert into public.moderation_actions (target_type, target_id, previous_status, new_status, reason)
values ('post', '<id>', 'pending', 'published', 'Validé depuis l''éditeur SQL');
update public.reports set status = 'dismissed', handled_at = now()
where target_type = 'post' and target_id = '<id>' and status = 'open';
```

Pour une réponse : table `comments` et `target_type = 'comment'`. Pour un témoignage : table `testimonials`,
avec `published_at = now()` au moment de la publication.

### Suspendre un compte

Depuis une session administrateur : `select public.set_account_status('<user_id>', 'suspended');`

Après une décision, le forum public se met à jour dans les minutes qui suivent (cache).
