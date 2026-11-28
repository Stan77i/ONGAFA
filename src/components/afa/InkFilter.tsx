/**
 * Filtres SVG partagés, montés une seule fois dans le layout racine :
 *  - `#afa-goo` : effet « encre » des titres Shrikhand (classe `.ink-title`) ;
 *  - `#afa-shadow` : ombre douce du papier ligné.
 */
export function InkFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="pointer-events-none absolute">
      <defs>
        <filter id="afa-goo" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" />
        </filter>
        {/* Variante pour les titres de moins de 60 px : le flou de 4 px y mangerait les lettres. */}
        <filter id="afa-goo-sm" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -4.5" />
        </filter>
        <filter id="afa-shadow" x="-10%" y="-20%" width="130%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1d2417" floodOpacity="0.28" />
        </filter>
      </defs>
    </svg>
  );
}
