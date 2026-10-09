<template>
  <div class="min-h-screen flex bg-gray-50">
    <aside class="w-64 bg-gray-100 p-4 hidden md:block">
      <AdminSidebar />
    </aside>
    <main class="flex-1 p-8 overflow-x-auto">
      <h1 class="text-3xl font-heading font-bold mb-6">Panel de Administración</h1>

      <div v-if="loading" class="py-16 text-center text-gray-400">Cargando métricas…</div>

      <template v-else>
        <!-- Métricas reales -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl shadow">
            <p class="text-sm text-gray-500 mb-1">Ingresos (pagados)</p>
            <p class="text-2xl font-bold text-primary-700">
              {{ formatMXN(dashboard.revenueCents) }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow">
            <p class="text-sm text-gray-500 mb-1">Pedidos por pagar</p>
            <p class="text-2xl font-bold text-amber-600">{{ dashboard.orders.pendingPayment }}</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow">
            <p class="text-sm text-gray-500 mb-1">Pedidos pagados</p>
            <p class="text-2xl font-bold text-green-600">{{ dashboard.orders.paidTotal }}</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow">
            <p class="text-sm text-gray-500 mb-1">Clientes registrados</p>
            <p class="text-2xl font-bold text-gray-800">{{ dashboard.users.total }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <!-- Stock bajo -->
          <div class="bg-white p-6 rounded-xl shadow">
            <h2 class="font-heading text-lg font-bold mb-4 text-red-600">⚠ Stock bajo (≤ 5)</h2>
            <p v-if="dashboard.lowStock.length === 0" class="text-gray-400 text-sm">
              Sin productos en stock crítico.
            </p>
            <ul class="divide-y divide-gray-100">
              <li
                v-for="product in dashboard.lowStock"
                :key="product.id"
                class="flex justify-between py-2 text-sm"
              >
                <span class="text-gray-800">{{ product.name }}</span>
                <span class="font-bold text-red-600">{{ product.available }} disp.</span>
              </li>
            </ul>
          </div>

          <!-- Pedidos recientes -->
          <div class="bg-white p-6 rounded-xl shadow">
            <h2 class="font-heading text-lg font-bold mb-4">Pedidos recientes</h2>
            <p v-if="dashboard.recentOrders.length === 0" class="text-gray-400 text-sm">
              Aún no hay pedidos.
            </p>
            <ul class="divide-y divide-gray-100">
              <li
                v-for="order in dashboard.recentOrders"
                :key="order.orderNumber"
                class="flex justify-between items-center py-2 text-sm"
              >
                <div>
                  <p class="font-medium text-gray-800">{{ order.orderNumber }}</p>
                  <p class="text-xs text-gray-500">
                    {{ order.itemCount }} art. ·
                    {{ new Date(order.createdAt).toLocaleDateString('es-MX') }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-primary-700">{{ formatMXN(order.totalCents) }}</p>
                  <p class="text-xs">{{ statusLabels[order.status] ?? order.status }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { formatMXN } from '@/utils/money'
import AdminSidebar from '@/components/AdminSidebar.vue'

const dashboard = ref(null)
const loading = ref(true)

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

onMounted(async () => {
  const response = await api('/admin/dashboard')
  if (response.ok) dashboard.value = response.data.data
  loading.value = false
})
</script>
