# Design system — ONG AFA

Direction **« Terre et trait »** (validée le 2026-11-25) : un journal de terrain institutionnel.
Rigueur d'une organisation nationale (grilles, données datées, typographie posée), habitée par le trait
d'encre dessiné à la main du logo et par les vraies photos du terrain.

Démonstration vivante : `/design-system` (en développement uniquement ; en production, 404 sauf si
`SHOW_DESIGN_SYSTEM=1` au moment du build).

## Couleurs

Définies dans `src/app/globals.css` (`@theme`). Classes Tailwind : `bg-afa`, `text-forest`, etc.

| Jeton          | Code      | Usage                                                  | Contraste                        |
| -------------- | --------- | ------------------------------------------------------ | -------------------------------- |
| `forest`       | `#2c4520` | Titres, sections sombres, pied de page                 | 10,6:1 sur blanc                 |
| `afa`          | `#4a7230` | Primaire : boutons (texte blanc), liens                | 5,6:1                            |
| `leaf`         | `#59883c` | Vert du logo : surfaces, illustrations                 | 4,2:1 — **pas de texte courant** |
| `leaf-light`   | `#a9c98f` | Texte et accents sur fond `forest`                     | 5,8:1 sur forêt                  |
| `accent`       | `#df8433` | Orange : boutons et surfaces, **toujours texte `ink`** | encre dessus 5,7:1               |
| `accent-hover` | `#eb9652` | Survol du bouton orange                                | encre dessus 6,9:1               |
| `accent-text`  | `#9a4c15` | Orange lisible : catégories, surtitres                 | ≥ 4,9:1 sur blanc, sable, crème  |
| `laterite`     | `#8c4a2f` | Touche terre : filets, citations                       | 6,7:1                            |
| `harvest`      | `#e9b44c` | Statut « en cours », focus sur fond sombre             | encre dessus 8,4:1               |
| `sand`         | `#f7f2e8` | Fond alterné                                           | —                                |
| `cream`        | `#efe6d2` | Cartes, encadrés, espace manioc                        | —                                |
| `ink`          | `#1d2417` | Texte principal                                        | 16:1                             |
| `ink-soft`     | `#4b5444` | Texte secondaire, dates                                | ≥ 6,3:1                          |
| `field`        | `#858b78` | Bordure des champs                                     | ≥ 3,2:1 (exigence composants)    |
| `rule`         | `#ddd5c3` | Filets **décoratifs** uniquement                       | —                                |
| `danger`       | `#b3261e` | Erreurs                                                | 6,5:1                            |

**Interdits :** texte blanc sur orange (2,8:1) ; texte orange `accent` sur fond clair ; texte courant en
`leaf` ; information portée par la couleur seule (toujours forme, icône ou texte en plus).

Toute nouvelle couleur doit être vérifiée (WCAG AA : 4,5:1 texte, 3:1 grands titres et composants).

## Typographie

- **Fraunces** (titres, `font-display`) et **Source Sans 3** (texte, `font-sans`), chargées par
  `src/app/fonts.ts`, auto-hébergées au build, sous-ensembles latin et latin étendu.
- Échelle fluide : `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body` (17 → 18 px), `text-meta` (14 px).
- Surtitres : `text-meta font-semibold uppercase tracking-[0.12em]` en `accent-text` (ou `leaf-light` sur sombre).
- Lignes de texte limitées à environ 68 caractères (`max-w-[68ch]` ou `max-w-prose`).

## Signature visuelle

- **Trait d'encre** (`InkUnderline`, `InkMark`) : sous le slogan ou un mot-clé, une fois par écran au plus.
- **Chaîne de valeur** (`ValueChain`) : Production → Collecte → Transformation → Valorisation →
  Commercialisation → Débouchés → Autonomisation. Verticale sur mobile, horizontale dès la tablette.
- **Données datées** : tout chiffre (`KeyFigure`) et toute donnée (`DataStamp`, `PriceTable`) portent date et source.

## Composants (`src/components/`)

| Dossier    | Composants                                                                                                                                                                                                                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/`      | `Button` (primary, accent, secondary, ghost, danger, on-dark ; `href` = lien), `Badge` (+ `VerifiedBadge`, `ExternalSourceBadge`), `Alert`, `Toast`, `Modal` (dialog natif, panneau bas sur mobile), `Skeleton`/`CardSkeleton`, `EmptyState`, `Spinner`, `Avatar`, `MediaFrame`, `Breadcrumb`, `Pagination`, `FilterChips` |
| `forms/`   | `Field` (libellé, aide, erreur reliés), `Input`, `Textarea`, `Select`, `Checkbox`, `ChoiceChips`, `Stepper`, `ConsentCheckbox`, `NewsletterForm`                                                                                                                                                                           |
| `content/` | `ArticleCard`, `EventCard`, `OpportunityCard`, `ResourceCard`, `DiscussionCard`, `ProducerCard`, `TestimonialQuote`, `PriceTable`, `DerivativeCard`, `KeyFigure`, `DataStamp`                                                                                                                                              |
| `map/`     | `StatusPill`/`StatusShape`/`MapLegend` (implantée ● / en cours ◐ / bientôt ◌), `TerritoryPanel`                                                                                                                                                                                                                            |
| `brand/`   | `InkUnderline`, `InkMark`, `ValueChain`                                                                                                                                                                                                                                                                                    |
| `layout/`  | `SiteHeader`, `MobileTabBar`, `SiteFooter`, `Section`, `Container`, `SectionHeading`                                                                                                                                                                                                                                       |

## Règles d'usage

- **Rien d'inventé** : une section sans contenu réel est masquée ou affiche un `EmptyState` explicite.
  `MediaFrame` sans image affiche le symbole AFA, jamais une photo générique.
- **Zones tactiles ≥ 48 px** (boutons, champs, pastilles) ; liens de navigation ≥ 44 px.
- **Focus toujours visible** (contour vert forêt ; or récolte sur fond sombre).
- **Cartes cliquables** : un seul lien (le titre), étendu à toute la carte par `after:absolute after:inset-0`.
- **Cartes blanches** : fixent leur propre couleur de texte (`text-ink`), pour rester lisibles dans une section sombre.
- **Formulaires** : libellé visible, erreur sous le champ, une question par écran sur mobile, consentement jamais pré-coché.
- **Prix** : tendances en couleurs neutres (une hausse n'est ni « bonne » ni « mauvaise » selon le lecteur).

## Mouvement

- Apparition des sections au défilement (`.reveal`) en CSS pur (pas de JavaScript) ; trait d'encre qui se dessine ;
  survol des cartes ; squelettes de chargement.
- **Tout est désactivé** si l'utilisateur a demandé à réduire les animations.
- Pas de carrousel automatique, pas de vidéo en lecture automatique. Compteurs animés seulement pour des chiffres vérifiés.

## Responsive

| Point        | Cible             | Règle                                                      |
| ------------ | ----------------- | ---------------------------------------------------------- |
| base 360 px  | petits téléphones | 1 colonne, marges 16 px                                    |
| 390 px       | référence         | toute vérification visuelle se fait ici                    |
| `md` 768 px  | tablette          | 2 colonnes, chaîne de valeur horizontale, tableau des prix |
| `lg` 1024 px | ordinateur        | navigation complète, barre basse masquée, 3 colonnes       |
| 1200 px      | grand écran       | largeur de contenu plafonnée (`Container`)                 |

Mobile : barre de navigation basse (`MobileTabBar`) ; la page réserve l'espace avec
`pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0`. Menu plein écran ; fenêtres en panneau bas.

Budget : photo d'accueil ≤ 120 Ko sur mobile ; carte interactive chargée à l'usage (phase 4).

## Images

Chaque image publiée doit avoir : texte alternatif, crédit, et **droit à l'image obtenu** (champ obligatoire
de la future table `media`, phase 3). Optimisation automatique par `next/image`.
