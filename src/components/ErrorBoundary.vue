<template>
  <div v-if="hasError" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md mx-auto text-center">
      <!-- Icono de error -->
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      
      <!-- Mensaje de error -->
      <h1 class="text-2xl font-bold text-gray-900 mb-4">¡Ups! Algo salió mal</h1>
      <p class="text-gray-600 mb-6">
        {{ errorMessage || 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.' }}
      </p>
      
      <!-- Botones de acción -->
      <div class="space-y-3">
        <button 
          @click="retry"
          class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
        >
          Intentar de nuevo
        </button>
        <button 
          @click="goHome"
          class="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
        >
          Volver al inicio
        </button>
      </div>
      
      <!-- Información técnica (solo en desarrollo) -->
      <div v-if="isDevelopment" class="mt-8 p-4 bg-gray-100 rounded-lg text-left">
        <h3 class="font-semibold text-gray-800 mb-2">Información técnica:</h3>
        <pre class="text-xs text-gray-600 overflow-auto">{{ errorDetails }}</pre>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const isDevelopment = import.meta.env.DEV

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  window.location.reload()
}

const goHome = () => {
  router.push('/')
}

onErrorCaptured((error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message || 'Error desconocido'
  errorDetails.value = `${error.stack}\n\nComponent: ${instance?.$options?.name || 'Unknown'}\nInfo: ${info}`
  
  // Log del error para debugging
  console.error('Error capturado:', error)
  console.error('Componente:', instance)
  console.error('Info:', info)
  
  return false // Previene que el error se propague
})
</script> 