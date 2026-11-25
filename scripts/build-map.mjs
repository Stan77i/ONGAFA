// Génère src/data/ci-regions.json (carte SVG des régions de Côte d'Ivoire) à partir de geoBoundaries.
//
// Source : geoBoundaries gbOpen CIV ADM2 (régions), données Banque mondiale, licence CC BY 4.0.
// https://www.geoboundaries.org/api/current/gbOpen/CIV/ADM2/
//
// Usage : node scripts/build-map.mjs <chemin/vers/geoBoundaries-CIV-ADM2_simplified.geojson>
import { readFileSync, writeFileSync } from "node:fs";

const input = process.argv[2];
if (!input) {
  console.error("Usage : node scripts/build-map.mjs <fichier.geojson>");
  process.exit(1);
}

/** Noms officiels accentués (le fichier source n'a pas d'accents). */
const NAMES = {
  "Agneby-Tiassa": "Agnéby-Tiassa",
  Bafing: "Bafing",
  Bagoue: "Bagoué",
  Belier: "Bélier",
  Bere: "Béré",
  Bounkani: "Bounkani",
  Cavally: "Cavally",
  "District Autonome D'Abidjan": "District autonome d'Abidjan",
  "District Autonome De Yamoussoukro": "District autonome de Yamoussoukro",
  Folon: "Folon",
  Gbeke: "Gbêkê",
  Gbokle: "Gbôklé",
  Goh: "Gôh",
  Gontougo: "Gontougo",
  "Grands Ponts": "Grands-Ponts",
  Guemon: "Guémon",
  Hambol: "Hambol",
  "Haut-Sassandra": "Haut-Sassandra",
  Iffou: "Iffou",
  "Indenie-Djuablin": "Indénié-Djuablin",
  Kabadougou: "Kabadougou",
  "Loh-Djiboua": "Lôh-Djiboua",
  Marahoue: "Marahoué",
  Me: "Mé",
  Moronou: "Moronou",
  "N'Zi": "N'Zi",
  Nawa: "Nawa",
  Poro: "Poro",
  "San Pedro": "San-Pédro",
  "Sud-Comoe": "Sud-Comoé",
  Tchologo: "Tchologo",
  Tonkpi: "Tonkpi",
  Worodougou: "Worodougou",
};

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const geo = JSON.parse(readFileSync(input, "utf8"));
const polysOf = (g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);

// Emprise
let minLon = Infinity,
  maxLon = -Infinity,
  minLat = Infinity,
  maxLat = -Infinity;
for (const f of geo.features)
  for (const poly of polysOf(f.geometry))
    for (const [lon, lat] of poly[0]) {
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }

// Projection équirectangulaire corrigée à la latitude moyenne (suffisante à l'échelle d'un pays tropical).
const WIDTH = 1000;
const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
const scale = WIDTH / ((maxLon - minLon) * kx);
const HEIGHT = Math.round((maxLat - minLat) * scale);
const project = ([lon, lat]) => [(lon - minLon) * kx * scale, (maxLat - lat) * scale];

// Douglas-Peucker
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const sq = tol * tol;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0,
      idx = -1;
    const [ax, ay] = pts[a],
      [bx, by] = pts[b];
    const dx = bx - ax,
      dy = by - ay,
      len = dx * dx + dy * dy || 1;
    for (let i = a + 1; i < b; i++) {
      const t = Math.max(0, Math.min(1, ((pts[i][0] - ax) * dx + (pts[i][1] - ay) * dy) / len));
      const px = ax + t * dx - pts[i][0],
        py = ay + t * dy - pts[i][1];
      const d = px * px + py * py;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > sq && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

const area = (ring) =>
  ring.reduce((s, [x, y], i) => {
    const [x2, y2] = ring[(i + 1) % ring.length];
    return s + x * y2 - x2 * y;
  }, 0) / 2;
function centroid(ring) {
  const A = area(ring);
  let cx = 0,
    cy = 0;
  ring.forEach(([x, y], i) => {
    const [x2, y2] = ring[(i + 1) % ring.length];
    const c = x * y2 - x2 * y;
    cx += (x + x2) * c;
    cy += (y + y2) * c;
  });
  return [cx / (6 * A), cy / (6 * A)];
}
const r1 = (n) => Math.round(n * 10) / 10;

const regions = geo.features
  .map((f) => {
    const source = f.properties.shapeName;
    const name = NAMES[source] ?? source;
    let d = "",
      best = null,
      bestArea = 0,
      bestLonLat = null;
    for (const poly of polysOf(f.geometry)) {
      for (const [ri, ring] of poly.entries()) {
        const p = simplify(ring.map(project), 0.6);
        if (p.length < 4) continue;
        d += "M" + p.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L") + "Z";
        if (ri === 0) {
          const a = Math.abs(area(p));
          if (a > bestArea) {
            bestArea = a;
            best = p;
            bestLonLat = ring;
          }
        }
      }
    }
    const [cx, cy] = centroid(best);
    const [lon, lat] = centroid(bestLonLat);
    return {
      slug: slugify(name),
      name,
      iso: f.properties.shapeISO || null,
      autonomousDistrict: /District/i.test(source),
      d,
      label: [r1(cx), r1(cy)],
      centroid: [Math.round(lon * 1e5) / 1e5, Math.round(lat * 1e5) / 1e5],
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

const out = {
  source: "geoBoundaries (gbOpen CIV ADM2), Banque mondiale, licence CC BY 4.0",
  sourceUrl: "https://www.geoboundaries.org/",
  viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
  regions,
};
writeFileSync("src/data/ci-regions.json", JSON.stringify(out));
console.log(
  `${regions.length} régions, ${Math.round(JSON.stringify(out).length / 1024)} Ko, viewBox ${out.viewBox}`,
);
