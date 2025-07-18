<template>
  <div class="mb-8">
    <h2 class="font-heading text-2xl font-bold text-purple-700 mb-4">Resumen de tu carrito</h2>
    <!-- Aquí se mostrarán los productos del carrito -->
    <div class="bg-gray-50 rounded-xl p-4 mb-2 flex flex-col gap-2">
      <div class="flex justify-between items-center" v-for="item in cartItems" :key="item.id">
        <div>
          <div class="font-semibold">{{ item.name }}</div>
          <div class="text-xs text-gray-500">Cantidad: {{ item.quantity }}</div>
        </div>
        <div class="font-bold text-purple-700">${{ item.price * item.quantity }}</div>
      </div>
    </div>
    <div class="flex justify-between items-center mt-4">
      <span class="font-bold text-gray-700">Total</span>
      <span class="font-bold text-2xl text-purple-700">${{ total }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Simulación de carrito, reemplazar por store real
const cartItems = ref([
  { id: 1, name: 'Pañales Premium', quantity: 2, price: 29.99 },
  { id: 2, name: 'Juguete Sensorial', quantity: 1, price: 15.99 }
])
const total = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2))
</script> 