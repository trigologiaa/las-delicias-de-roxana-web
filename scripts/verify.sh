#!/usr/bin/env bash
# Verificación única de delicias-web. Igual en local y en CI.
#   ./scripts/verify.sh        -> completo
#   ./scripts/verify.sh fast   -> lint + tipos + arquitectura + unit
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
MODE="${1:-full}"

step() { printf '\n\033[1;34m▶ %s\033[0m\n' "$*"; }

case "$MODE" in
  full | fast) ;;
  *) echo "Uso: $0 [full|fast]" >&2; exit 2 ;;
esac

command -v pnpm >/dev/null 2>&1 || { echo "pnpm no está instalado" >&2; exit 1; }

if [ ! -d node_modules ] || [ -n "${CI:-}" ]; then
  step "Instalando dependencias"
  pnpm install --frozen-lockfile
fi

step "Lint y formato (Biome)"
pnpm lint

step "Tipos (tsc)"
pnpm typecheck

step "Arquitectura (límites entre carpetas)"
pnpm arch:check

step "Tests unitarios"
pnpm test:unit

if [ "$MODE" = "full" ]; then
  step "Cliente de API al día con el contrato"
  pnpm api:check
  step "Tests de integración (API simulada)"
  pnpm test:integration
  step "Tests de aceptación"
  pnpm test:acceptance
  step "Build"
  pnpm build
fi

printf '\n\033[1;32m✔ verify (%s) OK\033[0m\n' "$MODE"

