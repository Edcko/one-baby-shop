<template>
  <nav class="flex flex-col space-y-4">
    <RouterLink to="/admin/dashboard" class="font-heading text-lg hover:text-primary">Dashboard</RouterLink>
    <RouterLink to="/admin/products" class="font-heading text-lg hover:text-primary">Productos</RouterLink>
    <RouterLink to="/admin/orders" class="font-heading text-lg hover:text-primary">Pedidos</RouterLink>
    <RouterLink to="/admin/users" class="font-heading text-lg hover:text-primary">Usuarios</RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script> 