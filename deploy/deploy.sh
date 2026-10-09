#!/usr/bin/env bash
# One Baby Shop — deploy self-hosted (local server o VPS con systemd+nginx)
#
# Uso:  ./deploy/deploy.sh
#
# Qué hace (idempotente):
#   1. Build frontend (Vite → dist/) con VITE_API_URL=/api/v1 (same-origin)
#   2. Build backend (tsc → backend/dist/)
#   3. Sincroniza a /srv/one-baby-shop (web estática + API estable)
#   4. prisma migrate deploy (migraciones pendientes, sin perder datos)
#   5. systemctl restart one-baby-shop-api
#
# Requisitos: node, npm, postgres activo, .env de producción en
# /srv/one-baby-shop/api/.env (la PRIMERA vez se copia de backend/.env).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRV_ROOT="/srv/one-baby-shop"
API_DIR="$SRV_ROOT/api"
WEB_DIR="$SRV_ROOT/web"

echo "── 1/5 Build frontend…"
cd "$REPO_ROOT"
VITE_API_URL=/api/v1 npm run build

echo "── 2/5 Build backend…"
cd "$REPO_ROOT/backend"
npm run build

echo "── 3/5 Sincronizando a $SRV_ROOT…"
if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

$SUDO mkdir -p "$API_DIR" "$WEB_DIR"
# API: código compilado + dependencias de producción + prisma (migraciones)
$SUDO rsync -a --delete dist/ "$API_DIR/dist/"
$SUDO rsync -a --delete generated/ "$API_DIR/generated/"
$SUDO rsync -a --delete prisma/migrations/ "$API_DIR/prisma/migrations/"
rsync -a package.json prisma.config.ts "$API_DIR/"
$SUDO cp prisma/migrations/migration_lock.toml "$API_DIR/prisma/migrations/" 2>/dev/null || true
# Web: assets estáticos
$SUDO rsync -a --delete "$REPO_ROOT/dist/" "$WEB_DIR/"

# Primera vez: copiar .env y instalar deps de producción
if [ ! -f "$API_DIR/.env" ]; then
  if [ -f "$REPO_ROOT/backend/.env" ]; then
    $SUDO cp "$REPO_ROOT/backend/.env" "$API_DIR/.env"
    echo "   ⚠ .env copiado de backend/.env — REVISA secretos y NODE_ENV=production"
  else
    echo "   ✗ Falta $API_DIR/.env (copia backend/.env.example y complétalo)" >&2
    exit 1
  fi
fi
if [ ! -d "$API_DIR/node_modules" ]; then
  echo "   Instalando dependencias de producción (primera vez)…"
  cd "$API_DIR" && $SUDO npm install --omit=dev && cd "$REPO_ROOT"
fi

echo "── 4/5 Migraciones…"
cd "$API_DIR"
$SUDO env $(grep -v '^#' .env | xargs) npx prisma migrate deploy

echo "── 5/5 Reiniciando servicio…"
$SUDO systemctl restart one-baby-shop-api
sleep 2
systemctl is-active one-baby-shop-api

echo ""
echo "✅ Deploy listo. Verifica:"
echo "   curl -s localhost/health"
echo "   curl -s localhost/api/v1/products?limit=1"
