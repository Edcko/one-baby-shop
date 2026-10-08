<template>
  <!-- Guards: null while loading, false when not found (was a runtime crash:
       template read product.id.toString() before the async data resolved). -->
  <div v-if="product" class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Breadcrumb -->
        <div class="px-6 py-4 border-b border-gray-200">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <RouterLink to="/" class="text-gray-700 hover:text-primary-700">Inicio</RouterLink>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <RouterLink to="/catalog" class="text-gray-700 hover:text-primary-700"
                    >Catálogo</RouterLink
                  >
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    ></path>
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
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
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
                    <path
                      d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                    />
                  </svg>
                  <svg v-else class="w-6 h-6 fill-current text-gray-300" viewBox="0 0 20 20">
                    <path
                      d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                    />
                  </svg>
                </span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ product.rating }}</span>
              <span class="text-gray-600">({{ product.reviewCount }} reseñas)</span>
            </div>

            <!-- Precio -->
            <div class="flex items-center space-x-4">
              <span class="text-3xl font-bold text-primary-700">{{
                formatMXN(product.priceCents)
              }}</span>
              <span v-if="product.originalPriceCents" class="text-xl text-gray-500 line-through">{{
                formatMXN(product.originalPriceCents)
              }}</span>
              <span
                v-if="product.originalPriceCents && product.originalPriceCents > product.priceCents"
                class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium"
              >
                -{{ Math.round((1 - product.priceCents / product.originalPriceCents) * 100) }}%
              </span>
            </div>

            <!-- Disponibilidad -->
            <p v-if="product.available <= 0" class="text-red-600 font-semibold">
              Sin stock disponible
            </p>
            <p v-else-if="product.available <= 5" class="text-amber-600 font-medium">
              ¡Últimas {{ product.available }} unidades!
            </p>

            <!-- Botones de acción -->
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="px-4 py-3 hover:bg-gray-100 text-lg font-bold"
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <span class="px-4 py-3 min-w-[3rem] text-center font-semibold">{{ quantity }}</span>
                <button
                  @click="quantity = Math.min(product.available || 99, quantity + 1)"
                  class="px-4 py-3 hover:bg-gray-100 text-lg font-bold"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <button
                @click="addToCart"
                :disabled="product.available <= 0"
                class="flex-1 min-w-[12rem] bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  ></path>
                </svg>
                {{ product.available <= 0 ? 'Agotado' : 'Agregar al carrito' }}
              </button>
            </div>

            <!-- Información adicional -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="font-heading font-bold text-lg mb-4">Detalles del producto</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Categoría:</span>
                  <span class="ml-2 text-gray-600">{{ product.category?.name }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">SKU:</span>
                  <span class="ml-2 text-gray-600"
                    >#{{ product.id.toString().padStart(4, '0') }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reseñas -->
        <div class="border-t border-gray-200 p-6">
          <ProductReviews :product-id="product.id" />
        </div>
      </div>
    </div>
  </div>

  <!-- Not found -->
  <div v-else-if="loaded" class="min-h-screen bg-gray-50 flex items-center justify-center py-8">
    <div class="text-center">
      <h1 class="text-2xl font-heading font-bold text-gray-800 mb-2">Producto no encontrado</h1>
      <p class="text-gray-600 mb-6">El producto que buscas no existe o ya no está disponible.</p>
      <RouterLink
        to="/catalog"
        class="inline-block px-6 py-2 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors"
      >
        Ir al catálogo
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import { formatMXN } from '@/utils/money'
import { useCartStore } from '@/store/cart'
import { useToastStore } from '@/store/toast'
import ProductReviews from '@/components/ProductReviews.vue'

const route = useRoute()
const cartStore = useCartStore()
const toastStore = useToastStore()

// null = loading, object = loaded, false = not found
const product = ref(null)
const loaded = ref(false)
const quantity = ref(1)

async function load(idOrSlug) {
  product.value = null
  loaded.value = false
  quantity.value = 1

  const response = await api(`/products/${idOrSlug}`)
  product.value = response.ok && response.data?.data ? response.data.data : false
  loaded.value = true
}

const addToCart = async () => {
  if (!product.value) return
  await cartStore.add(product.value, quantity.value)
  toastStore.success(
    'Producto agregado',
    `${quantity.value} × ${product.value.name} se agregaron al carrito.`
  )
}

onMounted(() => load(route.params.id))
// Navegación entre productos (mismo componente, distinto param)
watch(
  () => route.params.id,
  (id) => id && load(id)
)
</script>
