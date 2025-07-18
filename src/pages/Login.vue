<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent py-16">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
      <h1 class="font-heading text-3xl font-bold text-center text-purple-700 mb-8">Iniciar sesión</h1>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input v-model="form.email" type="email" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="tu@email.com" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input v-model="form.password" type="password" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Contraseña" required minlength="6" />
        </div>
        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
        <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium text-lg shadow-lg transform hover:scale-105">Iniciar sesión</button>
        <p class="text-center text-sm text-gray-500 mt-4">¿No tienes cuenta? <router-link to="/register" class="text-purple-600 font-semibold hover:underline">Regístrate</router-link></p>
        <p class="text-center text-xs mt-2"><router-link to="/forgot-password" class="text-purple-500 hover:underline">¿Olvidaste tu contraseña?</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useToastStore } from '@/store/toast'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await userStore.login(form.value)
    if (result.success) {
      // El toast ya se muestra desde el store
      router.push('/profile')
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script> 