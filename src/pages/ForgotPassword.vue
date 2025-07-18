<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent py-16">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
      <h1 class="font-heading text-3xl font-bold text-center text-purple-700 mb-8">Recuperar contraseña</h1>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input v-model="form.email" type="email" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="tu@email.com" required />
        </div>
        <div v-if="success" class="text-green-600 text-sm text-center">
          Email enviado. Por favor, revisa tu correo electrónico para continuar.
        </div>
        <div v-if="loading" class="text-center text-sm text-gray-500">
          Enviando email...
        </div>
        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
        <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium text-lg shadow-lg transform hover:scale-105" :disabled="loading">
          {{ loading ? 'Enviando...' : 'Enviar instrucciones' }}
        </button>
        <p class="text-center text-sm text-gray-500 mt-4"><router-link to="/login" class="text-purple-600 font-semibold hover:underline">Volver a iniciar sesión</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/store/toast'

const router = useRouter()
const toastStore = useToastStore()

const form = ref({
  email: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    // Simulación de envío de email
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    success.value = true
    toastStore.success(
      'Email enviado', 
      'Te hemos enviado un email con instrucciones para recuperar tu contraseña.'
    )
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err) {
    error.value = 'No se pudo enviar el email. Intenta nuevamente.'
    toastStore.error('Error', 'No se pudo enviar el email. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}
</script> 