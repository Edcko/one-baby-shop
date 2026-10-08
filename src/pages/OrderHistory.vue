<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="font-heading text-4xl font-bold text-center text-gray-900 mb-10">Mis pedidos</h1>

      <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div v-if="loading" class="py-12 text-center text-gray-400">Cargando pedidos…</div>

        <div v-else-if="orders.length === 0" class="text-center py-12">
          <p class="text-gray-500 mb-4">Aún no tienes pedidos.</p>
          <router-link
            to="/catalog"
            class="inline-block px-6 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700"
            >Ir al catálogo</router-link
          >
        </div>

        <div v-else class="flex flex-col gap-4">
          <div
            v-for="order in orders"
            :key="order.orderNumber"
            class="bg-gray-50 rounded-xl p-5 shadow-sm"
          >
            <div
              class="flex flex-wrap justify-between items-start gap-3 cursor-pointer"
              @click="expanded = expanded === order.orderNumber ? null : order.orderNumber"
            >
              <div>
                <div class="font-semibold text-gray-800">{{ order.orderNumber }}</div>
                <div class="text-xs text-gray-500">
                  {{ new Date(order.createdAt).toLocaleDateString('es-MX', { dateStyle: 'long' }) }}
                  · {{ order.items.length }} artículo(s)
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="text-xs px-3 py-1 rounded-full font-semibold"
                  :class="statusStyles[order.status] ?? 'bg-gray-100 text-gray-600'"
                >
                  {{ statusLabels[order.status] ?? order.status }}
                </span>
                <span class="font-bold text-primary-700 text-lg">{{
                  formatMXN(order.totalCents)
                }}</span>
              </div>
            </div>

            <!-- Detalle expandido -->
            <div v-if="expanded === order.orderNumber" class="mt-4 border-t border-gray-200 pt-4">
              <ul class="space-y-2 mb-4">
                <li
                  v-for="item in order.items"
                  :key="item.productName"
                  class="flex justify-between text-sm text-gray-700"
                >
                  <span>{{ item.quantity }} × {{ item.productName }}</span>
                  <span class="font-medium">{{ formatMXN(item.totalPriceCents) }}</span>
                </li>
              </ul>

              <div class="text-sm text-gray-600 space-y-1 mb-4">
                <div class="flex justify-between">
                  <span>Subtotal</span><span>{{ formatMXN(order.subtotalCents) }}</span>
                </div>
                <div class="flex justify-between text-gray-400">
                  <span>IVA incluido</span><span>{{ formatMXN(order.ivaCents) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Envío</span>
                  <span>{{
                    order.shippingCents === 0 ? 'Gratis' : formatMXN(order.shippingCents)
                  }}</span>
                </div>
                <div
                  class="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1"
                >
                  <span>Total</span><span>{{ formatMXN(order.totalCents) }}</span>
                </div>
              </div>

              <p class="text-xs text-gray-500 mb-4">
                Envío a: {{ order.shippingAddress.recipientName }} ·
                {{ order.shippingAddress.street }} {{ order.shippingAddress.exteriorNumber }},
                {{ order.shippingAddress.colonia }}, {{ order.shippingAddress.state }} · CP
                {{ order.shippingAddress.postalCode }}
              </p>

              <div class="flex gap-2">
                <button
                  v-if="order.status === 'PENDING_PAYMENT'"
                  @click.stop="payOrder(order)"
                  :disabled="paying === order.orderNumber"
                  class="px-4 py-2 rounded-lg bg-secondary-600 text-white font-medium hover:bg-secondary-700 transition-colors disabled:opacity-50"
                >
                  {{ paying === order.orderNumber ? 'Redirigiendo…' : 'Pagar' }}
                </button>
                <button
                  v-if="order.status === 'PENDING_PAYMENT'"
                  @click.stop="cancelOrder(order)"
                  :disabled="cancelling === order.orderNumber"
                  class="px-4 py-2 rounded-lg border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {{ cancelling === order.orderNumber ? 'Cancelando…' : 'Cancelar pedido' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import { useToastStore } from '@/store/toast'
import { formatMXN } from '@/utils/money'

const toastStore = useToastStore()
const route = useRoute()

const orders = ref([])
const loading = ref(true)
const expanded = ref(null)
const cancelling = ref(null)
const paying = ref(null)

const statusLabels = {
  PENDING_PAYMENT: 'Pendiente de pago',
  PAID: 'Pagado',
  PROCESSING: 'Preparando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Expirado',
  REFUNDED: 'Reembolsado',
}

const statusStyles = {
  PENDING_PAYMENT: 'bg-amber-100 text-amber-700',
  PAID: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-200 text-gray-600',
  EXPIRED: 'bg-gray-200 text-gray-600',
  REFUNDED: 'bg-red-100 text-red-700',
}

onMounted(async () => {
  // Retorno de Mercado Pago (back_urls)
  const outcome = route.query.payment
  if (outcome === 'success')
    toastStore.success(
      '¡Pago recibido!',
      'Estamos confirmando tu pago; el estado se actualizará en breve.'
    )
  if (outcome === 'failure')
    toastStore.error('Pago rechazado', 'Puedes reintentar el pago desde este listado.')
  if (outcome === 'pending')
    toastStore.info('Pago en proceso', 'Te avisaremos cuando se acredite (tarda según el método).')

  const response = await api('/orders?limit=50')
  if (response.ok) orders.value = response.data.data.orders
  loading.value = false
})

async function payOrder(order) {
  paying.value = order.orderNumber
  try {
    const response = await api(`/orders/${order.orderNumber}/payment`, { method: 'POST' })
    if (response.ok && response.data?.data?.initPoint) {
      window.location.href = response.data.data.initPoint
      return
    }
    toastStore.warning(
      'Pago no disponible aún',
      response.data?.message ?? 'Mercado Pago no está configurado.'
    )
  } finally {
    paying.value = null
  }
}

async function cancelOrder(order) {
  cancelling.value = order.orderNumber
  try {
    const response = await api(`/orders/${order.orderNumber}/cancel`, { method: 'POST' })
    if (response.ok) {
      order.status = 'CANCELLED'
      toastStore.info('Pedido cancelado', 'El inventario reservado regresó a la tienda.')
    } else {
      toastStore.error('No se pudo cancelar', response.data?.message ?? 'Inténtalo de nuevo.')
    }
  } finally {
    cancelling.value = null
  }
}
</script>
