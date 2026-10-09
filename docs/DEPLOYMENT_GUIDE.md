# 🚀 Guía de Despliegue — One Baby Shop (self-hosted)

Arquitectura: **nginx** (frontend estático + proxy same-origin) + **systemd**
(API Fastify como servicio) + **PostgreSQL** local. Sin PaaS, sin Docker
obligatorio. Funciona igual en un servidor LAN y en un VPS de producción.

```
             ┌────────────── nginx :80/:443 ──────────────┐
 navegador → │  /            → /srv/one-baby-shop/web     │  (SPA estática)
             │  /api/v1/*     → 127.0.0.1:3001 (proxy)    │
             └───────────────────────┬────────────────────┘
                                     │
                     systemd: one-baby-shop-api
                     node dist/src/index.js (NODE_ENV=production)
                                     │
                              PostgreSQL (systemd)
```

## Primera instalación (Arch/EndeavourOS)

```bash
# 1. Prerrequisitos
sudo pacman -S --needed nginx postgresql nodejs npm rsync

# 2. Clonar y preparar
git clone https://github.com/Edcko/one-baby-shop.git
cd one-baby-shop
npm install && (cd backend && npm install)

# 3. Base de datos (si no existe ya)
sudo systemctl enable --now postgresql
sudo runuser -u postgres -- psql -c "CREATE ROLE babyshop LOGIN PASSWORD '***' CREATEDB;"
sudo runuser -u postgres -- createdb -O babyshop babyshop

# 4. .env de producción del API
cp backend/.env.example /srv/one-baby-shop/api/.env  # (crear directorios antes)
#    EDITAR: secretos con `openssl rand -base64 48`, DATABASE_URL real,
#    NODE_ENV=production, MP_ACCESS_TOKEN/MP_WEBHOOK_SECRET,
#    COOKIE_SECURE (false en HTTP LAN / true con TLS), APP_URL público

# 5. nginx
sudo mkdir -p /etc/nginx/conf.d
sudo cp deploy/nginx.conf /etc/nginx/conf.d/one-baby-shop.conf
#    (en Arch: la config por defecto trae un server inline en :80 —
#     reemplázala por el nginx.conf mínimo de deploy/ o quita ese bloque)

# 6. Servicio systemd
sudo cp deploy/one-baby-shop-api.service /etc/systemd/system/
sudo systemctl daemon-reload

# 7. Primer deploy
./deploy/deploy.sh
```

## Deploys subsecuentes

```bash
git pull && ./deploy/deploy.sh
```

El script (idempotente): build frontend con `VITE_API_URL=/api/v1` (same-origin,
cero CORS) → build backend → rsync a `/srv/one-baby-shop` → `prisma migrate
deploy` (aplica migraciones pendientes sin perder datos) → restart del servicio.

## Verificación post-deploy

```bash
curl -s localhost/health                    # {"status":"ok","database":"up"}
curl -s "localhost/api/v1/products?limit=1" # catálogo desde la BD
systemctl status one-baby-shop-api
journalctl -u one-baby-shop-api -f          # logs en vivo
```

## Mercado Pago en producción

1. Credenciales **de producción** (no TEST-) en `/srv/one-baby-shop/api/.env`
2. `PUBLIC_API_URL=https://tu-dominio` — con eso el webhook queda
   `https://tu-dominio/api/v1/payments/webhook`
3. Registrar esa URL en el panel de MP (Webhooks) y copiar la clave secreta
   a `MP_WEBHOOK_SECRET`
4. `sudo systemctl restart one-baby-shop-api`

## TLS (cuando haya dominio)

```bash
sudo pacman -S certbot-nginx
sudo certbot --nginx -d tu-dominio.mx
# Y en /srv/one-baby-shop/api/.env: COOKIE_SECURE=true
```

## Copias de seguridad

```bash
# Dump diario (cron: 0 3 * * *)
pg_dump -U babyshop babyshop | gzip > /var/backups/babyshop-$(date +%F).sql.gz
```

## Endurecimiento pendiente para internet público

- [ ] fail2ban para nginx (SSH + HTTP)
- [ ] Rate limit de nginx además del de la API
- [ ] Backups automáticos VERIFICADOS (restore drill mensual)
- [ ] Monitoreo (uptime + alerta) — el systemd Restart=always cubre caídas de proceso, no de disco/BD

## Rollback

```bash
# El build vive en /srv (copiado, no enlazado): regresa al commit anterior
git checkout <commit-anterior> && ./deploy/deploy.sh
# BD: restaurar el dump correspondiente ANTES de migrar hacia adelante
```
