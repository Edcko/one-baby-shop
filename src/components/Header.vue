<template>
  <header class="relative bg-gradient-to-r from-primary via-secondary to-accent shadow-lg border-b border-white/20">
    <!-- Elementos decorativos de fondo -->
    <div class="absolute inset-0 bg-black bg-opacity-5"></div>
    <div class="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    <div class="absolute bottom-0 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="flex items-center justify-between py-4">
        <!-- Logo mejorado -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="relative">
            <div class="w-10 h-10 bg-gradient-to-br from-white to-yellow-200 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div class="flex flex-col">
            <span class="font-heading text-2xl font-bold text-white leading-tight">One Baby</span>
            <span class="font-heading text-white/80 text-sm font-medium">Shop</span>
          </div>
        </router-link>

        <!-- Navegación Desktop mejorada -->
        <nav class="hidden md:flex space-x-8">
          <RouterLink to="/" class="font-heading hover:text-primary">Inicio</RouterLink>
          <RouterLink to="/catalog" class="font-heading hover:text-primary">Catálogo</RouterLink>
          <RouterLink to="/contact" class="font-heading hover:text-primary">Contacto</RouterLink>
          
          <!-- Enlaces para usuarios no autenticados -->
          <template v-if="!userStore.user">
            <RouterLink to="/login" class="font-heading hover:text-primary">Login</RouterLink>
            <RouterLink to="/register" class="font-heading hover:text-primary">Registro</RouterLink>
          </template>
          
          <!-- Enlaces para usuarios autenticados -->
          <template v-if="userStore.user">
            <RouterLink to="/profile" class="font-heading hover:text-primary">Perfil</RouterLink>
            <RouterLink to="/wishlist" class="font-heading hover:text-primary">Mis Favoritos</RouterLink>
            <RouterLink to="/checkout" class="font-heading hover:text-primary">Checkout</RouterLink>
            <RouterLink to="/orders" class="font-heading hover:text-primary">Pedidos</RouterLink>
            <RouterLink to="/admin/login" class="font-heading hover:text-primary">Admin</RouterLink>
            <button @click="logout" class="font-heading hover:text-red-500 ml-4">Cerrar sesión</button>
          </template>
        </nav>

        <!-- Carrito y menú móvil mejorados -->
        <div class="flex items-center gap-4">
          <!-- Carrito mejorado -->
          <button 
            @click="$emit('toggle-cart')" 
            class="relative group flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <div class="relative">
              <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
              <div class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                {{ cartCount }}
              </div>
            </div>
            <span class="hidden md:inline text-white font-medium">Carrito</span>
          </button>

          <!-- Menú móvil mejorado -->
          <button 
            @click="toggleMobileMenu" 
            class="lg:hidden relative p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
          >
            <div class="w-6 h-6 flex flex-col justify-center items-center gap-1">
              <span class="block w-5 h-0.5 bg-white transition-all duration-300" :class="mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''"></span>
              <span class="block w-5 h-0.5 bg-white transition-all duration-300" :class="mobileMenuOpen ? 'opacity-0' : ''"></span>
              <span class="block w-5 h-0.5 bg-white transition-all duration-300" :class="mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''"></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Menú móvil desplegable mejorado -->
      <div 
        v-if="mobileMenuOpen" 
        class="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-md shadow-2xl border-t border-white/20 rounded-b-2xl overflow-hidden"
      >
        <nav class="flex flex-col p-6 space-y-2">
          <router-link 
            to="/" 
            class="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-purple-50 rounded-xl transition-all duration-300 group" 
            @click="mobileMenuOpen = false"
            active-class="bg-purple-100 text-purple-700"
          >
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span class="font-medium">Inicio</span>
          </router-link>
          <router-link 
            to="/catalog" 
            class="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-purple-50 rounded-xl transition-all duration-300 group" 
            @click="mobileMenuOpen = false"
            active-class="bg-purple-100 text-purple-700"
          >
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <span class="font-medium">Catálogo</span>
          </router-link>
          <router-link 
            to="/contact" 
            class="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-purple-50 rounded-xl transition-all duration-300 group" 
            @click="mobileMenuOpen = false"
            active-class="bg-purple-100 text-purple-700"
          >
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span class="font-medium">Contacto</span>
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

defineProps({
  cartCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['toggle-cart'])

const userStore = useUserStore()
const router = useRouter()

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
