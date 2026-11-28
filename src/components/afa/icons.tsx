import type { ReactNode, SVGProps } from "react";

/**
 * Icônes AFA dessinées sur mesure : grille 48, trait encre 2,2, un aplat de la palette.
 * Toujours décoratives (`aria-hidden`) : le texte voisin porte le sens.
 */
const I = "#1d2417";
const st = {
  fill: "none",
  stroke: I,
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const F = (c: string) => ({ fill: c, stroke: I, strokeWidth: 2.2, strokeLinejoin: "round" }) as const;

const tuber = (c: string) => (
  <>
    <path d="M11 42 C7 38 9 29 16 22 C23 15 31 11 36 14 C39 18 34 26 28 32 C21 39 15 45 11 42 Z" {...F(c)} />
    <path d="M17 33 l4 2 M21 28 l4 2 M26 23 l3 2" {...st} />
  </>
);

const glyphs = {
  manioc: (
    <>
      <path d="M36 14 C36 8 40 5 45 4 C44 9 41 12 36 14 Z" {...F("#59883c")} />
      <path d="M36 14 C31 11 29 7 29 2 C34 4 36 9 36 14 Z" {...F("#59883c")} />
      {tuber("#df8433")}
    </>
  ),
  mais: (
    <>
      <path
        d="M24 7 C30 7 32 17 32 25 C32 33 28 38 24 38 C20 38 16 33 16 25 C16 17 18 7 24 7 Z"
        {...F("#efe6d2")}
      />
      <path d="M20 14 H28 M18 20 H30 M17.5 26 H30.5 M19 32 H29 M24 8 V38" {...st} />
      <path d="M24 45 C15 42 9 33 10 22 C14 29 19 33 23 35 Z" {...F("#59883c")} />
      <path d="M24 45 C33 42 39 33 38 22 C34 29 29 33 25 35 Z" {...F("#59883c")} />
    </>
  ),
  transfo: (
    <>
      <path d="M18 17 C16 13 20 11 18 6 M25 17 C23 13 27 11 25 6 M32 17 C30 13 34 11 32 6" {...st} />
      <path d="M8 23 H40 V29 C40 38 33 42 24 42 C15 42 8 38 8 29 Z" {...F("#df8433")} />
      <path d="M5 23 H43 M8 27 H3 M40 27 H45 M16 42 L14 46 M32 42 L34 46" {...st} />
    </>
  ),
  femmes: (
    <>
      <circle cx="31" cy="12" r="7" {...F("#df8433")} />
      <path d="M31 8.5 V15.5 M28.5 10.5 H33" {...st} />
      <path d="M3 31 H11 L19 28 C23 27 27 28 30 30 L22 33" {...F("#efe6d2")} />
      <path d="M11 41 H27 L41 32 C44 30 42 26 38 27 L29 31" {...st} />
      <path d="M3 26 H11 V44 H3 Z" {...F("#59883c")} />
    </>
  ),
  jeunes: (
    <>
      <path d="M24 17 V8" {...st} />
      <path d="M24 11 C24 6 28 3 33 3 C33 8 29 11 24 11 Z" {...F("#59883c")} />
      <path d="M24 14 C24 10 21 7 16 7 C16 11 19 14 24 14 Z" {...F("#59883c")} />
      <path
        d="M4 18 C11 16 18 17 24 21 C30 17 37 16 44 18 V42 C37 40 30 41 24 45 C18 41 11 40 4 42 Z"
        {...F("#fff")}
      />
      <path
        d="M24 21 V45 M9 25 C13 24.5 17 25 20 26.5 M9 31 C13 30.5 17 31 20 32.5 M28 26.5 C31 25 35 24.5 39 25"
        {...st}
      />
    </>
  ),
  coop: (
    <>
      <circle cx="12" cy="17" r="5" {...F("#fff")} />
      <circle cx="36" cy="17" r="5" {...F("#fff")} />
      <path
        d="M2 38 C2 30 6 26 12 26 C16 26 19 28 20 31 M46 38 C46 30 42 26 36 26 C32 26 29 28 28 31"
        {...st}
      />
      <circle cx="24" cy="14" r="6.5" {...F("#59883c")} />
      <path d="M12 44 C12 33 17 27 24 27 C31 27 36 33 36 44 Z" {...F("#df8433")} />
    </>
  ),
  logistique: (
    <>
      <path d="M3 12 H29 V34 H3 Z" {...F("#df8433")} />
      <path d="M29 19 H37 L44 27 V34 H29 Z" {...F("#fff")} />
      <path d="M33 20 V26 H42 M9 19 C13 16 18 22 23 19" {...st} />
      <circle cx="12" cy="36" r="4.5" {...F("#efe6d2")} />
      <circle cx="36" cy="36" r="4.5" {...F("#efe6d2")} />
    </>
  ),
  local: (
    <>
      <path d="M10 24 V42 H38 V24" {...F("#fff")} />
      <path d="M4 25 L24 6 L44 25 Z" {...F("#df8433")} />
      <path d="M14 20 L18 13 M22 20 L24 10 M30 20 L28 12 M36 21 L31 15" {...st} />
      <path d="M20 42 V34 C20 30 28 30 28 34 V42" {...F("#59883c")} />
      <path d="M2 42 H46" {...st} />
    </>
  ),
  commerce: (
    <>
      <path d="M4 20 L8 8 H40 L44 20 Z" {...F("#df8433")} />
      <path
        d="M4 20 C4 24 10 24 10 20 C10 24 17 24 17 20 C17 24 24 24 24 20 C24 24 31 24 31 20 C31 24 38 24 38 20 C38 24 44 24 44 20"
        {...F("#efe6d2")}
      />
      <path d="M8 24 V42 H40 V24" {...st} />
      <path d="M18 42 V32 H30 V42" {...F("#59883c")} />
    </>
  ),
  acheteur: (
    <>
      <path d="M8 18 H40 L37 42 H11 Z" {...F("#efe6d2")} />
      <path d="M16 18 C16 9 32 9 32 18" {...st} />
      <path d="M14 26 H34 M15 34 H33" {...st} />
      <circle cx="24" cy="30" r="4" {...F("#df8433")} />
    </>
  ),
  partenaire: (
    <>
      <path d="M2 18 L12 14 L20 22 L12 30 L2 26 Z" {...F("#59883c")} />
      <path d="M46 18 L36 14 L28 22 L36 30 L46 26 Z" {...F("#df8433")} />
      <path d="M12 30 L20 37 C22 39 25 38 26 36 L30 39 C32 40 35 38 34 35 L36 30" {...st} />
      <path d="M20 22 L26 18 C28 17 30 17 32 18 L36 20" {...st} />
    </>
  ),
  doux: (
    <>
      {tuber("#efe6d2")}
      <path d="M36 14 C36 8 40 5 45 4 C44 9 41 12 36 14 Z" {...F("#59883c")} />
    </>
  ),
  amer: (
    <>
      {tuber("#df8433")}
      <path d="M33 4 L43 4 M38 4 V10" {...st} />
      <circle cx="38" cy="13" r="3.5" {...F("#fff")} />
    </>
  ),
  warn: (
    <>
      <path d="M24 5 L45 42 H3 Z" {...F("#f7f2e8")} />
      <path d="M24 18 V30 M24 35.5 V36" {...st} strokeWidth={3.6} />
    </>
  ),
  alimentation: (
    <>
      <path d="M6 26 H42 C42 36 34 42 24 42 C14 42 6 36 6 26 Z" {...F("#df8433")} />
      <path d="M14 20 C16 14 20 12 24 12 C28 12 32 14 34 20" {...st} />
      <path d="M24 8 V12" {...st} />
    </>
  ),
  pharmacie: (
    <>
      <path d="M18 6 H30 M20 6 V18 L9 38 C8 41 10 43 13 43 H35 C38 43 40 41 39 38 L28 18 V6" {...F("#fff")} />
      <path d="M13 32 H35 L39 38 C40 41 38 43 35 43 H13 C10 43 8 41 9 38 Z" {...F("#59883c")} />
    </>
  ),
  cosmetique: (
    <>
      <path d="M16 18 H32 V40 C32 42 30 43 28 43 H20 C18 43 16 42 16 40 Z" {...F("#df8433")} />
      <path d="M19 18 V11 H29 V18 M21 11 V6 H27 V11" {...F("#fff")} />
      <path d="M38 8 V14 M35 11 H41" {...st} />
    </>
  ),
  plante: (
    <>
      <path d="M24 44 V20" {...st} />
      <path d="M24 24 C24 13 32 6 43 6 C43 17 35 24 24 24 Z" {...F("#59883c")} />
      <path d="M24 30 C24 21 17 15 6 15 C6 24 13 30 24 30 Z" {...F("#a9c98f")} />
    </>
  ),
  quote: (
    <>
      <path d="M6 10 H42 V34 H22 L12 42 V34 H6 Z" {...F("#efe6d2")} />
      <path d="M14 19 H34 M14 26 H28" {...st} />
    </>
  ),
  scale: (
    <>
      <path d="M24 8 V40 M12 42 H36 M8 14 H40" {...st} />
      <path d="M8 14 L2 28 H14 Z" {...F("#efe6d2")} />
      <path d="M40 14 L34 28 H46 Z" {...F("#59883c")} />
      <circle cx="24" cy="8" r="3" {...F("#df8433")} />
    </>
  ),
  calendar: (
    <>
      <path d="M6 10 H42 V42 H6 Z" {...F("#fff")} />
      <path d="M6 10 H42 V18 H6 Z" {...F("#df8433")} />
      <path d="M15 5 V13 M33 5 V13 M14 26 H18 M22 26 H26 M30 26 H34 M14 33 H18 M22 33 H26" {...st} />
    </>
  ),
  search: (
    <>
      <circle cx="20" cy="20" r="13" {...F("#efe6d2")} />
      <path d="M30 30 L42 42" {...st} strokeWidth={4} />
      <path d="M14 18 C15 14 18 13 21 13" {...st} />
    </>
  ),
  badge: (
    <>
      <path
        d="M24 3 L29 8 L36 7 L37 14 L43 18 L40 24 L43 30 L37 34 L36 41 L29 40 L24 45 L19 40 L12 41 L11 34 L5 30 L8 24 L5 18 L11 14 L12 7 L19 8 Z"
        {...F("#59883c")}
      />
      <path d="M16 24 L22 30 L32 18" {...st} stroke="#fff" strokeWidth={3} />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type AfaIconName = keyof typeof glyphs;

export function AfaIcon({
  name,
  size = 48,
  className,
  ...rest
}: { name: AfaIconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ flex: "none", overflow: "visible" }}
      {...rest}
    >
      {glyphs[name]}
    </svg>
  );
}

/** Variante au trait clair (menthe) pour les fonds forêt : bilan, repères. */
const M = "#a9c98f";
const mst = {
  fill: "none",
  stroke: M,
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const MF = (c: string) => ({ fill: c, stroke: M, strokeWidth: 2.2, strokeLinejoin: "round" }) as const;
const darkGlyphs = {
  field: (
    <>
      <path d="M4 40 C14 34 34 34 44 40" {...mst} />
      <path
        d="M24 34 V18 M24 22 C24 15 29 11 36 11 C36 18 31 22 24 22 Z M24 26 C24 20 19 16 12 16 C12 22 17 26 24 26 Z"
        {...MF("#59883c")}
      />
    </>
  ),
  factory: (
    <>
      <path d="M18 17 C16 13 20 11 18 6 M25 17 C23 13 27 11 25 6 M32 17 C30 13 34 11 32 6" {...mst} />
      <path d="M8 23 H40 V29 C40 38 33 42 24 42 C15 42 8 38 8 29 Z" {...MF("#df8433")} />
      <path d="M5 23 H43" {...mst} />
    </>
  ),
  people: (
    <>
      <circle cx="12" cy="17" r="5" {...mst} />
      <circle cx="36" cy="17" r="5" {...mst} />
      <path
        d="M2 38 C2 30 6 26 12 26 C16 26 19 28 20 31 M46 38 C46 30 42 26 36 26 C32 26 29 28 28 31"
        {...mst}
      />
      <circle cx="24" cy="14" r="6.5" {...MF("#59883c")} />
      <path d="M12 44 C12 33 17 27 24 27 C31 27 36 33 36 44 Z" {...MF("#df8433")} />
    </>
  ),
  sprout: (
    <>
      <path d="M24 42 V22" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
      <path
        d="M24 26 C24 16 31 10 41 10 C41 20 34 26 24 26 Z"
        fill="#a9c98f"
        stroke="#fff"
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d="M24 30 C24 22 18 17 9 17 C9 25 15 30 24 30 Z"
        fill="#a9c98f"
        stroke="#fff"
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
    </>
  ),
} satisfies Record<string, ReactNode>;

export function AfaIconDark({ name, size = 48 }: { name: keyof typeof darkGlyphs; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      style={{ flex: "none", overflow: "visible" }}
    >
      {darkGlyphs[name]}
    </svg>
  );
}

/** Flèche au trait (liens et boutons). */
export function Arrow({
  color = "currentColor",
  width = 22,
  className,
}: {
  color?: string;
  width?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={(width * 14) / 22}
      viewBox="0 0 22 14"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ flex: "none" }}
    >
      <path
        d="M1 7 H20 M14 1 L20 7 L14 13"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pastille cochée (listes de perspectives). */
export function Check({ bg = "#df8433" }: { bg?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      aria-hidden="true"
      focusable="false"
      style={{ marginTop: 1 }}
    >
      <circle cx="13" cy="13" r="11" fill={bg} stroke={I} strokeWidth={1.8} />
      <path d="M8 13.5 L11.5 17 L18.5 9" {...st} strokeWidth={2.4} />
    </svg>
  );
}
