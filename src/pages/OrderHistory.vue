<template>
  <div class="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="font-heading text-4xl font-bold text-center text-white mb-10">Mis pedidos</h1>
      <div class="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <OrderList />
        <OrderDetail v-if="selectedOrder" :order="selectedOrder" @close="selectedOrder = null" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrderList from '@/components/OrderList.vue'
import OrderDetail from '@/components/OrderDetail.vue'

const selectedOrder = ref(null)
</script> 