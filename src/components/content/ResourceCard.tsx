import { Download, FileText, PlayCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export type ResourceSummary = {
  href: string;
  title: string;
  kind: "guide" | "fiche" | "pdf" | "video" | "etude";
  sizeLabel?: string; // « PDF · 1,2 Mo » : utile sur connexion limitée
  crop?: string;
};

const kinds = {
  guide: { label: "Guide", icon: BookOpen },
  fiche: { label: "Fiche technique", icon: FileText },
  pdf: { label: "Document PDF", icon: Download },
  video: { label: "Vidéo", icon: PlayCircle },
  etude: { label: "Étude", icon: FileText },
} as const;

export function ResourceCard({ resource }: { resource: ResourceSummary }) {
  const { label, icon: Icon } = kinds[resource.kind];
  return (
    <a
      href={resource.href}
      className="group flex items-start gap-4 rounded-card bg-white text-ink p-4 ring-1 ring-rule transition-shadow hover:shadow-raised"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-field bg-cream text-afa">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <span className="min-w-0 space-y-1">
        <span className="block font-semibold text-ink group-hover:underline">{resource.title}</span>
        <span className="flex flex-wrap items-center gap-2 text-meta text-ink-soft">
          {label}
          {resource.sizeLabel && <> · {resource.sizeLabel}</>}
          {resource.crop && <Badge tone="crop">{resource.crop}</Badge>}
        </span>
      </span>
    </a>
  );
}
