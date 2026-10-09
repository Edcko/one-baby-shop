<template>
  <div class="min-h-screen flex bg-gray-50">
    <aside class="w-64 bg-gray-100 p-4 hidden md:block">
      <AdminSidebar />
    </aside>
    <main class="flex-1 p-8">
      <h2 class="text-2xl font-heading font-bold mb-4">Pedidos</h2>

      <!-- Filtro por estado -->
      <select
        v-model="statusFilter"
        @change="fetchOrders"
        class="px-4 py-2 mb-4 border border-gray-200 rounded-xl bg-white"
      >
        <option value="">Todos los estados</option>
        <option v-for="(label, value) in statusLabels" :key="value" :value="value">
          {{ label }}
        </option>
      </select>

      <div class="bg-white rounded-xl shadow overflow-x-auto">
        <table class="w-full text-sm" v-if="!loading">
          <thead class="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th class="px-4 py-3">Folio</th>
              <th class="px-4 py-3">Cliente</th>
              <th class="px-4 py-3">Total</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Pago</th>
              <th class="px-4 py-3 text-right">Avanzar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="order in orders" :key="order.orderNumber" class="hover:bg-gray-50 align-top">
              <td class="px-4 py-3">
                <p class="font-medium text-gray-800">{{ order.orderNumber }}</p>
                <p class="text-xs text-gray-400">
                  {{ new Date(order.createdAt).toLocaleDateString('es-MX') }} ·
                  {{ order.itemCount }} art.
                </p>
              </td>
              <td class="px-4 py-3">
                <p>{{ order.customer }}</p>
                <p class="text-xs text-gray-400">{{ order.customerEmail }}</p>
              </td>
              <td class="px-4 py-3 font-bold text-primary-700">
                {{ formatMXN(order.totalCents) }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-xs px-2 py-1 rounded-full font-semibold"
                  :class="statusStyles[order.status] ?? 'bg-gray-100 text-gray-600'"
                >
                  {{ statusLabels[order.status] ?? order.status }}
                </span>
                <p v-if="order.trackingNumber" class="text-xs text-gray-400 mt-1">
                  Guía: {{ order.trackingNumber }}
                </p>
              </td>
              <td class="px-4 py-3 text-xs">
                {{ order.paymentStatus }}<br />
                <span class="text-gray-400">{{ order.paymentMethod ?? '—' }}</span>
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <div v-if="nextAction(order)" class="flex flex-col gap-1 items-end">
                  <button
                    @click="advance(order)"
                    :disabled="busy === order.orderNumber"
                    class="px-3 py-1 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-700 disabled:opacity-50"
                  >
                    {{ busy === order.orderNumber ? '…' : nextAction(order).label }}
                  </button>
                  <input
                    v-if="nextAction(order).to === 'SHIPPED'"
                    v-model="trackingInputs[order.orderNumber]"
                    placeholder="Núm. de guía"
                    class="w-32 px-2 py-1 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <span v-else class="text-xs text-gray-300">—</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="py-12 text-center text-gray-400">Cargando…</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { api } from '@/services/api'
import { useToastStore } from '@/store/toast'
import { formatMXN } from '@/utils/money'
import AdminSidebar from '@/components/AdminSidebar.vue'

const toast = useToastStore()

const orders = ref([])
const loading = ref(true)
const statusFilter = ref('')
const busy = ref(null)
const trackingInputs = reactive({})

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
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-200 text-green-800',
  CANCELLED: 'bg-gray-200 text-gray-600',
  EXPIRED: 'bg-gray-200 text-gray-600',
  REFUNDED: 'bg-red-100 text-red-700',
}

// Máquina de estados (pagos solo por webhook — aquí solo fulfillment)
const NEXT = {
  PAID: { to: 'PROCESSING', label: 'Preparar' },
  PROCESSING: { to: 'SHIPPED', label: 'Marcar enviado' },
  SHIPPED: { to: 'DELIVERED', label: 'Marcar entregado' },
}

function nextAction(order) {
  return NEXT[order.status] ?? null
}

async function fetchOrders() {
  const response = await api(
    `/admin/orders?limit=50${statusFilter.value ? `&status=${statusFilter.value}` : ''}`
  )
  if (response.ok) orders.value = response.data.data.orders
}

onMounted(async () => {
  await fetchOrders()
  loading.value = false
})

async function advance(order) {
  const action = nextAction(order)
  if (!action) return
  busy.value = order.orderNumber
  const body = { status: action.to }
  const tracking = trackingInputs[order.orderNumber]
  if (action.to === 'SHIPPED' && tracking) body.trackingNumber = tracking

  const response = await api(`/admin/orders/${order.orderNumber}/status`, {
    method: 'PUT',
    body,
  })

  busy.value = null
  if (response.ok) {
    toast.success('Pedido actualizado', `${order.orderNumber} → ${statusLabels[action.to]}`)
    await fetchOrders()
  } else {
    toast.error('Transición rechazada', response.data?.message ?? 'Revisa el estado del pedido.')
  }
}
</script>
