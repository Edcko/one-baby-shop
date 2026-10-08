import 'dotenv/config'
import argon2 from 'argon2'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function normalizeSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

/** Demo catalog from the frontend's src/data/products.json (F4 replaces this with the admin CRUD). */
const seedProducts: {
  name: string
  slug: string
  description: string
  priceCents: number
  categorySlug: string
  sku: string
  stock: number
  image: string
  featured?: boolean
}[] = [
  {
    name: 'Pañales Premium',
    slug: 'panales-premium',
    description: 'Pañales ultra absorbentes para bebés de 0-6 meses',
    priceCents: 2999,
    categorySlug: 'panales',
    sku: 'PAN-001',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    name: 'Ropa Interior Bebé',
    slug: 'ropa-interior-bebe',
    description: 'Pack de 5 bodys de algodón 100% orgánico',
    priceCents: 2450,
    categorySlug: 'ropa',
    sku: 'ROP-002',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    name: 'Juguete Educativo',
    slug: 'juguete-educativo',
    description: 'Pelota texturizada para estimulación sensorial',
    priceCents: 1599,
    categorySlug: 'juguetes',
    sku: 'JUG-003',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    name: 'Biberón Anti-cólicos',
    slug: 'biberon-anticolicos',
    description: 'Biberón con sistema anti-cólicos y anti-reflujo',
    priceCents: 1875,
    categorySlug: 'alimentacion',
    sku: 'ALI-004',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    featured: true,
  },
  {
    name: 'Toallitas Húmedas',
    slug: 'toallitas-humedas',
    description: 'Pack de 80 toallitas hipoalergénicas sin fragancia',
    priceCents: 1299,
    categorySlug: 'higiene',
    sku: 'HIG-005',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=600&fit=crop',
  },
  {
    name: 'Manta de Algodón',
    slug: 'manta-de-algodon',
    description: 'Manta suave y cálida para arrullar a tu bebé',
    priceCents: 3200,
    categorySlug: 'ropa',
    sku: 'ROP-006',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
  },
  {
    name: 'Sonajero Musical',
    slug: 'sonajero-musical',
    description: 'Sonajero con luces y música para estimular al bebé',
    priceCents: 2250,
    categorySlug: 'juguetes',
    sku: 'JUG-007',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop',
  },
  {
    name: 'Crema para Pañal',
    slug: 'crema-para-panal',
    description: 'Crema protectora para prevenir irritaciones',
    priceCents: 899,
    categorySlug: 'higiene',
    sku: 'HIG-008',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
  },
]

async function main() {
  console.log('🌱 Seeding One Baby Shop…')

  const categories = [
    { name: 'Pañales', slug: 'panales', sortOrder: 1 },
    { name: 'Ropa', slug: 'ropa', sortOrder: 2 },
    { name: 'Juguetes', slug: 'juguetes', sortOrder: 3 },
    { name: 'Alimentación', slug: 'alimentacion', sortOrder: 4 },
    { name: 'Higiene', slug: 'higiene', sortOrder: 5 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, sortOrder: category.sortOrder },
      create: category,
    })
  }

  for (const product of seedProducts) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.categorySlug },
    })

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        categoryId: category.id,
        stockQuantity: product.stock,
        isFeatured: product.featured ?? false,
        searchText: normalizeSearch(`${product.name} ${product.description}`),
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceCents: product.priceCents,
        categoryId: category.id,
        sku: product.sku,
        stockQuantity: product.stock,
        isFeatured: product.featured ?? false,
        searchText: normalizeSearch(`${product.name} ${product.description}`),
        images: {
          create: { imageUrl: product.image, altText: product.name, isPrimary: true },
        },
      },
    })
  }

  // Feature flag: CFDI invoicing off at launch (F9 flips it)
  await prisma.setting.upsert({
    where: { key: 'requireInvoiceData' },
    update: {},
    create: { key: 'requireInvoiceData', value: false },
  })

  // Admin account — ONLY when ADMIN_EMAIL/ADMIN_PASSWORD are set in .env.
  // No hardcoded credentials in source (that was the original sin of the
  // fake frontend store). Generate a strong one with:
  //   openssl rand -base64 16
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminEmail && adminPassword) {
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (!existing) {
      await prisma.user.create({
        data: {
          firstName: 'Admin',
          lastName: 'One Baby Shop',
          email: adminEmail,
          passwordHash: await argon2.hash(adminPassword),
          role: 'ADMIN',
          emailVerified: true,
        },
      })
      console.log(`👤 Admin creado: ${adminEmail}`)
    } else if (existing.role !== 'ADMIN') {
      await prisma.user.update({ where: { email: adminEmail }, data: { role: 'ADMIN' } })
      console.log(`👤 Usuario promovido a admin: ${adminEmail}`)
    } else {
      console.log('👤 Admin ya existe — contraseña NO modificada (usa reset-password)')
    }
  } else {
    console.log('👤 ADMIN_EMAIL/ADMIN_PASSWORD no definidos — seed omite el admin')
  }

  const [productCount, categoryCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
  ])
  console.log(`✅ Seed listo: ${categoryCount} categorías, ${productCount} productos`)
}

main()
  .catch((error) => {
    console.error('❌ Seed falló:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
