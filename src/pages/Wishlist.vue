<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-heading font-bold mb-8">Mis Favoritos</h1>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        <div
          v-for="n in 3"
          :key="n"
          class="bg-white rounded-2xl shadow-lg h-96 animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="favoriteProducts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        <ProductCard
          v-for="product in favoriteProducts"
          :key="product.id"
          :id="product.id"
          :image="product.image"
          :title="product.name"
          :description="product.description"
          :price-cents="product.priceCents"
          :category="product.category ? product.category.name : ''"
          :rating="product.rating"
          :review-count="product.reviewCount"
          :original-price-cents="product.originalPriceCents"
        />
      </div>

      <div v-else class="text-center py-16">
        <h3 class="text-xl font-bold text-gray-800 mb-2">No tienes productos favoritos</h3>
        <p class="text-gray-600 mb-6">Agrega productos a tu lista de favoritos para verlos aquí.</p>
        <RouterLink
          to="/catalog"
          class="inline-block px-6 py-2 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors"
          >Ir al catálogo</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { api } from '@/services/api'
import ProductCard from '@/components/ProductCard.vue'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()

// Products come from the API; favorites ids stay local until the
// favorites endpoint lands (F10).
const products = ref([])
const loading = ref(true)

onMounted(async () => {
  const response = await api('/products?limit=100')
  if (response.ok) products.value = response.data.data.products
  loading.value = false
})

const favoriteProducts = computed(() => {
  return products.value.filter((product) => userStore.favorites.includes(product.id))
})
</script>
