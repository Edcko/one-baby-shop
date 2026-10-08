<template>
  <nav class="flex flex-col space-y-4">
    <RouterLink to="/admin/dashboard" class="font-heading text-lg hover:text-primary-700"
      >Dashboard</RouterLink
    >
    <RouterLink to="/admin/products" class="font-heading text-lg hover:text-primary-700"
      >Productos</RouterLink
    >
    <RouterLink to="/admin/orders" class="font-heading text-lg hover:text-primary-700"
      >Pedidos</RouterLink
    >
    <RouterLink to="/admin/users" class="font-heading text-lg hover:text-primary-700"
      >Usuarios</RouterLink
    >
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
