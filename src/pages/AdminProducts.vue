<template>
  <div class="min-h-screen flex">
    <aside class="w-64 bg-gray-100 p-4 hidden md:block">
      <AdminSidebar />
    </aside>
    <main class="flex-1 p-8">
      <h2 class="text-2xl font-heading font-bold mb-4">Gestión de Productos</h2>
      <AdminProductTable />
      <AdminProductForm />
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
import AdminProductTable from '@/components/AdminProductTable.vue'
import AdminProductForm from '@/components/AdminProductForm.vue'
</script> 