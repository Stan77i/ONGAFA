#!/usr/bin/env bash
# Applique toutes les migrations sur une base de test JETABLE, puis exécute les tests de sécurité.
# Utilise les variables libpq standard (PGHOST, PGPORT, PGUSER, PGPASSWORD) : il faut un superutilisateur
# et un serveur PostgreSQL avec PostGIS. La base est créée puis supprimée automatiquement.
set -euo pipefail
cd "$(dirname "$0")/.."

DB="afa_test_$(date +%s)_$$"
PSQL=(psql -X -q -v ON_ERROR_STOP=1)

"${PSQL[@]}" -d postgres -c "create database $DB"
trap '"${PSQL[@]}" -d postgres -c "drop database if exists $DB" >/dev/null 2>&1 || true' EXIT
"${PSQL[@]}" -d "$DB" -c "alter database $DB set search_path = public, extensions"

echo "→ Environnement Supabase simulé"
"${PSQL[@]}" -d "$DB" -f supabase/tests/00_supabase_stub.sql

for f in supabase/migrations/*.sql; do
  echo "→ Migration $(basename "$f")"
  "${PSQL[@]}" -d "$DB" -f "$f"
done

echo "→ Tests"
for f in supabase/tests/[0-9][1-9]_*.sql; do
  "${PSQL[@]}" -o /dev/null -d "$DB" -f "$f" 2>&1 | sed -e 's/^psql:[^:]*:[0-9]*: NOTICE:  /  /'
done
