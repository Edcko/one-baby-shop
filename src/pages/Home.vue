<template>
  <div class="min-h-screen">
    <!-- Hero: el video es la tesis — papás reales doblando ropa de bebé real -->
    <section class="relative overflow-hidden min-h-[92vh] flex items-center">
      <div class="absolute inset-0">
        <video
          ref="heroVideo"
          class="w-full h-full object-cover"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          aria-hidden="true"
          tabindex="-1"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <!-- Legibilidad: tinte morado de marca, más denso donde vive el texto -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/60 to-secondary-900/25"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-primary-950/55 via-transparent to-black/10"
        ></div>
      </div>

      <div class="container mx-auto px-4 relative z-10 py-28">
        <div class="max-w-2xl">
          <span
            class="hero-rise inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 px-4 py-1.5 text-sm font-semibold text-amber-200 mb-6"
          >
            🚚 Envío gratis desde $500 MXN
          </span>

          <h1
            class="hero-rise font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6"
          >
            Cada prenda,
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300"
              >doblada con amor</span
            >
          </h1>

          <p class="hero-rise text-lg md:text-xl text-white/85 leading-relaxed mb-10 max-w-xl">
            Ropa, pañales y todo lo que tu bebé necesita — elegido con el mismo cuidado con el que
            lo guardarías tú.
          </p>

          <div class="hero-rise flex flex-wrap gap-4">
            <router-link
              to="/catalog"
              class="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Explorar productos
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </router-link>
            <button
              @click="scrollToCategories"
              class="inline-flex items-center gap-2 border-2 border-white/70 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Ver categorías
              <svg
                class="w-5 h-5 animate-bounce-soft"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Indicador de scroll -->
      <div
        class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 text-xs tracking-widest uppercase"
      >
        desliza
        <div class="mx-auto mt-2 w-px h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
      </div>
    </section>

    <!-- Categorías destacadas -->
    <section id="categorias" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-heading text-4xl font-bold text-gray-800 mb-4">Categorías populares</h2>
          <p class="text-gray-600 text-lg">
            Encuentra todo lo que necesitas organizado por categorías
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div
              class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"
            ></div>
            <div class="relative z-10">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110"
              >
                <svg
                  v-if="category.name === 'Pañales'"
                  class="w-8 h-8 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <svg
                  v-else-if="category.name === 'Ropa'"
                  class="w-8 h-8 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <svg
                  v-else-if="category.name === 'Juguetes'"
                  class="w-8 h-8 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-8 h-8 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 class="font-heading text-xl font-bold text-white mb-2">{{ category.name }}</h3>
              <p class="text-white/80 text-sm">{{ category.productCount }} productos</p>
            </div>
            <!-- Efecto de brillo -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Productos destacados -->
    <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-heading text-4xl font-bold text-gray-800 mb-4">Productos destacados</h2>
          <p class="text-gray-600 text-lg">Los favoritos de nuestros clientes</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(product, index) in featuredProducts"
            :key="index"
            class="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            <div class="relative overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute top-4 right-4">
                <div
                  v-if="discountOf(product)"
                  class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                >
                  -{{ discountOf(product) }}%
                </div>
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-purple-600 font-medium uppercase tracking-wide">{{
                  product.category
                }}</span>
                <div class="flex text-yellow-400">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    ></path>
                  </svg>
                </div>
              </div>

              <h3 class="font-heading text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {{ product.name }}
              </h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-bold text-purple-600">{{
                    formatMXN(product.priceCents)
                  }}</span>
                  <span
                    v-if="product.originalPriceCents"
                    class="text-sm text-gray-400 line-through"
                    >{{ formatMXN(product.originalPriceCents) }}</span
                  >
                </div>

                <button
                  @click.stop="addToCart(product)"
                  class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    ></path>
                  </svg>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de beneficios -->
    <section class="py-16 bg-gradient-to-br from-primary to-secondary">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-heading text-4xl font-bold text-gray-800 mb-4">¿Por qué elegirnos?</h2>
          <p class="text-gray-700 text-lg">Ofrecemos la mejor experiencia para tu bebé</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(benefit, index) in benefits" :key="index" class="text-center group">
            <div class="relative w-24 h-24 mx-auto mb-6">
              <div
                class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300"
              ></div>
              <div
                class="relative bg-gradient-to-br from-white to-gray-50 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 border border-white/20"
              >
                <svg
                  v-if="benefit.title === 'Envío Gratis'"
                  class="w-12 h-12 text-purple-600 drop-shadow-sm"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
                <svg
                  v-else-if="benefit.title === 'Garantía de Calidad'"
                  class="w-12 h-12 text-purple-600 drop-shadow-sm"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-12 h-12 text-purple-600 drop-shadow-sm"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <!-- Efecto de brillo -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full"
              ></div>
            </div>
            <h3
              class="font-heading text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300"
            >
              {{ benefit.title }}
            </h3>
            <p class="text-gray-700 leading-relaxed">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useCartStore } from '@/store/cart'
import { useToastStore } from '@/store/toast'
import { formatMXN } from '@/utils/money'

const cartStore = useCartStore()
const toastStore = useToastStore()

// Hero video — real people folding real baby clothes (Coverr, free license)
const heroVideo = ref(null)

function scrollToCategories() {
  document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  // Autoplay is a luxury, not a requirement: users with reduced motion or
  // metered connections get the (nice) poster instead of the video.
  const video = heroVideo.value
  if (!video) return
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = navigator.connection?.saveData === true
  if (reducedMotion || saveData) {
    video.removeAttribute('autoplay')
    video.pause()
  }
})

// Catálogo desde la API (F4) — se muestra lo que hay en la base de datos.
const categories = ref([])
const featuredProducts = ref([])

const discountOf = (product) =>
  product.originalPriceCents && product.originalPriceCents > product.priceCents
    ? Math.round((1 - product.priceCents / product.originalPriceCents) * 100)
    : 0

const addToCart = async (product) => {
  const isNewLine = await cartStore.add(product)
  toastStore.success(
    isNewLine ? 'Producto agregado' : 'Producto actualizado',
    isNewLine
      ? `${product.name} se agregó correctamente al carrito.`
      : `Se agregó otra unidad de ${product.name} al carrito.`
  )
}

onMounted(async () => {
  const [featured, cats] = await Promise.all([
    api('/products?featured=true&limit=4&sort=createdAt&order=desc'),
    api('/categories'),
  ])
  if (featured.ok) featuredProducts.value = featured.data.data.products
  if (cats.ok) categories.value = cats.data.data.categories
})

const benefits = ref([
  {
    title: 'Envío Gratis',
    description: 'Envío gratuito en pedidos superiores a $500 MXN',
  },
  {
    title: 'Garantía de Calidad',
    description: 'Todos nuestros productos tienen garantía de 30 días',
  },
  {
    title: 'Atención 24/7',
    description: 'Soporte al cliente disponible las 24 horas',
  },
])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>

<style scoped>
/* Entrada orquestada del hero: una sola secuencia, luego calma. */
.hero-rise {
  animation: heroRise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hero-rise:nth-of-type(1) {
  animation-delay: 0.05s;
}

/* Delays escalonados por elemento (badge → título → texto → botones) */
h1.hero-rise {
  animation-delay: 0.18s;
}
p.hero-rise {
  animation-delay: 0.34s;
}
div.hero-rise {
  animation-delay: 0.5s;
}

@keyframes heroRise {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* El video respira ligeramente al hacer scroll — sutil, no circo */
@keyframes bounce-soft {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}
.animate-bounce-soft {
  animation: bounce-soft 2.2s ease-in-out infinite;
}

/* prefers-reduced-motion ya está cubierto globalmente (duración 0.01ms) */
</style>
