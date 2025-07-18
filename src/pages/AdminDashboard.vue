<template>
  <div class="min-h-screen flex">
    <aside class="w-64 bg-gray-100 p-4 hidden md:block">
      <AdminSidebar />
    </aside>
    <main class="flex-1 p-8">
      <h1 class="text-3xl font-heading font-bold mb-6">Panel de Administración</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded shadow">
          <h3 class="font-heading font-bold text-lg mb-2">Total Productos</h3>
          <p class="text-3xl text-primary">24</p>
        </div>
        <div class="bg-white p-6 rounded shadow">
          <h3 class="font-heading font-bold text-lg mb-2">Pedidos Pendientes</h3>
          <p class="text-3xl text-primary">8</p>
        </div>
        <div class="bg-white p-6 rounded shadow">
          <h3 class="font-heading font-bold text-lg mb-2">Usuarios Registrados</h3>
          <p class="text-3xl text-primary">156</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
</script> 