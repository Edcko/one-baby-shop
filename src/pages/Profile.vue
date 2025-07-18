<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent py-16">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
      <h1 class="font-heading text-3xl font-bold text-center text-purple-700 mb-8">Mi perfil</h1>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <div class="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">{{ user.firstName }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <div class="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">{{ user.lastName }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div class="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">{{ user.email }}</div>
        </div>
        <button @click="logout" class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium text-lg shadow-lg transform hover:scale-105 mt-6">Cerrar sesión</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const user = userStore.user
const router = useRouter()

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script> 