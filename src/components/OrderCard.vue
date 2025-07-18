<template>
  <div class="bg-gray-50 rounded-xl p-4 flex justify-between items-center shadow hover:shadow-lg transition cursor-pointer">
    <div>
      <div class="font-semibold">Pedido #{{ order.id }}</div>
      <div class="text-xs text-gray-500">Fecha: {{ order.date }}</div>
      <div class="text-xs text-gray-500">Estado: {{ order.status }}</div>
    </div>
    <div class="font-bold text-purple-700 text-lg">${{ order.total }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: { type: Object, required: true }
})
</script> 