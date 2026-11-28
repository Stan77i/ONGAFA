# Textes du site ONG AFA

Ce fichier contient **tous les textes visibles du site**, page par page, dans l'ordre où on les lit.
Sous chaque bloc, une ligne **📁 Où modifier** indique le fichier source (et, quand c'est utile, le nom
de la liste dans ce fichier).

Pour retoucher la rédaction : modifiez le texte ici, renvoyez-moi le fichier, et je reporte les
changements dans le code. Vous pouvez aussi modifier directement le fichier indiqué.

> **Règle à garder en tête** : aucun chiffre, prix, témoignage, partenaire ou réalisation ne doit être
> inventé. Les chiffres viennent du **bilan déclaré par l'ONG** (« Bilan déclaré depuis 2016 · Source :
> ONG AFA »). Toute nouvelle donnée doit avoir sa source et sa date.

Légende :

- _Sur-titre_ : petit texte en capitales au-dessus d'un titre.
- _Fil_ : étiquette reliée par un fil animé à un point « + » posé sur une photo. Au survol, on voit
  le titre ; au clic, le détail apparaît.
- _Carnet_ : petite note manuscrite posée sur une photo.

---

## 0. Identité (utilisée partout)

| Élément          | Texte                                             |
| ---------------- | ------------------------------------------------- |
| Nom officiel     | Action des Femmes d'Afrique pour le Développement |
| Nom court        | ONG AFA                                           |
| Devise           | Valoriser la terre pour nourrir la Nation         |
| Reconnaissance   | Reconnue sous le n° 418 MEMIS/DGAT/DAG/SDVA       |
| Date de création | 3 juin 2016                                       |
| Présidente       | L'Honorable N'ZI N'DA AFFOUÉ Éliane               |

📁 Où modifier : `src/config/site.ts` (nom, devise, numéro, date) et `src/content/afa.ts` (`president`).

### Le bilan déclaré (repris sur l'accueil, L'ONG, Manioc et dans les fils)

| Chiffre          | Libellé                                                                          |
| ---------------- | -------------------------------------------------------------------------------- |
| 4 000 ha         | de plantations de manioc réalisées                                               |
| Une demi-dizaine | d'unités de transformation du manioc construites                                 |
| Une dizaine      | de sous-préfectures du N'Zi où des coopératives sont structurées et accompagnées |

Mention : **Bilan déclaré depuis 2016 · Source : ONG AFA**

📁 Où modifier : `src/content/afa.ts` → `results`. Un seul endroit : la modification se répercute partout.

---

## 1. En-tête et menu (toutes les pages)

**Barre du haut** : L'ONG · Nos actions · Manioc · Veille · Prix · Carte · bouton **Rejoindre AFA**
Icônes : loupe (recherche), cloche (nouveautés de la veille), soleil/lune (mode jour/nuit), Menu.

**Menu plein écran** : Accueil · L'ONG AFA · Nos actions · Espace manioc · Veille du vivrier · Prix du
vivrier · Ressources · Carte nationale
Champ de recherche du menu : « Rechercher : manioc, attiéké, Nawa, prix… »

📁 Où modifier : `src/config/navigation.ts` (`mainNav`, `menuNav`, `mobileTabs`) ·
`src/components/layout/SiteMenu.tsx` (phrase de recherche).

### Recherche (loupe, ou touches `/` et `Ctrl+K`)

- Libellé : « Rechercher sur le site »
- Zone de saisie : « Manioc, attiéké, Nawa, prix, veille… »
- Sans saisie : « Accès rapide »
- Aucun résultat : « Essayez un autre mot : manioc, attiéké, Nawa, prix… »
- Pendant le chargement : « Chargement… »
- Aide en bas : « ↑ ↓ naviguer » · « Échap fermer » · « Veille : liens vers la source »

Descriptions courtes des pages dans les résultats :

| Page              | Description dans la recherche                                        |
| ----------------- | -------------------------------------------------------------------- |
| Accueil           | Je suis AFA, devise, bilan, carte                                    |
| L'ONG AFA         | Histoire, objet, réalisations, perspectives, gouvernance, présidente |
| Nos actions       | Domaines d'intervention                                              |
| Espace manioc     | Chaîne de valeur, variétés, plats, dérivés                           |
| Veille du vivrier | Actualités agricoles datées et sourcées                              |
| Prix du vivrier   | Prix des marchés, datés et vérifiés                                  |
| Ressources        | Guides, fiches techniques, études                                    |
| Carte nationale   | Implantations d'AFA en Côte d'Ivoire                                 |
| Rejoindre AFA     | Productrices, coopératives, commerçantes, partenaires                |

📁 Où modifier : `src/components/search/SearchPalette.tsx` · `src/lib/search/build.ts` (`pageHints`).

### Cloche des nouveautés

- « Nouveautés de la veille » (ou « Nouveautés : 3 nouvelles informations »)
- Si rien : « Aucune information publiée pour le moment. »

📁 Où modifier : `src/components/search/NewsBell.tsx`.

---

## 2. Accueil `/`

### 2.1 Grand écran d'ouverture (« Je suis AFA »)

**Phrase qui change** : « Je suis … » suivi d'un mot qui défile toutes les 2,4 secondes :

| Mot              | Petite étiquette affichée en haut |
| ---------------- | --------------------------------- |
| AFA              | ONG ivoirienne · depuis 2016      |
| le N'Zi          | Région · AFA implantée            |
| la Nawa          | Région · prochaine étape          |
| le Bélier        | Région · déploiement progressif   |
| le Gbêkê         | Région · déploiement progressif   |
| l'Iffou          | Région · déploiement progressif   |
| la Marahoué      | Région · déploiement progressif   |
| le Poro          | Région · déploiement progressif   |
| le Tonkpi        | Région · déploiement progressif   |
| la Côte d'Ivoire | Tout le pays                      |
| ivoirienne       | Moi aussi, je suis AFA            |
| ivoirien         | Moi aussi, je suis AFA            |

**Trois photos de femmes** se succèdent (une tous les 4 mots). Sur chacune, un papier collé et des fils :

**Photo 1** (productrice, casquette « Je suis AFA », houe sur l'épaule). Papier : **« Je suis AFA »**

| Fil (titre)      | Détail                                                                |
| ---------------- | --------------------------------------------------------------------- |
| Femmes & revenus | Insertion économique des femmes et activités génératrices de revenus. |
| 4 000 ha         | de plantations de manioc réalisées.                                   |

**Photo 2** (productrices tenant maïs et manioc). Papier : **« Nous sommes AFA »**

| Fil (titre)      | Détail                                                                    |
| ---------------- | ------------------------------------------------------------------------- |
| Coopératives     | Structurées et accompagnées dans une dizaine de sous-préfectures du N'Zi. |
| Maïs             | Seconde culture de l'objet d'AFA, de la production aux produits finis.    |
| Une demi-dizaine | d'unités de transformation du manioc construites.                         |

**Photo 3** (productrice souriante, casquette « Je suis AFA »). Papier : **« Je suis AFA »**

| Fil (titre)                                     | Détail                                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| Commercialisation _(étiquette « Perspective »)_ | Financer la commercialisation et la bancarisation des commerçantes et des productrices. |
| Autonomisation                                  | Des activités génératrices de revenus pour les personnes défavorisées.                  |

Étiquette par défaut des fils : « Ce que fait AFA ».

**Accroche** : « Des femmes qui font pousser l'avenir »
**Bas de l'écran** : « Défiler pour explorer » · « ONG ivoirienne reconnue depuis 2016, présidée par
l'Honorable N'ZI N'DA AFFOUÉ Éliane. » · bouton **Rejoindre AFA**
**Titre lu par les moteurs et les lecteurs d'écran** : « Je suis AFA, je suis la Côte d'Ivoire : des
femmes qui font pousser l'avenir. »

📁 Où modifier : `src/components/home/HeroJeSuisAfa.tsx` → `WORDS` (mots et étiquettes), `SCENES`
(photos, papiers, fils).

### 2.2 Présentation et devise

> Depuis le 3 juin 2016, l'ONG Action des Femmes d'Afrique pour le Développement structure la filière
> manioc, de la plantation à la transformation.

Boutons : **Lire notre histoire** · **Rejoindre le réseau**

_Sur-titre_ : Notre devise
**Valoriser la terre pour nourrir la Nation.**
Région du N'Zi · Côte d'Ivoire

Puis les trois chiffres du bilan (voir § 0).

📁 Où modifier : `src/app/(site)/page.tsx`.

### 2.3 « 03 — Ce que fait AFA »

**Le manioc d'abord. Et tout ce qui permet d'en vivre.** · lien « Toutes nos actions »

Grande carte : _Axe prioritaire_ — **Filière manioc** — Production, transformation et valorisation du
manioc sur toute la chaîne de valeur : l'axe prioritaire d'AFA. → **Explorer l'espace manioc**
Étapes : Production · Collecte · Transformation · Valorisation · Commercialisation · Débouchés

Les autres domaines (mêmes textes que la page Nos actions, § 4) : Maïs · Transformation
agroalimentaire · Femmes et revenus · Jeunes et formation · Coopératives · Commercialisation et
logistique · Développement local.

📁 Où modifier : titres dans `src/app/(site)/page.tsx` ; textes des domaines dans `src/content/afa.ts` → `domains`.

### 2.4 « 04 — Filière manioc »

**Du champ aux produits finis, un seul fil.**
AFA veut agir sur toute la chaîne de valeur du manioc, pour que la valeur créée profite d'abord aux
productrices et aux producteurs.

Chaîne : 01 Production · 02 Collecte · 03 Transformation · 04 Valorisation · 05 Commercialisation ·
06 Débouchés · 07 Autonomisation des producteurs

Cartes des dérivés :

- 12 dérivés — **Alimentation** — Attiéké · Placali · Gari · Tapioca…
- 7 dérivés — **Pharmacie** — Excipients · Liants · Supports pour gélules…
- 10 dérivés — **Cosmétique** — Poudres matifiantes · Savons · Crèmes…
- 3 usages — **Toute la plante** — Feuilles · Épluchures · Tiges (boutures)

📁 Où modifier : `src/app/(site)/page.tsx` (`derivativePreview`) ; la chaîne et les dérivés dans
`src/content/afa.ts` → `cassava`.

### 2.5 « 05 — Déploiement national »

**Du N'Zi à toute la Côte d'Ivoire.**
Après sa région d'origine, AFA prévoit de se déployer dans la Nawa, puis progressivement dans les autres
régions du pays.
_Phrase forte_ : « On ne regarde pas la carte. On entre dans le territoire. » → **Entrer dans le territoire**
Barre : Déploiement national · 1 / 33 régions · Implantée (1) · Prochaine étape (1) · À venir (31)

📁 Où modifier : `src/app/(site)/page.tsx` ; barre : `src/components/afa/dataviz.tsx`.

### 2.6 Veille du vivrier (aperçu)

**Les dernières informations agricoles.**
Collectées toutes les deux heures auprès de l'AIP, du CNRA, de l'ANADER et de la presse ivoirienne.
Chaque information renvoie vers sa source. → **Toute la veille**

Les 4 dernières informations s'affichent automatiquement (titre, court extrait, date, source).
_Ces textes ne sont pas écrits par AFA_ : ils viennent des sources, avec un lien vers l'article.

📁 Où modifier : `src/app/(site)/page.tsx` (titre et phrase). Les articles : base de données (veille automatique, voir `docs/VEILLE.md`).

### 2.7 « 06 — Le réseau AFA »

**Et vous ?**
Productrices, producteurs, coopératives, commerçantes : AFA rassemble les acteurs du manioc et du
vivrier pour créer des débouchés, des formations et des opportunités de financement.
_Manuscrit_ : « Moi aussi, je suis AFA. »
Boutons : Je suis productrice ou producteur · Nous sommes une coopérative · Je suis commerçante · Je veux soutenir AFA

📁 Où modifier : `src/app/(site)/page.tsx` → `joinProfiles`.

---

## 3. L'ONG AFA `/a-propos`

### 3.1 Ouverture

Fil d'Ariane : Accueil / L'ONG AFA
_Sur-titre_ : L'ONG AFA
**Action des Femmes d'Afrique pour le Développement**
Une organisation non gouvernementale ivoirienne qui œuvre pour l'autonomisation économique et sociale
des femmes et des communautés rurales, avec la filière manioc comme axe prioritaire.
Raccourcis : Histoire · Notre objet · Réalisations · Perspectives · Gouvernance

**Fils sur la photo** :

| Étiquette | Titre            | Détail                                                                                          |
| --------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| Statut    | ONG reconnue     | Enregistrée sous le n° 418 MEMIS/DGAT/DAG/SDVA.                                                 |
| Histoire  | Née dans le N'Zi | Créée le 3 juin 2016, AFA y a bâti pendant une dizaine d'années un modèle centré sur le manioc. |
| Bilan     | Une dizaine      | de sous-préfectures du N'Zi où des coopératives sont structurées et accompagnées. _(+ source)_  |

_Carnet_ : « Née dans le N'Zi, 2016 »

📁 Où modifier : `src/app/(site)/a-propos/page.tsx` → `heroSpots` et le bloc d'ouverture.

### 3.2 « 01 — Notre histoire »

**Née dans le N'Zi en 2016.**

L'ONG Action des Femmes d'Afrique pour le Développement (ONG AFA) a été créée le 3 juin 2016 et reconnue
sous le n° 418 MEMIS/DGAT/DAG/SDVA.

Elle est née dans la région du N'Zi, où elle a développé pendant une dizaine d'années un modèle centré
sur le manioc : plantations, unités de transformation et accompagnement des coopératives.

Forte de ces résultats, AFA ambitionne aujourd'hui de devenir un acteur de référence de la filière
manioc en Côte d'Ivoire et de se déployer sur l'ensemble du territoire national.

Frise :

| Repère | Titre                             | Texte                                            |
| ------ | --------------------------------- | ------------------------------------------------ |
| 2016   | Création, le 3 juin               | Dans la région du N'Zi, zone de naissance d'AFA. |
| —      | Une dizaine d'années dans le N'Zi | Plantations, transformation, coopératives.       |
| Nawa   | Prochaine étape : la Nawa         | Chef-lieu : Soubré.                              |
| CI     | Puis toute la Côte d'Ivoire       | _(manuscrit)_ pas à pas                          |

📁 Où modifier : `src/app/(site)/a-propos/page.tsx`.

### 3.3 « 02 — Notre objet »

**Ce pour quoi AFA a été créée.** — Extrait de l'objet de l'association.

1. Participer à la conception et à la mise en œuvre des politiques de développement local : agriculture
   — en particulier la production du manioc et du maïs et leur transformation en produits finis —,
   industrie alimentaire, formation et éducation, transport, équipements, infrastructures urbaines et commerce.
2. Soutenir les initiatives locales par le transfert de technologies, la recherche et un fonds d'aide au financement.
3. Faciliter la signature de conventions ou de concessions avec d'autres ONG et partenaires.
4. Œuvrer à l'insertion professionnelle et économique des jeunes et des femmes.
5. Créer des activités génératrices de revenus en faveur des personnes défavorisées.

📁 Où modifier : `src/content/afa.ts` → `purpose`. _(Texte statutaire : à ne changer qu'avec l'ONG.)_

### 3.4 « 03 — Nos réalisations »

**Le bilan d'AFA dans le N'Zi.**
Résultats obtenus après une dizaine d'années d'activité, tels que déclarés par l'ONG.
Puis les trois chiffres du bilan (§ 0). Le « 4 000 ha » s'affiche en comptant de 0 à 4 000.

📁 Où modifier : `src/app/(site)/a-propos/page.tsx` (titres) · `src/content/afa.ts` → `results`.

### 3.5 « 04 — Nos perspectives »

**Structurer toute la filière manioc.**
Après le N'Zi, AFA prévoit de se déployer dans la Nawa puis progressivement dans les autres régions, en
travaillant sur toute la chaîne de valeur avec les structures d'encadrement du secteur.

**Pour y parvenir, AFA prévoit de :**

- Soutenir la création d'une structure commerciale d'achat et de distribution de produits agricoles.
- Mobiliser des financements pour la commercialisation et la bancarisation des commerçantes et des productrices.
- Accompagner l'installation de centrales d'achat et de commercialisation du manioc et de ses dérivés, en Côte d'Ivoire et à l'étranger.
- Développer une chaîne logistique pour transporter, conserver et transformer le manioc et ses dérivés.

**À terme, AFA vise à :**

- Renforcer son leadership dans la filière manioc.
- Faire de la filière manioc une filière organisée et forte, à l'image des filières coton, anacarde et karité.
- Lutter contre la pauvreté et la cherté de la vie des populations rurales et urbaines.
- Contribuer à la lutte contre l'insécurité alimentaire.
- Approvisionner les marchés régional et international en manioc et produits dérivés.
- Promouvoir les variétés de manioc de Côte d'Ivoire, leur transformation et leur consommation.
- Renforcer les parcours de formation des jeunes dans la filière manioc.

📁 Où modifier : `src/content/afa.ts` → `perspectives` et `ambitions`.

### 3.6 « 05 — Gouvernance »

**La présidence de l'ONG.**
Présidente de l'ONG AFA — **L'Honorable N'ZI N'DA AFFOUÉ Éliane**

📁 Où modifier : `src/content/afa.ts` → `president`.

### 3.7 Appel final

**Vous souhaitez travailler avec AFA ?** → **Rejoindre le réseau**

📁 Où modifier : `src/app/(site)/a-propos/page.tsx`.

---

## 4. Nos actions `/actions`

### 4.1 Ouverture

_Sur-titre_ : Nos actions
**Nos domaines d'intervention**
Le manioc est l'axe prioritaire d'AFA. Autour de lui, l'ONG agit sur la production, la transformation,
la formation, l'organisation des producteurs et l'accès aux marchés.

📁 Où modifier : `src/app/(site)/actions/page.tsx`.

### 4.2 Les 8 domaines

| N°  | Domaine                         | Texte                                                                                                                                        |
| --- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Filière manioc                  | Production, transformation et valorisation du manioc sur toute la chaîne de valeur : l'axe prioritaire d'AFA. → Explorer l'espace manioc     |
| 02  | Maïs                            | Seconde culture inscrite dans l'objet de l'association, de la production à la transformation en produits finis.                              |
| 03  | Transformation agroalimentaire  | Unités de transformation et industrie alimentaire pour transformer les récoltes en produits finis.                                           |
| 04  | Femmes et revenus               | Insertion économique des femmes, activités génératrices de revenus, commercialisation et bancarisation des commerçantes et des productrices. |
| 05  | Jeunes et formation             | Insertion professionnelle des jeunes et formation aux métiers de la filière manioc.                                                          |
| 06  | Coopératives                    | Structuration et accompagnement des coopératives de producteurs, à commencer par la région du N'Zi.                                          |
| 07  | Commercialisation et logistique | Achat, distribution, centrales de commercialisation et chaîne logistique pour transporter et conserver les productions.                      |
| 08  | Développement local             | Transfert de technologies, recherche, financement des initiatives locales et partenariats avec les acteurs du territoire.                    |

📁 Où modifier : `src/content/afa.ts` → `domains` (également repris sur l'accueil).

### 4.3 Prochaines étapes

_Sur-titre_ : Prochaines étapes
**Ce qu'AFA prépare.**
Les chantiers annoncés par l'ONG pour accompagner son déploiement national.
Puis les 4 points « Pour y parvenir » de la page L'ONG (§ 3.5).

📁 Où modifier : `src/app/(site)/actions/page.tsx` (titres) · `src/content/afa.ts` → `perspectives`.

### 4.4 Appel final

**Agir avec AFA.** — _Manuscrit_ : « Et vous, que cultivez-vous ? » → **Rejoindre le réseau**

📁 Où modifier : `src/app/(site)/actions/page.tsx`.

---

## 5. Espace manioc `/manioc`

### 5.1 Ouverture

_Sur-titre_ : Espace manioc
**Le manioc en Côte d'Ivoire**
Culture vivrière majeure du pays et axe prioritaire d'AFA. De la variété plantée aux dizaines de produits
qui en sont tirés, tout ce qu'il faut savoir sur le manioc.
Raccourcis : Chaîne de valeur · Doux ou amer · Variétés · Plats · Dérivés

**Fils sur la photo** :

| Étiquette            | Titre         | Détail                                                                                                                          |
| -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Culture              | Le maïs aussi | Seconde culture de l'objet d'AFA, de la production à la transformation en produits finis.                                       |
| Transformation       | 32 usages     | Alimentation, pharmacie, cosmétique : chaque partie de la plante peut être valorisée.                                           |
| Dans l'assiette      | L'attiéké     | Semoule de manioc fermentée et cuite à la vapeur : le produit transformé le plus consommé et commercialisé du pays.             |
| Sécurité alimentaire | Manioc amer   | Jamais consommé sans traitement : râpage, fermentation, pressage, séchage ou cuisson prolongée éliminent ses composés toxiques. |

_Carnet_ : « attiéké, placali, gari… »

📁 Où modifier : `src/app/(site)/manioc/page.tsx` → `heroSpots`. Le « 32 » se calcule tout seul à partir des dérivés.

### 5.2 « 01 — Chaîne de valeur »

**Du champ à l'autonomie des producteurs.**
AFA veut agir à chaque étape, pour que la valeur créée par le manioc profite d'abord à celles et ceux qui le cultivent.
Chaîne en 7 étapes (comme § 2.4) puis les trois chiffres du bilan.

### 5.3 « 02 — Bien le connaître »

**Doux ou amer.**
En Côte d'Ivoire, le manioc se répartit en deux grandes catégories, auxquelles s'ajoutent des variétés
locales traditionnelles et des variétés améliorées diffusées par la recherche agronomique.

- **Manioc doux** — Moins riche en composés cyanogènes. Il peut être cuisiné et consommé rapidement après une simple cuisson.
- **Manioc amer** — Plus riche en glucosides cyanogènes, il exige un traitement rigoureux — râpage,
  fermentation, pressage, séchage ou cuisson prolongée — pour éliminer sa toxicité. C'est la forme la
  plus utilisée pour les produits transformés de longue conservation.

_Encadré_ : **Sécurité alimentaire.** Le manioc amer ne doit jamais être consommé sans traitement :
râpage, fermentation, pressage, séchage ou cuisson prolongée éliminent ses composés toxiques.

### 5.4 « 03 — Variétés »

**Les variétés cultivées en Côte d'Ivoire.**
Rendements volontairement absents tant qu'ils ne sont pas sourcés (CNRA).

| N°  | Variété             | Texte                                                                                                |
| --- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| 01  | Yavo                | Variété améliorée très populaire, cycle d'environ 12 mois. Très appréciée pour le foutou.            |
| 02  | Bocou               | Variété bien implantée localement, appréciée pour sa productivité.                                   |
| 03  | Olekanga            | Variété très répandue dans les zones de production ivoiriennes.                                      |
| 04  | Bonoua (Bonoua Kgo) | Variété locale traditionnelle, souvent utilisée comme référence dans les zones de production du sud. |
| 05  | Gbazékouté          | Cultivar local.                                                                                      |
| 06  | Kombo 2             | Cultivar cité parmi les variétés locales et améliorées.                                              |
| 07  | TMS 30-555          | Variété améliorée issue de la recherche agronomique.                                                 |

### 5.5 « 04 — Dans l'assiette »

**Bon appétit.** — Les grands plats à base de manioc.

- **Attiéké** — Semoule de manioc fermentée et cuite à la vapeur : le produit transformé le plus consommé et commercialisé du pays.
- **Foutou de manioc** — Tubercules épluchés, bouillis puis pilés, parfois avec de la banane plantain ou de l'igname.
- **Placali** — Pâte de manioc fermentée et cuite, souple et élastique, servie avec une sauce graine ou une sauce kopé.
- **Tapioca** — Dérivé de la fécule, utilisé en bouillies ou en pâtisserie.

### 5.6 « 05 — Transformation »

**Une plante, des dizaines de produits.**
Le manioc ne nourrit pas seulement : son amidon entre dans des médicaments et des cosmétiques, et chaque
partie de la plante peut être valorisée.
Anneau : **32 usages** — Alimentation 12 · Pharmacie 7 · Cosmétique 10 · Toute la plante 3

**Alimentation (12)** : Attiéké · Placali · Gari · Tapioca · Farine et semoule de manioc · Cossettes
séchées · Pain, biscuits, gâteaux et pâtisseries · Amidon alimentaire et fécule · Sirops de glucose et
maltodextrine · Feuilles de manioc préparées ou séchées · Boissons fermentées · Éthanol (selon les procédés)

**Pharmacie (7)** — Amidon de manioc purifié ou modifié : Excipients pour comprimés · Agents liants et
désintégrants · Agents de remplissage · Supports pour gélules · Gels et matrices pharmaceutiques · Films
et matériaux biodégradables · Supports expérimentaux de libération de principes actifs

**Cosmétique (10)** — Amidon de manioc absorbant, texturant ou filmogène : Poudres matifiantes pour le
visage · Masques cosmétiques · Poudres corporelles · Crèmes et laits corporels · Savons solides et
liquides · Déodorants · Shampoings et après-shampoings · Masques et crèmes capillaires · Gels coiffants ·
Produits de soins corporels

**Toute la plante (3)** : Feuilles : produits alimentaires et poudres nutritionnelles · Épluchures et
résidus : alimentation animale · Tiges : production de boutures

### 5.7 Appel final

**Vous produisez ou transformez du manioc ?** — **Rejoignez le réseau AFA.** → **Rejoindre AFA**

📁 Où modifier (§ 5.2 à 5.7) : titres et phrases dans `src/app/(site)/manioc/page.tsx` ; catégories,
variétés, plats et dérivés dans `src/content/afa.ts` → `cassava`.

---

## 6. Veille, Prix, Ressources (les trois onglets du vivrier)

**Onglets communs** : Veille du vivrier · Prix du vivrier · Ressources
**Dessin de journal** : « VEILLE DU VIVRIER » · _manuscrit_ « daté & sourcé »

📁 Où modifier : `src/components/layout/VivrierHero.tsx`.

### 6.1 Veille du vivrier `/veille`

_Sur-titre_ : Veille du vivrier
**Le vivrier, en vrai.**
L'actualité agricole de Côte d'Ivoire et les prix des marchés, collectés auprès de sources identifiées.
Chaque information est datée et renvoie vers son origine.

**Le pouls de la veille** : « 28 informations en 8 semaines » · « Dernière information : 26 novembre 2026 »
(graphique par semaine, calculé automatiquement).

_Sur-titre_ : Information agricole — **La veille du vivrier.**
Filtres cultures : Toutes les cultures · Manioc · Maïs · Igname · Banane plantain · Riz · Légumes
Filtres thèmes : Tous les thèmes · Actualités agricoles · Recherche et innovation · Encadrement et terrain · Marchés et prix · Opportunités
Compteur : « 31 informations » · bouton « Voir plus d'informations »

**Transparence — nos sources** : AIP — Agriculture · ANADER · CNRA · Linfodrome
« Les sujets issus de la presse généraliste sont relus avant publication. »

**Droits des auteurs.** AFA ne reproduit jamais les articles : seuls le titre, un court extrait et le
lien vers la source sont affichés. Pour lire l'article complet, rendez-vous sur le site de son auteur.

📁 Où modifier : `src/app/(site)/veille/page.tsx` (ouverture, sources, droits) ·
`src/components/content/NewsExplorer.tsx` (titre, filtres, message quand c'est vide) ·
`src/components/afa/dataviz.tsx` (pouls).

### 6.2 Prix du vivrier `/prix`

_Sur-titre_ : Prix du vivrier
**Prix du vivrier.**
Suivre les prix du manioc, de l'attiéké et des autres produits vivriers, marché par marché, pour mieux
vendre et mieux acheter.

_Sur-titre_ : Marchés — **Les prix relevés.**
Chaque prix est daté, sourcé et vérifié par AFA avant publication.
Tableau : Produit · Marché · Unité · Prix · Relevé le · Source

**Message actuel (aucun prix publié)** : **Aucun prix vérifié publié pour le moment** — Les premiers
relevés seront publiés dès qu'ils auront été vérifiés. AFA ne publie jamais un prix sans date ni source.

Trois engagements :

- **Daté** — Chaque prix indique le jour du relevé. Un prix ancien n'est jamais présenté comme actuel.
- **Sourcé** — Chaque prix indique qui l'a relevé et où : marché, ville ou région.
- **Vérifié** — Un prix n'est publié qu'après vérification par une personne habilitée d'AFA.

📁 Où modifier : `src/app/(site)/prix/page.tsx` (`rules` pour les trois engagements).

### 6.3 Ressources `/ressources`

_Sur-titre_ : Ressources
**Ressources.**
Des documents utiles pour produire, transformer et vendre : guides, fiches techniques, études. Chacun avec sa source.

_Sur-titre_ : Bibliothèque — **La bibliothèque se constitue.**
Guides pratiques, fiches techniques et études pour produire, transformer et vendre seront publiés ici,
chacun avec sa source. → **Découvrir l'espace manioc**

📁 Où modifier : `src/app/(site)/ressources/page.tsx`.

---

## 7. Carte nationale `/carte`

### 7.1 Ouverture

_Sur-titre_ : AFA Côte d'Ivoire · Réseau national
**Le territoire AFA**
On ne regarde pas la carte. On entre dans le territoire.

Légende : AFA implantée · AFA bientôt · Déploiement progressif
Bandeau : « 1 région implantée · 1 prochaine étape · 33 régions »
Boutons : + · − · Vue nationale
Crédit : Fond : geoBoundaries (gbOpen CIV ADM2), Banque mondiale, licence CC BY 4.0

### 7.2 Fiches qui s'ouvrent au clic sur une région

| Région            | Sur-titre              | Texte                                                                                                                                       | Bouton          |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Région du N'Zi    | AFA — Implantée        | Zone de naissance d'AFA. Plantations de manioc, unités de transformation et coopératives accompagnées dans une dizaine de sous-préfectures. | Voir le bilan   |
| Région de la Nawa | AFA — Prochaine étape  | Chef-lieu : Soubré. Première étape du déploiement national annoncé par AFA. _(note : « Vous le saurez ici. »)_                              | Voir les étapes |
| Toutes les autres | Déploiement progressif | Déploiement progressif sur l'ensemble du territoire national.                                                                               | Faire venir AFA |

📁 Où modifier : `src/components/map/AfaMap.tsx` → `info()` et `statusLabel`.

### 7.3 Chronologie

_Sur-titre_ : Chronologie — **Les étapes du déploiement.**
La carte s'enrichira à chaque nouvelle implantation.

| Repère          | Titre                               | Texte                                                                                                              |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 3 juin 2016     | Création d'AFA dans le N'Zi         | Plantations de manioc, unités de transformation et coopératives accompagnées dans une dizaine de sous-préfectures. |
| Prochaine étape | Région de la Nawa                   | Chef-lieu : Soubré. Première étape du déploiement national annoncé par AFA.                                        |
| Ensuite         | Les autres régions de Côte d'Ivoire | Un déploiement progressif sur l'ensemble du territoire national.                                                   |

### 7.4 Appel final

**AFA dans ma région ?** — **Faisons-la pousser ensemble.** → **Rejoindre le réseau**

📁 Où modifier (§ 7.1, 7.3, 7.4) : `src/app/(site)/carte/page.tsx`.

---

## 8. Rejoindre AFA `/rejoindre-afa`

### 8.1 Ouverture

_Sur-titre_ : Rejoindre AFA
**Rejoindre AFA**
AFA rassemble tous les acteurs de la filière manioc et du vivrier, du champ jusqu'au marché.
_Manuscrit_ : « Moi aussi, je suis AFA. »

**Fils sur la photo** :

| Étiquette | Titre                     | Détail                                                                                                     |
| --------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Bientôt   | Inscription en ligne      | Environ deux minutes, depuis votre téléphone : l'inscription ouvre bientôt sur cette page.                 |
| Profil    | Productrice ou producteur | Manioc, maïs ou autres cultures vivrières : votre place est dans le réseau AFA.                            |
| Le réseau | 8 profils                 | Productrices, coopératives, commerçantes, transformatrices, acheteurs, transporteurs, jeunes, partenaires. |

_Encadré_ : **Bientôt** — Inscriptions en ligne bientôt ouvertes. L'inscription sera disponible
prochainement sur cette page : environ deux minutes, depuis votre téléphone.

📁 Où modifier : `src/app/(site)/rejoindre-afa/page.tsx` → `heroSpots` et l'encadré.

### 8.2 « 01 — Qui peut rejoindre le réseau » — **Vous êtes…**

| Profil                            | Texte                                                |
| --------------------------------- | ---------------------------------------------------- |
| Productrice ou producteur         | Manioc, maïs ou autres cultures vivrières.           |
| Coopérative                       | Groupement de producteurs ou de productrices.        |
| Commerçante                       | Commercialisation des produits vivriers et dérivés.  |
| Transformatrice ou transformateur | Attiéké, gari, placali, farine, amidon…              |
| Acheteur                          | Grossiste, centrale d'achat, entreprise.             |
| Transporteur                      | Collecte, transport et conservation.                 |
| Jeune                             | Formation et insertion dans la filière.              |
| Partenaire ou institution         | Organisation, collectivité, structure d'encadrement. |

Bandeau vert :

- Avant le choix : « Choisissez votre profil ci-dessus. L'inscription en ligne ouvre bientôt sur cette page. »
- Après le choix : « [Profil] : votre place est dans le réseau AFA. L'inscription en ligne ouvre bientôt sur cette page. »
- _Manuscrit_ : « à très vite ! »

📁 Où modifier : `src/components/join/ProfilePicker.tsx` → `profiles`.

### 8.3 Appel final

**En attendant, découvrez AFA.** → **Découvrir l'ONG AFA** · **Nos domaines d'action**

📁 Où modifier : `src/app/(site)/rejoindre-afa/page.tsx`.

---

## 9. Page introuvable (erreur 404)

_Sur-titre_ : Erreur 404
**Perdu ?**
Cette page n'existe pas : le lien est peut-être ancien ou la page a été déplacée. Retrouvez l'essentiel
depuis l'accueil.
_Carnet_ : « On retourne au champ ? » → **Retour à l'accueil**

📁 Où modifier : `src/app/not-found.tsx`.

---

## 10. Pied de page (toutes les pages)

**Action des Femmes d'Afrique pour le Développement**
Valoriser la terre pour nourrir la Nation
Reconnue sous le n° 418 MEMIS/DGAT/DAG/SDVA

| L'ONG AFA        | Filières          | Participer    |
| ---------------- | ----------------- | ------------- |
| Qui sommes-nous  | Espace manioc     | Rejoindre AFA |
| Nos réalisations | Dérivés du manioc |               |
| Gouvernance      | Veille du vivrier |               |
| Nos actions      | Prix du vivrier   |               |
| Carte nationale  | Ressources        |               |

© ONG AFA — Action des Femmes d'Afrique pour le Développement · Côte d'Ivoire

📁 Où modifier : `src/components/layout/SiteFooter.tsx` · liens : `src/config/navigation.ts` → `footerNav`.

---

## 11. Titres et descriptions pour Google (invisibles sur la page)

Ce sont les textes qui apparaissent dans les résultats de recherche et lors d'un partage WhatsApp ou Facebook.

| Page                 | Titre                      | Description                                                                                                                                                                                      |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accueil (par défaut) | ONG AFA                    | Action des Femmes d'Afrique pour le Développement (ONG AFA) : autonomisation des femmes rurales, filière manioc et vivrier en Côte d'Ivoire. Valoriser la terre pour nourrir la Nation.          |
| L'ONG                | L'ONG AFA                  | Action des Femmes d'Afrique pour le Développement : ONG ivoirienne créée en 2016, née dans la région du N'Zi, engagée pour l'autonomisation des femmes et la filière manioc.                     |
| Nos actions          | Nos actions                | Filière manioc, maïs, transformation agroalimentaire, femmes et revenus, jeunes et formation, coopératives, commercialisation et développement local : les domaines d'intervention de l'ONG AFA. |
| Manioc               | Le manioc en Côte d'Ivoire | Manioc doux et manioc amer, variétés cultivées en Côte d'Ivoire (Yavo, Bocou, Olekanga, Bonoua…), attiéké, placali, gari et dérivés alimentaires, pharmaceutiques et cosmétiques.                |
| Veille               | Veille du vivrier          | Actualités agricoles de Côte d'Ivoire sur le manioc, le maïs, le riz et le vivrier : informations datées et sourcées, issues de l'AIP, du CNRA, de l'ANADER et de la presse.                     |
| Prix                 | Prix du vivrier            | Prix des produits vivriers en Côte d'Ivoire (manioc, attiéké, maïs, igname…) : chaque prix est daté, sourcé et vérifié par AFA avant publication.                                                |
| Ressources           | Ressources                 | Guides, fiches techniques, études et formations sur le manioc et le vivrier en Côte d'Ivoire.                                                                                                    |
| Carte                | Carte nationale            | Où l'ONG AFA est-elle présente en Côte d'Ivoire ? Implantée dans la région du N'Zi, AFA prépare son déploiement dans la Nawa puis sur l'ensemble du territoire.                                  |
| Rejoindre            | Rejoindre AFA              | Productrices, producteurs, coopératives, commerçantes, transformateurs, acheteurs, jeunes, partenaires : rejoignez le réseau de l'ONG AFA.                                                       |
| 404                  | Page introuvable           | —                                                                                                                                                                                                |

📁 Où modifier : en haut de chaque fichier `page.tsx` (bloc `metadata`) ; par défaut : `src/app/layout.tsx`.

---

## 12. Ce qui manque pour une rédaction qui attire (à fournir par l'ONG)

Le site n'affiche que ce qui est vérifié. Ces éléments donneraient beaucoup plus de force à la
rédaction, mais **ne peuvent venir que de l'ONG** :

- **Témoignages réels** de productrices (prénom, village, une phrase, photo avec accord écrit).
- **Chiffres datés supplémentaires** : nombre de femmes accompagnées, de coopératives, de tonnes
  transformées, revenus générés (avec l'année et la source).
- **Partenaires officiels** (avec leur accord pour afficher leur nom ou logo).
- **Photos de terrain légendées** (lieu, date) : unités de transformation, plantations du N'Zi.
- **Mot de la présidente** : quelques lignes signées pour la page L'ONG.
- **Premiers prix relevés** sur un marché (produit, marché, unité, prix, date, qui a relevé).
- **Premiers documents** pour la bibliothèque (guides, fiches techniques, avec leur source).
- **Contact public** de l'ONG (adresse, téléphone ou email officiels) pour le pied de page.
- **Date et détail du lancement dans la Nawa** dès qu'ils sont connus.

---

## 13. Vérifications effectuées sur le site

Tests passés avant chaque envoi (dernière version : branche `feat/fils-photos`, PR n° 5) :

| Vérification                                                                                                                                                                        | Résultat                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `pnpm check` : types TypeScript, ESLint sans aucun avertissement, mise en forme Prettier, 30 tests automatiques (Vitest), recherche de clés secrètes, construction complète du site | ✅ Tout passe                                                                     |
| `pnpm test:db` : tests de sécurité de la base de données (accès, règles RLS) sur PostgreSQL local                                                                                   | ✅ Tout passe                                                                     |
| Accessibilité (axe-core) sur toutes les pages, en mode jour **et** nuit, à 1440 px et 390 px                                                                                        | ✅ 0 erreur                                                                       |
| Contrastes de couleurs (niveau AA) : chiffres orange passés en orange foncé `#c26418` pour être lisibles                                                                            | ✅ Corrigé                                                                        |
| Vitesse en conditions mobiles difficiles (4G simulée, processeur ralenti 4 fois) : affichage du contenu principal (LCP)                                                             | ✅ Entre 1,9 et 2,9 s                                                             |
| Stabilité de la mise en page (CLS) : rien ne saute pendant le chargement                                                                                                            | ✅ 0                                                                              |
| Écran d'ouverture : il ne bouge plus quand le mot change (testé sur les 12 mots et 4 tailles d'écran)                                                                               | ✅ Fixe                                                                           |
| Clavier seul : menu, recherche (`/`, `Ctrl+K`, flèches, Échap), carte (Tab, Entrée, Échap), fils des photos                                                                         | ✅ Utilisable                                                                     |
| Carte : survol, clic, zoom mesuré, glisser, Échap pour fermer, liste des régions pour lecteurs d'écran                                                                              | ✅ Fonctionne                                                                     |
| Recherche : trouve les pages, les régions, les plats, les dérivés et les informations de la veille                                                                                  | ✅ Fonctionne                                                                     |
| Mode jour/nuit : suit le réglage du téléphone ou de l'ordinateur, mémorise le choix, sans flash au chargement                                                                       | ✅ Fonctionne                                                                     |
| Affichage téléphone (390 px) : aucun débordement horizontal                                                                                                                         | ✅ Vérifié (la version mobile définitive viendra de votre maquette Claude Design) |
| Règle « rien d'inventé » : chaque chiffre affiché vient du bilan déclaré, avec la mention de la source                                                                              | ✅ Respectée                                                                      |

### Ce que vous pouvez mesurer ensuite

- **Visites par page** et **temps passé** (surtout sur Manioc et Veille) : installer un outil de mesure
  d'audience respectueux de la vie privée.
- **Clics sur « Rejoindre AFA »** et choix de profil : savoir qui veut rejoindre (producteurs,
  coopératives, commerçantes…).
- **Mots tapés dans la recherche** : montre ce que les visiteurs cherchent et ne trouvent pas.
- **Retours sur la veille** (cloche des nouveautés) : mesure la question « pourquoi un producteur
  reviendrait-il demain ? ».
- **Clics sur les fils des photos** : savoir quelles informations intéressent le plus.

_Ces mesures ne sont pas encore installées : dites-moi si vous voulez que je les ajoute._
