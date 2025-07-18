<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100 relative">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-purple-600 text-2xl">&times;</button>
      <h2 class="font-heading text-2xl font-bold text-purple-700 mb-4">Detalle del pedido #{{ order.id }}</h2>
      <div class="mb-4 text-sm text-gray-500">Fecha: {{ order.date }} | Estado: {{ order.status }}</div>
      <div class="mb-4">
        <div class="font-semibold mb-2">Productos:</div>
        <ul class="list-disc pl-6">
          <li v-for="item in order.items || []" :key="item.id">
            {{ item.name }} x{{ item.quantity }} - ${{ item.price * item.quantity }}
          </li>
        </ul>
      </div>
      <div class="mb-4">
        <div class="font-semibold">Total:</div>
        <div class="text-lg text-purple-700 font-bold">${{ order.total }}</div>
      </div>
      <div class="mb-2">
        <div class="font-semibold">Dirección de envío:</div>
        <div class="text-gray-700">Calle Falsa 123, Ciudad, CP 12345</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: { type: Object, required: true }
})
</script> 