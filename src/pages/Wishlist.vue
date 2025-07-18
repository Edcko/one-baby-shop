<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-heading font-bold mb-8">Mis Favoritos</h1>
      <div v-if="favoriteProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        <ProductCard
          v-for="product in favoriteProducts"
          :key="product.id"
          :id="product.id"
          :image="product.image"
          :title="product.name"
          :description="product.description"
          :price="product.price"
          :category="product.category"
          :rating="product.rating"
          :reviewCount="product.reviewCount"
        />
      </div>
      <div v-else class="text-center py-16">
        <h3 class="text-xl font-bold text-gray-800 mb-2">No tienes productos favoritos</h3>
        <p class="text-gray-600 mb-6">Agrega productos a tu lista de favoritos para verlos aquí.</p>
        <RouterLink to="/catalog" class="btn btn-primary">Ir al catálogo</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import ProductCard from '@/components/ProductCard.vue'
import products from '@/data/products.json'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()

const favoriteProducts = computed(() => {
  return products.filter(p => userStore.favorites.includes(p.id))
})
</script> 