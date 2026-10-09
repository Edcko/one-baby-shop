<template>
  <div class="min-h-screen flex bg-gray-50">
    <aside class="w-64 bg-gray-100 p-4 hidden md:block">
      <AdminSidebar />
    </aside>
    <main class="flex-1 p-8">
      <h2 class="text-2xl font-heading font-bold mb-4">Usuarios</h2>

      <div class="bg-white rounded-xl shadow overflow-x-auto">
        <table class="w-full text-sm" v-if="!loading">
          <thead class="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th class="px-4 py-3">Usuario</th>
              <th class="px-4 py-3">Rol</th>
              <th class="px-4 py-3">Pedidos</th>
              <th class="px-4 py-3">Verificado</th>
              <th class="px-4 py-3">Alta</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <p class="font-medium text-gray-800">{{ user.name }}</p>
                <p class="text-xs text-gray-400">{{ user.email }}</p>
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-xs px-2 py-1 rounded-full font-semibold"
                  :class="
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{ user.role === 'ADMIN' ? 'Admin' : 'Cliente' }}
                </span>
              </td>
              <td class="px-4 py-3">{{ user.orderCount }}</td>
              <td class="px-4 py-3">
                <span :class="user.emailVerified ? 'text-green-600' : 'text-gray-400'">
                  {{ user.emailVerified ? '✓' : '—' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-500">
                {{ new Date(user.createdAt).toLocaleDateString('es-MX') }}
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
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import AdminSidebar from '@/components/AdminSidebar.vue'

const users = ref([])
const loading = ref(true)

onMounted(async () => {
  const response = await api('/admin/users?limit=50')
  if (response.ok) users.value = response.data.data.users
  loading.value = false
})
</script>
