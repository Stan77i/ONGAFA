# ONG AFA — Action des Femmes d'Afrique pour le Développement

> Valoriser la terre pour nourrir la Nation

Plateforme numérique de l'ONG AFA (Côte d'Ivoire) : filière manioc, vivrier ivoirien, producteurs,
femmes rurales et territoires.

**État : Phase 1 terminée** (architecture, base de données, authentification, rôles). Le site n'est pas
encore ouvert au public.

## Démarrer

```bash
pnpm install
```

```bash
cp .env.example .env.local
```

```bash
pnpm dev
```

Sans configuration Supabase, le site démarre et affiche la page provisoire.

## Vérifier

```bash
pnpm check
```

```bash
PGHOST=/var/run/postgresql pnpm test:db
```

## Documentation

- `CLAUDE.md` : règles permanentes du projet
- `docs/ARCHITECTURE.md` : architecture, modèle de données, rôles, feuille de route
- `docs/DECISIONS.md` : décisions prises et décisions en attente
- `supabase/bootstrap_admin.sql` : création du premier administrateur

Les skills Claude Code du projet sont dans `.claude/skills/`.
