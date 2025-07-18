<template>
  <div>
    <h2 class="font-heading text-2xl font-bold text-purple-700 mb-4">Historial de pedidos</h2>
    <div v-if="orders.length === 0" class="text-gray-500 text-center py-8">Aún no tienes pedidos.</div>
    <div class="flex flex-col gap-4">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" @click="$emit('select', order)" />
    </div>
  </div>
</template>

<script setup>
import OrderCard from './OrderCard.vue'
// Simulación de pedidos, reemplazar por store real
const orders = [
  { id: 1, date: '2024-06-01', total: 75.97, status: 'Enviado' },
  { id: 2, date: '2024-05-20', total: 39.99, status: 'Entregado' }
]
</script> 