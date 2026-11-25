/**
 * Contenus institutionnels de l'ONG AFA.
 * Source unique : document « Présentation & perspectives » transmis par l'ONG (voir docs/CONTEXTE_AFA.md).
 * Rien n'est ajouté qui ne figure pas dans ce document ou dans le cadrage validé par l'ONG.
 */

export const president = {
  title: "L'Honorable",
  name: "N'ZI N'DA AFFOUÉ Éliane",
  role: "Présidente de l'ONG AFA",
  photo: null as string | null, // photo à fournir par l'ONG (avec accord)
};

/** Bilan déclaré par l'ONG. Pas de date précise : affiché comme période « depuis 2016 ». */
export const results = {
  period: "Bilan déclaré depuis 2016",
  source: "ONG AFA",
  items: [
    { value: "4 000 ha", label: "de plantations de manioc réalisées" },
    { value: "Une demi-dizaine", label: "d'unités de transformation du manioc construites" },
    {
      value: "Une dizaine",
      label: "de sous-préfectures du N'Zi où des coopératives sont structurées et accompagnées",
    },
  ],
} as const;

/** Objet statutaire de l'association. */
export const purpose = [
  "Participer à la conception et à la mise en œuvre des politiques de développement local : agriculture — en particulier la production du manioc et du maïs et leur transformation en produits finis —, industrie alimentaire, formation et éducation, transport, équipements, infrastructures urbaines et commerce.",
  "Soutenir les initiatives locales par le transfert de technologies, la recherche et un fonds d'aide au financement.",
  "Faciliter la signature de conventions ou de concessions avec d'autres ONG et partenaires.",
  "Œuvrer à l'insertion professionnelle et économique des jeunes et des femmes.",
  "Créer des activités génératrices de revenus en faveur des personnes défavorisées.",
] as const;

export const perspectives = [
  "Soutenir la création d'une structure commerciale d'achat et de distribution de produits agricoles.",
  "Mobiliser des financements pour la commercialisation et la bancarisation des commerçantes et des productrices.",
  "Accompagner l'installation de centrales d'achat et de commercialisation du manioc et de ses dérivés, en Côte d'Ivoire et à l'étranger.",
  "Développer une chaîne logistique pour transporter, conserver et transformer le manioc et ses dérivés.",
] as const;

export const ambitions = [
  "Renforcer son leadership dans la filière manioc.",
  "Faire de la filière manioc une filière organisée et forte, à l'image des filières coton, anacarde et karité.",
  "Lutter contre la pauvreté et la cherté de la vie des populations rurales et urbaines.",
  "Contribuer à la lutte contre l'insécurité alimentaire.",
  "Approvisionner les marchés régional et international en manioc et produits dérivés.",
  "Promouvoir les variétés de manioc de Côte d'Ivoire, leur transformation et leur consommation.",
  "Renforcer les parcours de formation des jeunes dans la filière manioc.",
] as const;

/** Domaines d'intervention (objet statutaire + cadrage de la plateforme). */
export const domains = [
  {
    slug: "manioc",
    title: "Filière manioc",
    icon: "sprout",
    text: "Production, transformation et valorisation du manioc sur toute la chaîne de valeur : l'axe prioritaire d'AFA.",
    href: "/manioc",
  },
  {
    slug: "mais",
    title: "Maïs",
    icon: "wheat",
    text: "Seconde culture inscrite dans l'objet de l'association, de la production à la transformation en produits finis.",
  },
  {
    slug: "transformation",
    title: "Transformation agroalimentaire",
    icon: "factory",
    text: "Unités de transformation et industrie alimentaire pour transformer les récoltes en produits finis.",
  },
  {
    slug: "femmes",
    title: "Femmes et revenus",
    icon: "hand-coins",
    text: "Insertion économique des femmes, activités génératrices de revenus, commercialisation et bancarisation des commerçantes et des productrices.",
  },
  {
    slug: "jeunes",
    title: "Jeunes et formation",
    icon: "graduation-cap",
    text: "Insertion professionnelle des jeunes et formation aux métiers de la filière manioc.",
  },
  {
    slug: "cooperatives",
    title: "Coopératives",
    icon: "users",
    text: "Structuration et accompagnement des coopératives de producteurs, à commencer par la région du N'Zi.",
  },
  {
    slug: "commercialisation",
    title: "Commercialisation et logistique",
    icon: "truck",
    text: "Achat, distribution, centrales de commercialisation et chaîne logistique pour transporter et conserver les productions.",
  },
  {
    slug: "developpement-local",
    title: "Développement local",
    icon: "landmark",
    text: "Transfert de technologies, recherche, financement des initiatives locales et partenariats avec les acteurs du territoire.",
  },
] as const;

/** Ancrage territorial (déclaré). La carte interactive arrive en phase 4. */
export const territories = [
  {
    name: "Région du N'Zi",
    status: "active",
    text: "Zone de naissance d'AFA. Plantations de manioc, unités de transformation et coopératives accompagnées dans une dizaine de sous-préfectures.",
  },
  {
    name: "Région de la Nawa",
    status: "upcoming",
    text: "Première étape du déploiement national annoncé par AFA.",
  },
  {
    name: "Autres régions de Côte d'Ivoire",
    status: "upcoming",
    text: "Déploiement progressif sur l'ensemble du territoire national.",
  },
] as const;

/** Le manioc en Côte d'Ivoire (annexes du document). Rendements volontairement absents tant qu'ils ne sont pas sourcés. */
export const cassava = {
  categories: [
    {
      name: "Manioc doux",
      text: "Moins riche en composés cyanogènes. Il peut être cuisiné et consommé rapidement après une simple cuisson.",
    },
    {
      name: "Manioc amer",
      text: "Plus riche en glucosides cyanogènes, il exige un traitement rigoureux — râpage, fermentation, pressage, séchage ou cuisson prolongée — pour éliminer sa toxicité. C'est la forme la plus utilisée pour les produits transformés de longue conservation.",
    },
  ],
  varieties: [
    {
      name: "Yavo",
      text: "Variété améliorée très populaire, cycle d'environ 12 mois. Très appréciée pour le foutou.",
    },
    { name: "Bocou", text: "Variété bien implantée localement, appréciée pour sa productivité." },
    { name: "Olekanga", text: "Variété très répandue dans les zones de production ivoiriennes." },
    {
      name: "Bonoua (Bonoua Kgo)",
      text: "Variété locale traditionnelle, souvent utilisée comme référence dans les zones de production du sud.",
    },
    { name: "Gbazékouté", text: "Cultivar local." },
    { name: "Kombo 2", text: "Cultivar cité parmi les variétés locales et améliorées." },
    { name: "TMS 30-555", text: "Variété améliorée issue de la recherche agronomique." },
  ],
  dishes: [
    {
      name: "Attiéké",
      text: "Semoule de manioc fermentée et cuite à la vapeur : le produit transformé le plus consommé et commercialisé du pays.",
    },
    {
      name: "Foutou de manioc",
      text: "Tubercules épluchés, bouillis puis pilés, parfois avec de la banane plantain ou de l'igname.",
    },
    {
      name: "Placali",
      text: "Pâte de manioc fermentée et cuite, souple et élastique, servie avec une sauce graine ou une sauce kopé.",
    },
    { name: "Tapioca", text: "Dérivé de la fécule, utilisé en bouillies ou en pâtisserie." },
  ],
  derivatives: [
    {
      group: "Alimentation",
      items: [
        "Attiéké",
        "Placali",
        "Gari",
        "Tapioca",
        "Farine et semoule de manioc",
        "Cossettes séchées",
        "Pain, biscuits, gâteaux et pâtisseries",
        "Amidon alimentaire et fécule",
        "Sirops de glucose et maltodextrine",
        "Feuilles de manioc préparées ou séchées",
        "Boissons fermentées",
        "Éthanol (selon les procédés)",
      ],
    },
    {
      group: "Pharmacie",
      intro: "Amidon de manioc purifié ou modifié :",
      items: [
        "Excipients pour comprimés",
        "Agents liants et désintégrants",
        "Agents de remplissage",
        "Supports pour gélules",
        "Gels et matrices pharmaceutiques",
        "Films et matériaux biodégradables",
        "Supports expérimentaux de libération de principes actifs",
      ],
    },
    {
      group: "Cosmétique",
      intro: "Amidon de manioc absorbant, texturant ou filmogène :",
      items: [
        "Poudres matifiantes pour le visage",
        "Masques cosmétiques",
        "Poudres corporelles",
        "Crèmes et laits corporels",
        "Savons solides et liquides",
        "Déodorants",
        "Shampoings et après-shampoings",
        "Masques et crèmes capillaires",
        "Gels coiffants",
        "Produits de soins corporels",
      ],
    },
    {
      group: "Toute la plante",
      items: [
        "Feuilles : produits alimentaires et poudres nutritionnelles",
        "Épluchures et résidus : alimentation animale",
        "Tiges : production de boutures",
      ],
    },
  ],
} as const;
