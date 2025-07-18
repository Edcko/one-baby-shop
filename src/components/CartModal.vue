<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fadeIn">
        <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
        <h2 class="text-2xl font-bold mb-4 text-purple-700">Tu carrito</h2>
        <div v-if="cartItems.length === 0" class="text-gray-500 text-center py-8">
          <svg class="mx-auto mb-2 w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
          </svg>
          Tu carrito está vacío
        </div>
        <div v-else>
          <ul class="divide-y divide-gray-200 mb-4 max-h-60 overflow-y-auto">
            <li v-for="(item, idx) in cartItems" :key="idx" class="flex items-center gap-4 py-3">
              <img :src="item.image" alt="img" class="w-14 h-14 rounded-lg object-cover border" />
              <div class="flex-1">
                <div class="font-semibold text-gray-800">{{ item.name }}</div>
                <div class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</div>
                <div class="text-sm text-purple-600 font-bold">${{ item.price }}</div>
              </div>
              <button @click="$emit('remove', idx)" class="text-red-500 hover:text-red-700 text-lg">&times;</button>
            </li>
          </ul>
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-lg">Total:</span>
            <span class="text-xl text-purple-700 font-bold">${{ total }}</span>
          </div>
          <div class="flex gap-2">
            <button @click="$emit('clear')" class="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">Vaciar</button>
            <button @click="$emit('checkout')" class="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold hover:from-purple-700 hover:to-purple-800 transition-all">Finalizar compra</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  isOpen: Boolean,
  cartItems: {
    type: Array,
    default: () => []
  }
})

const total = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.animate-fadeIn {
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style> 