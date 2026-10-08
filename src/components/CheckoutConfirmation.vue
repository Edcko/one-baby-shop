<template>
  <div class="text-center py-8">
    <svg
      class="mx-auto mb-4 w-16 h-16 text-amber-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>

    <h2 class="font-heading text-2xl font-bold text-gray-800 mb-2">¡Pedido creado!</h2>
    <p class="text-gray-700 mb-4 max-w-md mx-auto">
      Tu pedido <span class="font-bold">{{ order.orderNumber }}</span> quedó registrado y está
      <span class="font-semibold">pendiente de pago</span>.
    </p>

    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto mb-6 text-left">
      <p class="text-sm text-amber-800">
        <strong v-if="isAsyncPayment">Tu pago se confirma en cuanto lo realices.</strong>
        <strong v-else>Reservamos tu inventario por 72 horas.</strong>
        Si el pago no se concreta en ese plazo, el pedido se cancela automáticamente y el stock
        regresa a la tienda.
      </p>
      <p class="text-2xl font-bold text-gray-900 mt-3">{{ formatMXN(order.totalCents) }}</p>
    </div>

    <button
      @click="$emit('pay')"
      class="inline-block bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:from-secondary-700 hover:to-secondary-800 transition-all"
    >
      Pagar ahora con Mercado Pago
    </button>

    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <router-link
        to="/orders"
        class="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all"
        >Ver mis pedidos</router-link
      >
      <router-link
        to="/catalog"
        class="inline-block border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-primary-300 hover:text-primary-700 transition-all"
        >Seguir comprando</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatMXN } from '@/utils/money'

const props = defineProps({
  order: { type: Object, required: true },
})

defineEmits(['pay'])

// OXXO/SPEI confirm manually later; card/msi confirm at capture time.
const isAsyncPayment = computed(() => !['oxxo', 'spei'].includes(props.order.paymentMethod ?? ''))
</script>
