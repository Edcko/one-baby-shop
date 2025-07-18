# 🚀 Guía de Despliegue - One Baby Shop

## 📋 Prerrequisitos

### Herramientas Necesarias
- **Node.js**: Versión 16 o superior
- **npm** o **yarn**: Gestor de paquetes
- **Git**: Control de versiones
- **Servidor web**: Nginx, Apache, o plataforma de hosting

### Configuración del Entorno
```bash
# Verificar versiones
node --version
npm --version
git --version
```

## 🏗️ Preparación del Proyecto

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/one-baby-shop.git
cd one-baby-shop
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivos de configuración según el entorno:

#### Desarrollo (.env.development)
```env
VITE_APP_TITLE=One Baby Shop (Dev)
VITE_APP_API_URL=http://localhost:3000/api
VITE_APP_DEBUG=true
VITE_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_dev
VITE_APP_MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key_dev
```

#### Producción (.env.production)
```env
VITE_APP_TITLE=One Baby Shop
VITE_APP_API_URL=https://api.onebabyshop.com/api
VITE_APP_DEBUG=false
VITE_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_prod
VITE_APP_MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key_prod
```

### 4. Build del Proyecto
```bash
# Build para desarrollo
npm run build:dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🌐 Despliegue en Diferentes Plataformas

### 1. Vercel (Recomendado)

#### Configuración Automática
1. **Conectar repositorio** en [Vercel](https://vercel.com)
2. **Configurar variables de entorno** en el dashboard
3. **Deploy automático** en cada push

#### Configuración Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_APP_TITLE": "One Baby Shop",
    "VITE_APP_API_URL": "https://api.onebabyshop.com/api"
  }
}
```

### 2. Netlify

#### Configuración Automática
1. **Conectar repositorio** en [Netlify](https://netlify.com)
2. **Configurar build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Configurar variables de entorno**

#### Configuración Manual
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_APP_TITLE = "One Baby Shop"
  VITE_APP_API_URL = "https://api.onebabyshop.com/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

#### Configuración
1. **Crear workflow** en `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_APP_TITLE: One Baby Shop
        VITE_APP_API_URL: https://api.onebabyshop.com/api
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. **Configurar GitHub Pages** en Settings > Pages
3. **Seleccionar branch** `gh-pages` como source

### 4. Firebase Hosting

#### Configuración
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init hosting
```

#### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

#### Deploy
```bash
firebase deploy --only hosting
```

### 5. Servidor VPS (Nginx)

#### Configuración del Servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Configurar Nginx
```nginx
# /etc/nginx/sites-available/one-baby-shop
server {
    listen 80;
    server_name onebabyshop.com www.onebabyshop.com;
    
    root /var/www/one-baby-shop/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy (si tienes backend)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Despliegue Manual
```bash
# Crear directorio
sudo mkdir -p /var/www/one-baby-shop

# Copiar archivos
sudo cp -r dist/* /var/www/one-baby-shop/

# Configurar permisos
sudo chown -R www-data:www-data /var/www/one-baby-shop
sudo chmod -R 755 /var/www/one-baby-shop

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/one-baby-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Docker

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  one-baby-shop:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_APP_TITLE=One Baby Shop
      - VITE_APP_API_URL=https://api.onebabyshop.com/api
```

#### Deploy con Docker
```bash
# Build y run
docker-compose up -d

# O manualmente
docker build -t one-baby-shop .
docker run -p 80:80 one-baby-shop
```

## 🔧 Configuración de Dominio y SSL

### 1. Configurar DNS
```bash
# Registrar dominio en tu proveedor
# Apuntar A record a tu servidor IP
# Configurar CNAME para www
```

### 2. SSL con Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d onebabyshop.com -d www.onebabyshop.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Configuración HTTPS en Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name onebabyshop.com www.onebabyshop.com;
    
    ssl_certificate /etc/letsencrypt/live/onebabyshop.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/onebabyshop.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # ... resto de configuración
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name onebabyshop.com www.onebabyshop.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 Monitoreo y Analytics

### 1. Google Analytics
```html
<!-- En index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Sentry para Error Tracking
```javascript
// En main.js
import * as Sentry from "@sentry/vue";

Sentry.init({
  app,
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE
});
```

### 3. Logs del Servidor
```bash
# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ver logs de la aplicación
sudo journalctl -u nginx -f
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Run linting
      run: npm run lint
      
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_APP_TITLE: One Baby Shop
        VITE_APP_API_URL: ${{ secrets.API_URL }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Build Falla
```bash
# Limpiar cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Verificar variables de entorno
echo $VITE_APP_API_URL
```

#### 2. Rutas no Funcionan (404)
```nginx
# Agregar en configuración de Nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 3. CORS Errors
```javascript
// Configurar en el backend
app.use(cors({
  origin: ['https://onebabyshop.com', 'https://www.onebabyshop.com'],
  credentials: true
}));
```

#### 4. Performance Issues
```bash
# Analizar bundle
npm run build -- --analyze

# Optimizar imágenes
npm install -g imagemin-cli
imagemin src/assets/* --out-dir=dist/assets
```

## 📈 Optimización de Performance

### 1. Bundle Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['@headlessui/vue', '@heroicons/vue']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. Image Optimization
```bash
# Instalar herramientas
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant

# Optimizar imágenes
imagemin src/assets/* --out-dir=dist/assets
```

### 3. Caching Strategy
```nginx
# Nginx caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

## 🔒 Seguridad

### 1. Headers de Seguridad
```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 2. Rate Limiting
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:3000;
}
```

### 3. DDoS Protection
```bash
# Instalar fail2ban
sudo apt install fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

**¡Tu aplicación está lista para producción! 🚀** 