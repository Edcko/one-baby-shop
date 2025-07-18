<template>
  <div v-if="isDevelopment" class="fixed bottom-4 right-4 z-50">
    <!-- Botón para abrir/cerrar DevTools -->
    <button 
      @click="toggleDevTools"
      class="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200"
      :class="{ 'bg-purple-600': isOpen }"
      title="DevTools"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    </button>

    <!-- Panel de DevTools -->
    <div v-if="isOpen" class="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
      <div class="p-4 border-b border-gray-200">
        <h3 class="font-bold text-gray-800">DevTools</h3>
        <p class="text-sm text-gray-600">Herramientas de desarrollo</p>
      </div>

      <div class="p-4 space-y-4">
        <!-- Estado del carrito -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">Carrito</h4>
          <div class="text-sm space-y-1">
            <div>Items: {{ cartItemCount }}</div>
            <div>Total: ${{ cartTotal.toFixed(2) }}</div>
            <button 
              @click="clearCart"
              class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
            >
              Limpiar carrito
            </button>
          </div>
        </div>

        <!-- Estado del usuario -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">Usuario</h4>
          <div class="text-sm space-y-1">
            <div v-if="userStore.user">
              <div>Nombre: {{ userStore.user.firstName }} {{ userStore.user.lastName }}</div>
              <div>Email: {{ userStore.user.email }}</div>
              <div>Favoritos: {{ userStore.favorites.length }}</div>
            </div>
            <div v-else class="text-gray-500">No autenticado</div>
          </div>
        </div>

        <!-- localStorage -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">localStorage</h4>
          <div class="text-sm space-y-1">
            <div>Tamaño: {{ localStorageSize }} bytes</div>
            <div>Disponible: {{ localStorageAvailable ? 'Sí' : 'No' }}</div>
            <button 
              @click="clearLocalStorage"
              class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
            >
              Limpiar localStorage
            </button>
          </div>
        </div>

        <!-- Performance -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">Performance</h4>
          <div class="text-sm space-y-1">
            <div>Memoria: {{ memoryUsage }} MB</div>
            <div>Tiempo de carga: {{ loadTime }}ms</div>
            <button 
              @click="measurePerformance"
              class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
            >
              Medir performance
            </button>
          </div>
        </div>

        <!-- Testing -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">Testing</h4>
          <div class="space-y-2">
            <button 
              @click="testCartValidation"
              class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 w-full"
            >
              Validar carrito
            </button>
            <button 
              @click="testUserValidation"
              class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 w-full"
            >
              Validar usuario
            </button>
            <button 
              @click="simulateError"
              class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 w-full"
            >
              Simular error
            </button>
          </div>
        </div>

        <!-- Logs -->
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">Logs</h4>
          <div class="text-xs bg-gray-100 p-2 rounded max-h-20 overflow-y-auto">
            <div v-for="(log, index) in logs.slice(-5)" :key="index" class="mb-1">
              <span class="text-gray-500">{{ log.time }}</span>
              <span :class="log.type === 'error' ? 'text-red-600' : 'text-gray-700'">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { debug, validateCartItem, validateUser, performanceMonitor, localStorageTest } from '@/utils/debug'

const userStore = useUserStore()
const isDevelopment = import.meta.env.DEV
const isOpen = ref(false)
const logs = ref([])
const loadTime = ref(0)
const memoryUsage = ref(0)

// Computed properties
const cartItemCount = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  return cart.reduce((sum, item) => sum + item.quantity, 0)
})

const cartTotal = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const localStorageSize = computed(() => {
  return localStorageTest.getSize()
})

const localStorageAvailable = computed(() => {
  return localStorageTest.isAvailable()
})

// Methods
const toggleDevTools = () => {
  isOpen.value = !isOpen.value
}

const clearCart = () => {
  localStorage.removeItem('cart')
  addLog('info', 'Carrito limpiado')
  debug.info('Carrito limpiado desde DevTools')
}

const clearLocalStorage = () => {
  localStorage.clear()
  addLog('info', 'localStorage limpiado')
  debug.info('localStorage limpiado desde DevTools')
}

const measurePerformance = async () => {
  performanceMonitor.start('DevTools Performance Test')
  
  // Simular operación costosa
  await new Promise(resolve => setTimeout(resolve, 100))
  
  performanceMonitor.end('DevTools Performance Test')
  addLog('info', 'Performance medida')
}

const testCartValidation = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  const validItems = cart.filter(item => validateCartItem(item))
  const invalidItems = cart.filter(item => !validateCartItem(item))
  
  addLog('info', `Validación carrito: ${validItems.length} válidos, ${invalidItems.length} inválidos`)
  debug.info('Validación de carrito completada', { valid: validItems.length, invalid: invalidItems.length })
}

const testUserValidation = () => {
  const isValid = validateUser(userStore.user)
  addLog(isValid ? 'info' : 'error', `Usuario ${isValid ? 'válido' : 'inválido'}`)
  debug.info('Validación de usuario completada', { isValid })
}

const simulateError = () => {
  addLog('error', 'Error simulado desde DevTools')
  debug.error('Error simulado desde DevTools')
}

const addLog = (type, message) => {
  logs.value.push({
    type,
    message,
    time: new Date().toLocaleTimeString()
  })
  
  // Mantener solo los últimos 50 logs
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(-50)
  }
}

// Lifecycle
onMounted(() => {
  // Medir tiempo de carga
  loadTime.value = performance.now()
  
  // Medir uso de memoria (si está disponible)
  if ('memory' in performance) {
    memoryUsage.value = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
  }
  
  addLog('info', 'DevTools inicializado')
})
</script> 