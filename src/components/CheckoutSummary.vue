<template>
  <div class="mb-8">
    <h2 class="font-heading text-2xl font-bold text-primary-700 mb-6">Resumen del pedido</h2>

    <ul class="divide-y divide-gray-200 mb-4">
      <li v-for="item in items" :key="item.id" class="flex items-center gap-4 py-3">
        <img :src="item.image" :alt="item.name" class="w-14 h-14 rounded-lg object-cover border" />
        <div class="flex-1">
          <div class="font-semibold text-gray-800">{{ item.name }}</div>
          <div class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</div>
        </div>
        <div class="font-bold text-primary-700">
          {{ formatMXN(item.priceCents * item.quantity) }}
        </div>
      </li>
    </ul>

    <div class="bg-gray-50 rounded-xl p-4 space-y-2">
      <div class="flex justify-between text-gray-700">
        <span>Subtotal</span>
        <span>{{ formatMXN(subtotalCents) }}</span>
      </div>
      <div class="flex justify-between text-gray-500 text-sm">
        <span>IVA incluido</span>
        <span>{{ formatMXN(ivaCents) }}</span>
      </div>
      <div class="flex justify-between text-gray-700">
        <span>Envío</span>
        <span>{{ shippingCents === 0 ? '¡Gratis!' : formatMXN(shippingCents) }}</span>
      </div>
      <div v-if="shippingCents > 0" class="text-xs text-primary-600">
        Envío gratis en pedidos desde {{ formatMXN(FREE_SHIPPING_THRESHOLD_CENTS) }}
      </div>
      <div
        class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200"
      >
        <span>Total</span>
        <span>{{ formatMXN(totalCents) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatMXN } from '@/utils/money'

defineProps({
  items: { type: Array, required: true },
  subtotalCents: { type: Number, required: true },
  ivaCents: { type: Number, default: 0 },
  shippingCents: { type: Number, default: 0 },
  totalCents: { type: Number, required: true },
})

// Mirror of the server policy — display only; the server recomputes everything.
const FREE_SHIPPING_THRESHOLD_CENTS = 50000
</script>
