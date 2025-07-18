# 🔧 Plan de Desarrollo del Backend - One Baby Shop

## 📋 Información General

### Stack Tecnológico Propuesto
- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js o Fastify
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT + bcrypt
- **Validación**: Joi o Zod
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Deployment**: Docker + CI/CD

### Arquitectura
```
backend/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── services/        # Servicios reutilizables
│   ├── models/          # Modelos de datos
│   ├── middleware/      # Middlewares personalizados
│   ├── routes/          # Definición de rutas
│   ├── utils/           # Utilidades y helpers
│   ├── config/          # Configuraciones
│   └── types/           # Tipos TypeScript
├── prisma/              # Esquema y migraciones
├── tests/               # Tests unitarios e integración
├── docs/                # Documentación API
└── scripts/             # Scripts de utilidad
```

## 🎯 Fases de Desarrollo

### Fase 1: Configuración Base (Semana 1)
- [ ] **Setup del proyecto**
  - Inicializar Node.js con TypeScript
  - Configurar Express.js/Fastify
  - Configurar Prisma con PostgreSQL
  - Setup de ESLint y Prettier
  - Configurar Jest para testing

- [ ] **Configuración de Base de Datos**
  - Crear esquema Prisma
  - Implementar migraciones iniciales
  - Configurar seeds para datos de prueba
  - Setup de backup automático

- [ ] **Autenticación y Autorización**
  - Implementar registro de usuarios
  - Implementar login/logout
  - JWT middleware
  - Middleware de roles (user/admin)
  - Recuperación de contraseña

### Fase 2: API Core (Semana 2-3)
- [ ] **Gestión de Productos**
  - CRUD completo de productos
  - Gestión de categorías
  - Subida de imágenes (multer + cloudinary)
  - Búsqueda y filtros avanzados
  - Paginación y ordenamiento

- [ ] **Sistema de Carrito**
  - Agregar/quitar productos
  - Actualizar cantidades
  - Persistencia en base de datos
  - Cálculo de totales
  - Validación de stock

- [ ] **Gestión de Usuarios**
  - Perfil de usuario
  - Gestión de direcciones
  - Historial de pedidos
  - Favoritos/wishlist
  - Preferencias de usuario

### Fase 3: E-commerce Completo (Semana 4-5)
- [ ] **Sistema de Pedidos**
  - Crear pedidos
  - Estados de pedido
  - Historial de pedidos
  - Tracking de envío
  - Notificaciones por email

- [ ] **Integración de Pagos**
  - PayPal integration
  - Mercado Pago integration
  - Webhooks de pagos
  - Manejo de errores de pago
  - Reembolsos

- [ ] **Reseñas y Valoraciones**
  - Sistema de reviews
  - Validación de compra
  - Moderación de reviews
  - Cálculo de ratings

### Fase 4: Funcionalidades Avanzadas (Semana 6)
- [ ] **Panel de Administración**
  - Dashboard con estadísticas
  - Gestión de productos
  - Gestión de pedidos
  - Gestión de usuarios
  - Reportes y analytics

- [ ] **Sistema de Cupones**
  - Crear cupones
  - Validación de cupones
  - Aplicación en checkout
  - Límites de uso

- [ ] **Notificaciones**
  - Email notifications
  - Push notifications
  - Notificaciones en tiempo real
  - Templates personalizables

### Fase 5: Optimización y Testing (Semana 7)
- [ ] **Testing Completo**
  - Tests unitarios
  - Tests de integración
  - Tests de API
  - Coverage mínimo 80%

- [ ] **Performance y Seguridad**
  - Rate limiting
  - CORS configuration
  - Helmet security
  - Input validation
  - SQL injection protection

- [ ] **Documentación**
  - Swagger/OpenAPI docs
  - README del backend
  - Guías de deployment
  - Troubleshooting

## 🔌 Endpoints Principales

### Autenticación
```typescript
// POST /api/auth/register
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/logout
// POST /api/auth/refresh
// POST /api/auth/forgot-password
// POST /api/auth/reset-password
```

### Productos
```typescript
// GET /api/products
interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'name' | 'price' | 'created_at';
  order?: 'asc' | 'desc';
}

// GET /api/products/:id
// POST /api/products (admin)
// PUT /api/products/:id (admin)
// DELETE /api/products/:id (admin)
```

### Carrito
```typescript
// GET /api/cart
// POST /api/cart/add
interface AddToCartRequest {
  productId: number;
  quantity: number;
  variantId?: number;
}

// PUT /api/cart/update/:itemId
// DELETE /api/cart/remove/:itemId
// DELETE /api/cart/clear
```

### Pedidos
```typescript
// POST /api/orders
interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
    variantId?: number;
  }>;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: 'paypal' | 'mercadopago';
  couponCode?: string;
}

// GET /api/orders
// GET /api/orders/:id
// PUT /api/orders/:id/status (admin)
```

### Usuarios
```typescript
// GET /api/user/profile
// PUT /api/user/profile
// GET /api/user/orders
// GET /api/user/favorites
// POST /api/user/favorites
// DELETE /api/user/favorites/:productId
```

## 🗄️ Estructura de Base de Datos

### Modelos Prisma
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                    Int       @id @default(autoincrement())
  name                  String
  email                 String    @unique
  passwordHash          String
  role                  Role      @default(USER)
  phone                 String?
  avatarUrl             String?
  isActive              Boolean   @default(true)
  emailVerified         Boolean   @default(false)
  emailVerificationToken String?
  passwordResetToken    String?
  passwordResetExpires  DateTime?
  preferences           Json      @default("{}")
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  addresses            Address[]
  orders               Order[]
  cartItems            CartItem[]
  favorites            Favorite[]
  reviews              Review[]
  notifications        Notification[]

  @@map("users")
}

model Product {
  id                Int       @id @default(autoincrement())
  name              String
  slug              String    @unique
  description       String?
  longDescription   String?
  price             Decimal   @db.Decimal(10, 2)
  originalPrice     Decimal?  @db.Decimal(10, 2)
  costPrice         Decimal?  @db.Decimal(10, 2)
  sku               String?   @unique
  barcode           String?
  categoryId        Int?
  brand             String?
  weight            Decimal?  @db.Decimal(8, 2)
  dimensions        Json?
  stockQuantity     Int       @default(0)
  minStockQuantity  Int       @default(5)
  maxStockQuantity  Int?
  isActive          Boolean   @default(true)
  isFeatured        Boolean   @default(false)
  isOnSale          Boolean   @default(false)
  salePercentage    Int?
  tags              String[]
  specifications    Json?
  seoTitle          String?
  seoDescription    String?
  seoKeywords       String[]
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  category          Category? @relation(fields: [categoryId], references: [id])
  images            ProductImage[]
  variants          ProductVariant[]
  cartItems         CartItem[]
  orderItems        OrderItem[]
  favorites         Favorite[]
  reviews           Review[]

  @@map("products")
}

// ... más modelos
```

## 🔧 Configuración del Proyecto

### package.json
```json
{
  "name": "one-baby-shop-backend",
  "version": "1.0.0",
  "description": "Backend API for One Baby Shop e-commerce",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "nodemailer": "^6.9.7",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/nodemailer": "^6.4.14",
    "@types/jest": "^29.5.8",
    "@types/supertest": "^2.0.16",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## 🧪 Testing Strategy

### Tests Unitarios
```typescript
// tests/controllers/product.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

describe('Product Controller', () => {
  beforeEach(async () => {
    await prisma.product.deleteMany();
  });

  describe('GET /api/products', () => {
    it('should return paginated products', async () => {
      // Create test products
      await prisma.product.createMany({
        data: [
          { name: 'Product 1', slug: 'product-1', price: 29.99 },
          { name: 'Product 2', slug: 'product-2', price: 39.99 }
        ]
      });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(2);
    });
  });
});
```

### Tests de Integración
```typescript
// tests/integration/auth.test.ts
describe('Authentication Flow', () => {
  it('should register, login, and access protected route', async () => {
    // Register
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201);

    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200);

    const token = loginResponse.body.data.token;

    // Access protected route
    await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```

## 🚀 Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/one_baby_shop
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=one_baby_shop
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 📊 Monitoreo y Logs

### Winston Logger
```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'one-baby-shop-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## 🔒 Seguridad

### Middleware de Seguridad
```typescript
// src/middleware/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

export const securityMiddleware = [
  helmet(),
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
];
```

## 📈 Performance

### Caching con Redis
```typescript
// src/services/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheService = {
  async get(key: string) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string) {
    await redis.del(key);
  }
};
```

---

**Este plan proporciona una base sólida para desarrollar un backend robusto y escalable para One Baby Shop. 🚀** 