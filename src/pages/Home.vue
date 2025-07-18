<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-20">
      <div class="absolute inset-0 bg-black bg-opacity-10"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="font-heading text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Todo para tu
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200">bebé</span>
          </h1>
          <p class="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Descubre productos únicos, seguros y de la más alta calidad para los momentos más especiales de tu bebé
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/catalog" 
              class="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Explorar productos</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </router-link>
            <button class="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300">
              <span>Ver ofertas</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Elementos decorativos -->
      <div class="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
      <div class="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full animate-bounce"></div>
    </section>

    <!-- Categorías destacadas -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-heading text-4xl font-bold text-gray-800 mb-4">Categorías populares</h2>
          <p class="text-gray-600 text-lg">Encuentra todo lo que necesitas organizado por categorías</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="(category, index) in categories" :key="index" 
               class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-purple-400 p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <div class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 mx-auto mb-4 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <svg v-if="category.name === 'Pañales'" class="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <svg v-else-if="category.name === 'Ropa'" class="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <svg v-else-if="category.name === 'Juguetes'" class="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 class="font-heading text-xl font-bold text-white mb-2">{{ category.name }}</h3>
              <p class="text-white/80 text-sm">{{ category.count }} productos</p>
            </div>
            <!-- Efecto de brillo -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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
          <div v-for="(product, index) in featuredProducts" :key="index" 
               class="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div class="relative overflow-hidden">
              <img :src="product.image" :alt="product.name" 
                   class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute top-4 right-4">
                <div v-if="product.discount" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  -{{ product.discount }}%
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-purple-600 font-medium uppercase tracking-wide">{{ product.category }}</span>
                <div class="flex text-yellow-400">
                  <svg v-for="star in 5" :key="star" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
              
              <h3 class="font-heading text-lg font-bold text-gray-800 mb-2 line-clamp-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-bold text-purple-600">${{ product.price }}</span>
                  <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">${{ product.originalPrice }}</span>
                </div>
                
                <button class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
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
          <div v-for="(benefit, index) in benefits" :key="index" 
               class="text-center group">
            <div class="relative w-24 h-24 mx-auto mb-6">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
              <div class="relative bg-gradient-to-br from-white to-gray-50 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 border border-white/20">
                <svg v-if="benefit.title === 'Envío Gratis'" class="w-12 h-12 text-purple-600 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <svg v-else-if="benefit.title === 'Garantía de Calidad'" class="w-12 h-12 text-purple-600 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <svg v-else class="w-12 h-12 text-purple-600 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <!-- Efecto de brillo -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full"></div>
            </div>
            <h3 class="font-heading text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300">{{ benefit.title }}</h3>
            <p class="text-gray-700 leading-relaxed">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Categorías destacadas
const categories = ref([
  {
    name: 'Pañales',
    count: 15
  },
  {
    name: 'Ropa',
    count: 28
  },
  {
    name: 'Juguetes',
    count: 22
  },
  {
    name: 'Alimentación',
    count: 18
  }
])

// Productos destacados
const featuredProducts = ref([
  {
    name: 'Pañales Premium Ultra Absorbentes',
    description: 'Pañales de la más alta calidad con tecnología de absorción avanzada',
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: 'Pañales',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&h=300&fit=crop'
  },
  {
    name: 'Pack Ropa Interior Orgánica',
    description: '5 bodys de algodón 100% orgánico, suaves y seguros para la piel sensible',
    price: 24.50,
    category: 'Ropa',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop'
  },
  {
    name: 'Juguete Educativo Sensorial',
    description: 'Pelota texturizada para estimulación sensorial y desarrollo motor',
    price: 15.99,
    category: 'Juguetes',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=300&fit=crop'
  },
  {
    name: 'Biberón Anti-cólicos Premium',
    description: 'Sistema anti-cólicos y anti-reflujo con tecnología avanzada',
    price: 18.75,
    category: 'Alimentación',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'
  }
])

// Beneficios
const benefits = ref([
  {
    title: 'Envío Gratis',
    description: 'Envío gratuito en pedidos superiores a $50'
  },
  {
    title: 'Garantía de Calidad',
    description: 'Todos nuestros productos tienen garantía de 30 días'
  },
  {
    title: 'Atención 24/7',
    description: 'Soporte al cliente disponible las 24 horas'
  }
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
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
