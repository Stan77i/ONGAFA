import type { DetailedHTMLProps, HTMLAttributes } from "react";

type AfaMap3DAttributes = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  mode?: "full" | "teaser";
  shift?: string;
  "shift-y"?: string;
  href?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "afa-map3d": AfaMap3DAttributes;
    }
  }
}
