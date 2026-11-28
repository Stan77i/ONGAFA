import type { domains } from "@/content/afa";
import type { AfaIconName } from "./icons";

/** Icône dessinée de chaque domaine d'intervention (src/content/afa.ts). */
export const domainIcon: Record<(typeof domains)[number]["slug"], AfaIconName> = {
  manioc: "manioc",
  mais: "mais",
  transformation: "transfo",
  femmes: "femmes",
  jeunes: "jeunes",
  cooperatives: "coop",
  commercialisation: "logistique",
  "developpement-local": "local",
};
