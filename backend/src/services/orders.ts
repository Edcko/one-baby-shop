import { randomBytes } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import type { Prisma, Order, OrderItem } from '../../generated/prisma/client.js'
import { ApiError } from '../errors.js'

/**
 * Order creation with TRANSACTIONAL stock reservation (F5).
 *
 * Why reservation instead of a stock decrement: OXXO/SPEI payments confirm
 * hours or days later (or never). We hold inventory (reservedQuantity) for
 * RESERVATION_TTL_HOURS; F6's webhook converts reservation → real decrement
 * on payment, and the expiry sweeper (or explicit cancel) releases it.
 */

export const RESERVATION_TTL_HOURS = 72

// Shipping policy (MXN centavos). Free over threshold — advertised store-wide.
export const SHIPPING_FLAT_CENTS = Number(process.env.SHIPPING_FLAT_CENTS ?? 9900)
export const FREE_SHIPPING_THRESHOLD_CENTS = Number(
  process.env.FREE_SHIPPING_THRESHOLD_CENTS ?? 50000
)

export type MexicanAddress = {
  street: string
  exteriorNumber: string
  interiorNumber?: string | null
  colonia: string
  municipality: string
  state: string
  postalCode: string
  references?: string | null
  phone: string
  recipientName: string
}

function generateOrderNumber(): string {
  const date = new Date()
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate()
  ).padStart(2, '0')}`
  return `OBS-${stamp}-${randomBytes(3).toString('hex').toUpperCase()}`
}

const IVA_RATE_BY_ENUM: Record<string, number> = { ZERO: 0, EIGHT: 8, SIXTEEN: 16 }

/** IVA included in a gross price: gross - gross/(1+rate). */
function ivaPartOfGross(grossCents: number, ivaRate: string): number {
  const rate = IVA_RATE_BY_ENUM[ivaRate] ?? 16
  return Math.round(grossCents - grossCents / (1 + rate / 100))
}

export type OrderWithItems = Order & { items: OrderItem[] }

/** Creates an order from the user's server cart, reserving stock atomically. */
export async function createOrderFromCart(
  fastify: FastifyInstance,
  userId: number,
  shippingAddress: MexicanAddress
): Promise<OrderWithItems> {
  return fastify.prisma.$transaction(async (tx) => {
    const cartLines = await tx.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    })

    if (cartLines.length === 0) {
      throw ApiError.badRequest('Tu carrito está vacío')
    }

    // 1) Reserve stock per line — atomic conditional UPDATE. Zero rows
    //    updated means not enough availability → whole transaction aborts.
    for (const line of cartLines) {
      if (!line.product.isActive) {
        throw ApiError.conflict(`"${line.product.name}" ya no está disponible`)
      }
      const updated = await tx.$executeRaw`
        UPDATE "Product"
        SET "reservedQuantity" = "reservedQuantity" + ${line.quantity}
        WHERE "id" = ${line.productId}
          AND "stockQuantity" - "reservedQuantity" >= ${line.quantity}
      `
      if (updated === 0) {
        throw ApiError.conflict(
          `No hay suficiente stock de "${line.product.name}" (disponible: ${
            line.product.stockQuantity - line.product.reservedQuantity
          })`
        )
      }
    }

    // 2) Totals — computed from DB prices ONLY. The client never sends money.
    let subtotalCents = 0
    let ivaCents = 0
    for (const line of cartLines) {
      const lineTotal = line.product.priceCents * line.quantity
      subtotalCents += lineTotal
      ivaCents += ivaPartOfGross(lineTotal, line.product.ivaRate)
    }
    const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS
    const totalCents = subtotalCents + shippingCents

    const expiresAt = new Date(Date.now() + RESERVATION_TTL_HOURS * 60 * 60 * 1000)

    // 3) Order + item snapshots (price/name frozen at purchase time).
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        status: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        paymentProvider: 'MERCADO_PAGO',
        subtotalCents,
        ivaCents,
        shippingCents,
        totalCents,
        currency: 'MXN',
        expiresAt,
        shippingAddressSnapshot: shippingAddress as unknown as Prisma.InputJsonValue,
        items: {
          create: cartLines.map((line) => ({
            productId: line.productId,
            productName: line.product.name,
            productSku: line.product.sku,
            quantity: line.quantity,
            unitPriceCents: line.product.priceCents,
            totalPriceCents: line.product.priceCents * line.quantity,
            ivaRate: line.product.ivaRate,
          })),
        },
      },
      include: { items: true },
    })

    // 4) Cart emptied — the lines became an order.
    await tx.cartItem.deleteMany({ where: { userId } })

    return order
  })
}

/** Cancels a PENDING_PAYMENT order and releases its reservation. Idempotent. */
export async function cancelPendingOrder(
  fastify: FastifyInstance,
  userId: number,
  orderNumber: string
): Promise<OrderWithItems> {
  return fastify.prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    })

    if (!order || order.userId !== userId) throw ApiError.notFound('Pedido no encontrado')
    if (order.status !== 'PENDING_PAYMENT') {
      throw ApiError.conflict('Solo los pedidos pendientes de pago pueden cancelarse')
    }

    for (const item of order.items) {
      if (item.productId === null) continue
      await tx.$executeRaw`
        UPDATE "Product"
        SET "reservedQuantity" = GREATEST("reservedQuantity" - ${item.quantity}, 0)
        WHERE "id" = ${item.productId}
      `
    }

    return tx.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED', paymentStatus: 'EXPIRED' },
      include: { items: true },
    })
  })
}
