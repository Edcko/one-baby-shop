<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <form @submit.prevent="handleLogin" class="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6">
      <h1 class="text-2xl font-heading font-bold text-center">Admin Login</h1>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div>
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="Email" 
          class="input input-bordered w-full" 
          required
        />
      </div>
      
      <div>
        <input 
          v-model="form.password" 
          type="password" 
          placeholder="Contraseña" 
          class="input input-bordered w-full" 
          required
        />
      </div>
      
      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
      
      <div class="text-center text-sm text-gray-600">
        <p>Credenciales de prueba:</p>
        <p>Email: admin@babyshop.com</p>
        <p>Password: admin123</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await userStore.login(form.value)
    if (result.success) {
      if (userStore.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        error.value = 'No tienes permisos de administrador'
      }
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