<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Breadcrumb -->
        <div class="px-6 py-4 border-b border-gray-200">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <RouterLink to="/" class="text-gray-700 hover:text-primary">Inicio</RouterLink>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <RouterLink to="/catalog" class="text-gray-700 hover:text-primary">Catálogo</RouterLink>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-500">{{ product.name }}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <!-- Imagen del producto -->
          <div class="space-y-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Información del producto -->
          <div class="space-y-6">
            <div>
              <h1 class="text-3xl font-heading font-bold text-gray-900 mb-2">{{ product.name }}</h1>
              <p class="text-gray-600 text-lg">{{ product.description }}</p>
            </div>

            <!-- Valoración -->
            <div class="flex items-center space-x-4">
              <div class="flex">
                <span v-for="i in 5" :key="i" class="text-yellow-400">
                  <svg v-if="i <= product.rating" class="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <svg v-else class="w-6 h-6 fill-current text-gray-300" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                </span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ product.rating }}</span>
              <span class="text-gray-600">({{ product.reviewCount }} reseñas)</span>
            </div>

            <!-- Precio -->
            <div class="flex items-center space-x-4">
              <span class="text-3xl font-bold text-primary">${{ product.price }}</span>
              <span v-if="product.originalPrice" class="text-xl text-gray-500 line-through">${{ product.originalPrice }}</span>
              <span v-if="product.discount" class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                -{{ product.discount }}%
              </span>
            </div>

            <!-- Botones de acción -->
            <div class="flex space-x-4">
              <button class="btn btn-primary flex-1">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
                Agregar al carrito
              </button>
              <button class="btn btn-outline">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
            </div>

            <!-- Información adicional -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="font-heading font-bold text-lg mb-4">Detalles del producto</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Categoría:</span>
                  <span class="ml-2 text-gray-600">{{ product.category }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">SKU:</span>
                  <span class="ml-2 text-gray-600">#{{ product.id.toString().padStart(4, '0') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reseñas -->
        <div class="border-t border-gray-200 p-6">
          <ProductReviews :productId="product.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductReviews from '@/components/ProductReviews.vue'

const route = useRoute()
const product = ref({})

onMounted(async () => {
  // Simulación de carga de producto
  // En producción, esto vendría de una API
  const products = await import('@/data/products.json')
  const productId = parseInt(route.params.id)
  product.value = products.default.find(p => p.id === productId) || {}
})
</script> 