# Design system — ONG AFA

Direction **« Terre et trait » v2** (refonte du 2026-11-28, maquettes haute fidélité de l'ONG) :
chaque section est une feuille arrondie (28 px) posée dans un cadre de 16 px sur un fond encre. Titres géants
à l'encre (Shrikhand), interface en Archivo, notes au bic sur papier ligné, cartes « autocollant » à ombre dure,
vraies photos du terrain. Les données restent datées et sourcées.

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
| `accent-deep`  | `#c26418` | Grands numéros orange sur fond clair (≥ 36 px)         | ≥ 3,3:1 sur blanc, crème, sable  |
| `night`        | `#141a10` | Fond de la carte immersive                             | —                                |
| `pen`          | `#1f3f9e` | Écriture au bic (Reenie Beanie)                        | ≥ 3,3:1 sur orange, 8:1 papier   |
| `paper`        | `#fbf7ee` | Papier ligné                                           | —                                |
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

- **Archivo** (400 à 900) : interface et texte (`font-sans`, `font-display`).
- **Shrikhand** (`font-ink`) : titres géants, toujours avec la classe `.ink-title` (filtre « encre » `#afa-goo`,
  remplacé par `#afa-goo-sm` sous 768 px, sinon les lettres sont rongées). Jamais de fondu d'opacité sur ces titres.
- **Reenie Beanie** (`.hand`) : notes manuscrites, en `pen` sur papier ou en menthe / orange sur fond sombre.
- Polices chargées par `src/app/fonts.ts`, auto-hébergées au build.
- Surtitres `.eyebrow` (13 px, 700, `.12em`, majuscules) : brique `accent-text` sur clair, menthe sur sombre, encre sur orange.
- Titres de section `.h-section` : 800, `clamp(34px, 4.4vw, 68px)`, interligne 0,98.

## Signature visuelle

- **Panneaux** (`Panel`, `HeroPanel`) : tons `sand`, `cream`, `forest`, `orange`, `green`, `night`.
- **Cartes autocollant** (`.sticker`) : bordure encre 1,5 px, rayon 22 px, ombre `0 6px 0` encre.
  Ajouter `.afa-card` pour le zoom, le reflet et l'inclinaison au survol.
- **Papier au bic** (`Notebook`), **pilules** (`PillLink`, `AnchorPills`), **bandeau final** (`CtaBand`).
- **Chaîne de valeur** (`ValueChain variant="dark"`) : verticale jusqu'à 1280 px, horizontale au-delà.
- **Icônes dessinées** (`AfaIcon`, `AfaIconDark`) : grille 48, trait encre 2,2, un aplat de la palette.

## Composants (`src/components/`)

| Dossier    | Composants                                                                                                                                                                                                                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/`      | `Button` (primary, accent, secondary, ghost, danger, on-dark ; `href` = lien), `Badge` (+ `VerifiedBadge`, `ExternalSourceBadge`), `Alert`, `Toast`, `Modal` (dialog natif, panneau bas sur mobile), `Skeleton`/`CardSkeleton`, `EmptyState`, `Spinner`, `Avatar`, `MediaFrame`, `Breadcrumb`, `Pagination`, `FilterChips` |
| `forms/`   | `Field` (libellé, aide, erreur reliés), `Input`, `Textarea`, `Select`, `Checkbox`, `ChoiceChips`, `Stepper`, `ConsentCheckbox`, `NewsletterForm`                                                                                                                                                                           |
| `content/` | `ArticleCard`, `EventCard`, `OpportunityCard`, `ResourceCard`, `DiscussionCard`, `ProducerCard`, `TestimonialQuote`, `PriceTable`, `DerivativeCard`, `KeyFigure`, `DataStamp`                                                                                                                                              |
| `map/`     | `StatusPill`/`StatusShape`/`MapLegend` (implantée ● / en cours ◐ / bientôt ◌), `TerritoryPanel`                                                                                                                                                                                                                            |
| `brand/`   | `InkUnderline`, `InkMark`, `ValueChain`                                                                                                                                                                                                                                                                                    |
| `layout/`  | `SiteHeader`, `MobileTabBar`, `SiteFooter`, `Section`, `Container`, `SectionHeading`                                                                                                                                                                                                                                       |

Refonte v2 : `afa/` (`Panel`, `SectionHead`, `PillLink`, `AnchorPills`, `CtaBand`, `Crumbs`, `Notebook`, `Declared`,
`AfaIcon`, `InkFilter`, `AfaChrome`), `home/HeroJeSuisAfa`, `layout/HeroPanel`, `layout/SiteMenu`,
`layout/VivrierHero`, `map/AfaMap`, `join/ProfilePicker`, `search/` (`SearchPalette`, `SearchButton`, `NewsBadge`),
`afa/dataviz` (`DeploymentBar`, `VeillePulse`, `UsesRing`). Photos de l'ONG dans
`public/photos/` (WebP, variante 560 px pour le mobile).

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

- Hero « Je suis AFA » (`HeroJeSuisAfa`) : photo fixe ; le mot après « Je suis » change toutes les 2,4 s (fonte d'encre,
  lettres qui montent), avec une étiquette de contexte ; bouton pause.
- `AfaChrome` + `useAfaFx` : barre flottante (ordinateur), progression, retour en haut, apparitions en cascade,
  icônes qui se dessinent, compteur « 4 000 ha » (`data-count`), cartes inclinables, pilules magnétiques, pollen.
- Carte nationale (`AfaMap`, SVG 2,5D) : inclinaison qui suit la souris, régions qui se soulèvent au survol, zoom doux,
  glisser une fois zoomé ; tracés chargés à l'approche. Pas de radar ni d'éclairage.
- **Animations complètes pour tous** (décision T45), y compris si le système demande de réduire les animations.

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
