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
        <!-- Tinta cálida sobre el video (dirección Lino): legible sin morados -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#241C14]/92 via-[#241C14]/60 to-[#241C14]/20"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#241C14]/55 via-transparent to-black/10"
        ></div>
      </div>

      <div class="container mx-auto px-4 relative z-10 py-28">
        <div class="max-w-2xl">
          <span
            class="hero-rise inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 px-4 py-1.5 text-sm font-semibold text-accent-200 mb-6"
          >
            🚚 Envío gratis desde $500 MXN
          </span>

          <h1
            class="hero-rise font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6"
          >
            Cada prenda,
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-accent-200 via-accent-100 to-accent-300"
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
              class="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-accent-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
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

    <!-- Ola: el video se funde con el lino -->
    <div class="-mt-px relative -mb-1" aria-hidden="true">
      <svg
        viewBox="0 0 1440 90"
        class="w-full h-[70px] block -translate-y-px"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 C240,95 480,0 720,35 C960,70 1200,20 1440,55 L1440,90 L0,90 Z"
          fill="#F5F0E8"
        />
      </svg>
    </div>

    <!-- Categorías: foto contextual + acento por paleta + reveal -->
    <section id="categorias" class="relative py-20 bg-linen overflow-hidden">
      <!-- blobs decorativos de paleta -->
      <div
        class="absolute -top-20 -left-24 w-80 h-80 rounded-full bg-terracotta-200/40 blur-3xl float-slow"
        aria-hidden="true"
      ></div>
      <div
        class="absolute -bottom-24 -right-20 w-96 h-96 rounded-full bg-olive-200/40 blur-3xl float-slow-rev"
        aria-hidden="true"
      ></div>

      <div class="container mx-auto px-4 relative">
        <div class="text-center mb-14" v-reveal>
          <span
            class="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary-600 mb-3"
            >explora</span
          >
          <h2 class="font-heading text-4xl md:text-5xl font-bold text-ink mb-4">
            Categorías populares
          </h2>
          <p class="text-ink-soft text-lg">Todo lo que necesitas, organizado por categorías</p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          <router-link
            v-for="(category, index) in categoryCards"
            :key="category.slug"
            v-reveal="index * 90"
            :to="`/catalog?category=${category.slug}`"
            class="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-lg hover:shadow-2xl transition-shadow duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
          >
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.name"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
            />
            <!-- velo de acento por categoría -->
            <div
              class="absolute inset-0 bg-gradient-to-t transition-opacity duration-500 group-hover:opacity-90"
              :class="category.overlay"
            ></div>

            <!-- contador en glass -->
            <span
              class="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30"
            >
              {{ category.productCount }}
              {{ category.productCount === 1 ? 'producto' : 'productos' }}
            </span>

            <div class="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <h3 class="font-heading text-2xl font-bold text-white drop-shadow-md">
                {{ category.name }}
              </h3>
              <p
                class="flex items-center gap-2 text-sm text-white/90 font-semibold mt-1 transition-all duration-300 group-hover:gap-3.5"
              >
                Ver productos
                <svg
                  class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M5 12h14m0 0l-6-6m6 6l-6 6"
                  ></path>
                </svg>
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Productos destacados -->
    <section class="relative py-20 bg-white/60">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-12" v-reveal>
          <div>
            <span
              class="inline-block text-xs font-bold tracking-[0.25em] uppercase text-accent-600 mb-3"
              >los favoritos</span
            >
            <h2 class="font-heading text-4xl md:text-5xl font-bold text-ink">
              Productos destacados
            </h2>
          </div>
          <router-link
            to="/catalog"
            class="group inline-flex items-center gap-2 font-bold text-primary-600 hover:text-primary-700"
          >
            Ver todo
            <svg
              class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M5 12h14m0 0l-6-6m6 6l-6 6"
              ></path>
            </svg>
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <div
            v-for="(product, index) in featuredProducts"
            :key="index"
            v-reveal="index * 110"
            class="group bg-white rounded-3xl shadow-md hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 border border-linen-dark/60"
          >
            <div class="relative overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute top-4 right-4 flex flex-col gap-2">
                <span
                  v-if="discountOf(product)"
                  class="bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg"
                >
                  -{{ discountOf(product) }}%
                </span>
                <span class="bg-accent-400 text-ink text-xs px-3 py-1 rounded-full font-bold shadow"
                  >★ destacado</span
                >
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-primary-600 font-medium uppercase tracking-wide">{{
                  product.category?.name
                }}</span>
                <div class="flex text-accent-400">
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
                  <span class="text-2xl font-bold text-primary-600">{{
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
                  class="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-medium text-sm flex items-center gap-2"
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

    <!-- Marquee de beneficios — ritmo distinto, mismo mensaje -->
    <section class="relative py-4 bg-olive-700 overflow-hidden" aria-label="Beneficios">
      <div
        class="absolute inset-0 bg-gradient-to-r from-olive-800 via-olive-700 to-olive-800"
      ></div>
      <div class="marquee-track relative flex gap-0 whitespace-nowrap">
        <div
          v-for="copy in [0, 1]"
          :key="copy"
          class="flex items-center gap-3 px-5 shrink-0"
          :aria-hidden="copy === 1"
        >
          <template v-for="(benefit, index) in benefits" :key="index">
            <span class="flex items-center gap-3 text-white/95 font-heading font-semibold text-lg">
              <span class="w-2.5 h-2.5 rounded-full bg-accent-400"></span>
              {{ benefit.title }} — {{ benefit.description }}
            </span>
            <span class="text-accent-300/70 text-xl px-2" aria-hidden="true">✦</span>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

// Acento por categoría (paleta Lino): velo con el color de su familia
const ACCENTS = {
  panales: 'from-primary-800/90 via-primary-600/45 to-transparent',
  ropa: 'from-accent-700/90 via-accent-500/40 to-transparent',
  juguetes: 'from-dustblue-dark/90 via-dustblue/45 to-transparent',
  alimentacion: 'from-olive-700/90 via-olive-500/45 to-transparent',
  higiene: 'from-ink/90 via-ink-soft/45 to-transparent',
}

const categoryCards = computed(() =>
  categories.value.map((cat) => ({
    ...cat,
    image: catImages.value[cat.slug] ?? null,
    overlay: ACCENTS[cat.slug] ?? 'from-primary-800/90 via-primary-600/45 to-transparent',
  }))
)

// La foto de cada categoría = la de su primer producto (contexto real)
const catImages = ref({})

onMounted(async () => {
  const [featured, cats] = await Promise.all([
    api('/products?featured=true&limit=4&sort=createdAt&order=desc'),
    api('/categories'),
  ])
  if (featured.ok) featuredProducts.value = featured.data.data.products
  if (cats.ok) categories.value = cats.data.data.categories

  // Una mini-petición por categoría para su imagen representativa
  for (const cat of categories.value) {
    api(`/products?category=${cat.slug}&limit=1`).then((response) => {
      if (response.ok) {
        const first = response.data.data.products[0]
        if (first?.image) catImages.value = { ...catImages.value, [cat.slug]: first.image }
      }
    })
  }
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

<style scoped>
/* ── Scroll reveal (v-reveal) ─────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Blobs flotantes de fondo ─────────────────────────────────────── */
@keyframes floatSlow {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(24px, -18px) scale(1.06);
  }
}
.float-slow {
  animation: floatSlow 14s ease-in-out infinite;
}
.float-slow-rev {
  animation: floatSlow 17s ease-in-out infinite reverse;
}

/* ── Marquee de beneficios ────────────────────────────────────────── */
.marquee-track {
  animation: marqueeScroll 28s linear infinite;
  width: max-content;
}
.marquee-track:hover {
  animation-play-state: paused;
}
@keyframes marqueeScroll {
  to {
    transform: translateX(-50%);
  }
}
</style>
