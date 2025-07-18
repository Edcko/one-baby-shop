<template>
  <div class="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative" role="article" aria-labelledby="product-title-{{ id }}">
    <RouterLink :to="`/product/${id}`" :aria-label="`Ver detalles de ${title}`">
      <!-- Imagen y contenido clickeable -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <img 
          :src="image" 
          :alt="`Imagen de ${title}`"
          class="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-700" 
          loading="lazy"
        />
        <div v-if="discount" class="absolute top-4 left-4">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-sm"></div>
            <div class="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg" role="status" aria-label="Descuento del {{ discount }}%">
              -{{ discount }}%
            </div>
          </div>
        </div>
      </div>
      <div class="relative p-6">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          <span class="text-xs text-purple-600 font-semibold uppercase tracking-wider">{{ category }}</span>
        </div>
        <h3 id="product-title-{{ id }}" class="font-heading text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">{{ title }}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{{ description }}</p>
        <div class="flex items-center mb-2" role="group" aria-label="Valoración del producto">
          <div class="flex" role="img" :aria-label="`${rating} estrellas de 5`">
            <span v-for="i in 5" :key="i" class="text-yellow-400">
              <svg v-if="i <= rating" class="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <svg v-else class="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </span>
          </div>
          <span class="text-sm text-gray-600 ml-2">({{ reviewCount }} reseñas)</span>
        </div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-purple-600" aria-label="Precio: ${{ price }}">${{ price }}</span>
              <span v-if="originalPrice" class="text-sm text-gray-400 line-through" aria-label="Precio original: ${{ originalPrice }}">${{ originalPrice }}</span>
            </div>
            <div v-if="discount" class="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full font-bold" role="status" aria-label="Ahorras ${{ Math.round((originalPrice - price) * 100) / 100 }}">
              Ahorras ${{ Math.round((originalPrice - price) * 100) / 100 }}
            </div>
          </div>
        </div>
      </div>
    </RouterLink>
    <!-- Botón agregar al carrito reposicionado -->
    <div class="px-6 pb-6">
      <button 
        @click.stop.prevent="$emit('add-to-cart', { id, name: title, price: parseFloat(price), image, quantity: 1 })"
        class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        :aria-label="`Agregar ${title} al carrito`"
        role="button"
        tabindex="0"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
        </svg>
        Agregar al carrito
      </button>
    </div>
    <!-- Icono de favorito -->
    <button 
      v-if="userStore.user" 
      @click.stop.prevent="toggleFavorite" 
      class="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      :aria-label="userStore.isFavorite(id) ? `Remover ${title} de favoritos` : `Agregar ${title} a favoritos`"
      role="button"
      tabindex="0"
    >
      <svg v-if="userStore.isFavorite(id)" class="w-7 h-7 text-pink-500 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <svg v-else class="w-7 h-7 text-gray-300 stroke-current" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </button>
    <!-- Efecto de brillo en hover -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// Props esperadas: image, title, description, price, category, discount, originalPrice
const props = defineProps({
  id: { type: [Number, String], required: true },
  image: String,
  title: String,
  description: String,
  price: [Number, String],
  category: String,
  discount: Number,
  originalPrice: [Number, String],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
})

const toggleFavorite = () => {
  if (!userStore.user) return
  if (userStore.isFavorite(props.id)) {
    userStore.removeFavorite(props.id)
  } else {
    userStore.addFavorite(props.id)
  }
}

defineEmits(['add-to-cart'])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

/* Animación de brillo */
@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.group:hover .absolute {
  animation: shine 1s ease-in-out;
}
</style>
