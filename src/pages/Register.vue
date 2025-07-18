<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent py-16">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
      <h1 class="font-heading text-3xl font-bold text-center text-purple-700 mb-8">Crear cuenta</h1>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input v-model="form.firstName" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Tu nombre" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
            <input v-model="form.lastName" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Tu apellido" required />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input v-model="form.email" type="email" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="tu@email.com" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input v-model="form.password" type="password" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Contraseña" required minlength="6" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
          <input v-model="form.confirmPassword" type="password" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Repite la contraseña" required minlength="6" />
        </div>
        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
        <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium text-lg shadow-lg transform hover:scale-105">Crear cuenta</button>
        <p class="text-center text-sm text-gray-500 mt-4">¿Ya tienes cuenta? <router-link to="/login" class="text-purple-600 font-semibold hover:underline">Inicia sesión</router-link></p>
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
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await userStore.register(form.value)
    if (result.success) {
      // El toast ya se muestra desde el store
      router.push('/profile')
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'Error al registrar usuario'
  } finally {
    loading.value = false
  }
}
</script> 