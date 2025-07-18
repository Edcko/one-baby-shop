<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
    <!-- Header del catálogo mejorado -->
    <section class="relative py-16 bg-gradient-to-r from-primary via-secondary to-accent overflow-hidden">
      <div class="absolute inset-0 bg-black bg-opacity-10"></div>
      <div class="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div class="absolute bottom-0 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="font-heading text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Catálogo de
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-200">Productos</span>
          </h1>
          <p class="text-xl text-white/90 mb-8 leading-relaxed">
            Descubre nuestra amplia selección de productos para tu bebé, cuidadosamente seleccionados para su bienestar
          </p>
          
          <!-- Estadísticas -->
          <div class="grid grid-cols-3 gap-8 mt-12">
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-2">{{ products.length }}+</div>
              <div class="text-white/80 text-sm">Productos</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-2">{{ availableCategories.length }}</div>
              <div class="text-white/80 text-sm">Categorías</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-2">100%</div>
              <div class="text-white/80 text-sm">Seguros</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Barra de herramientas mejorada -->
    <section class="py-8 bg-white shadow-sm border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-6 items-center">
          <!-- Búsqueda mejorada -->
          <div class="flex-1 max-w-2xl">
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
              <div class="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar productos, categorías..."
                  class="w-full px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-transparent"
                />
                <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Ordenamiento mejorado -->
          <div class="lg:w-64">
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl blur opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
              <select
                v-model="sortBy"
                class="relative w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer shadow-lg"
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="category">Categoría</option>
              </select>
              <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Botón de filtros móvil mejorado -->
          <button
            @click="mobileFiltersOpen = !mobileFiltersOpen"
            class="lg:hidden relative group px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span class="font-medium">Filtros</span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-8">
      <div class="flex gap-8">
        <!-- Filtros sidebar mejorados -->
        <aside class="w-80 hidden lg:block">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-8">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              </div>
              <h3 class="font-heading text-2xl font-bold text-gray-800">Filtros</h3>
            </div>
            
            <!-- Categorías mejoradas -->
            <div class="mb-8">
              <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Categorías
              </h4>
              <div class="space-y-3">
                <label v-for="category in availableCategories" :key="category" class="flex items-center group cursor-pointer">
                  <div class="relative">
                    <input
                      type="checkbox"
                      :value="category"
                      v-model="selectedCategories"
                      class="sr-only"
                    />
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-lg flex items-center justify-center group-hover:border-purple-500 transition-all duration-200">
                      <svg v-if="selectedCategories.includes(category)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div v-if="selectedCategories.includes(category)" class="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg"></div>
                  </div>
                  <span class="ml-3 text-gray-700 group-hover:text-purple-600 transition-colors duration-200">{{ category }}</span>
                </label>
              </div>
            </div>

            <!-- Rango de precios mejorado -->
            <div class="mb-8">
              <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Precio máximo
              </h4>
              <div class="space-y-4">
                <input
                  type="range"
                  v-model="maxPrice"
                  :min="0"
                  :max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">$0</span>
                  <span class="text-lg font-bold text-purple-600">${{ maxPrice }}</span>
                  <span class="text-sm text-gray-600">$100</span>
                </div>
              </div>
            </div>

            <!-- Limpiar filtros mejorado -->
            <button
              @click="clearFilters"
              class="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Limpiar filtros
            </button>
          </div>
        </aside>

        <!-- Productos mejorados -->
        <div class="flex-1">
          <!-- Resultados mejorados -->
          <div class="mb-8">
            <div class="flex items-center justify-between">
              <p class="text-gray-600">
                Mostrando <span class="font-bold text-purple-600">{{ filteredProducts.length }}</span> de <span class="font-bold text-gray-800">{{ products.length }}</span> productos
              </p>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Filtros aplicados</span>
              </div>
            </div>
          </div>

          <!-- Grid de productos mejorado -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :id="product.id"
              :image="product.image"
              :title="product.name"
              :description="product.description"
              :price="product.price"
              :category="product.category"
              :rating="product.rating"
              :reviewCount="product.reviewCount"
              @add-to-cart="addToCart"
            />
          </div>

          <!-- Sin resultados mejorado -->
          <div v-if="filteredProducts.length === 0" class="text-center py-16">
            <div class="max-w-md mx-auto">
              <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">No se encontraron productos</h3>
              <p class="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
              <button
                @click="clearFilters"
                class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros móviles mejorados -->
    <div v-if="mobileFiltersOpen" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
      <div class="absolute inset-0 flex items-end justify-center p-4">
        <div class="bg-white rounded-t-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-100 p-6">
            <div class="flex justify-between items-center">
              <h3 class="font-heading text-2xl font-bold text-gray-800">Filtros</h3>
              <button @click="mobileFiltersOpen = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="p-6 space-y-8">
            <!-- Categorías móviles -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Categorías
              </h4>
              <div class="space-y-3">
                <label v-for="category in availableCategories" :key="category" class="flex items-center group cursor-pointer">
                  <div class="relative">
                    <input
                      type="checkbox"
                      :value="category"
                      v-model="selectedCategories"
                      class="sr-only"
                    />
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-lg flex items-center justify-center group-hover:border-purple-500 transition-all duration-200">
                      <svg v-if="selectedCategories.includes(category)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div v-if="selectedCategories.includes(category)" class="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg"></div>
                  </div>
                  <span class="ml-3 text-gray-700 group-hover:text-purple-600 transition-colors duration-200">{{ category }}</span>
                </label>
              </div>
            </div>

            <!-- Rango de precios móvil -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Precio máximo
              </h4>
              <div class="space-y-4">
                <input
                  type="range"
                  v-model="maxPrice"
                  :min="0"
                  :max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">$0</span>
                  <span class="text-lg font-bold text-purple-600">${{ maxPrice }}</span>
                  <span class="text-sm text-gray-600">$100</span>
                </div>
              </div>
            </div>

            <!-- Botones móviles -->
            <div class="space-y-3 pt-4">
              <button
                @click="clearFilters"
                class="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Limpiar filtros
              </button>
              <button
                @click="mobileFiltersOpen = false"
                class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToastStore } from '@/store/toast'
import products from '@/data/products.json'
import ProductCard from '@/components/ProductCard.vue'

// Estado reactivo
const searchQuery = ref('')
const selectedCategories = ref([])
const maxPrice = ref(100)
const sortBy = ref('name')
const mobileFiltersOpen = ref(false)
const toastStore = useToastStore()

// Categorías disponibles
const availableCategories = computed(() => {
  return [...new Set(products.map(p => p.category))]
})

// Productos filtrados y ordenados
const filteredProducts = computed(() => {
  let filtered = products.filter(product => {
    // Filtro por búsqueda
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filtro por categoría
    const matchesCategory = selectedCategories.value.length === 0 || 
                           selectedCategories.value.includes(product.category)
    
    // Filtro por precio
    const matchesPrice = product.price <= maxPrice.value
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  // Ordenamiento
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'category':
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  return filtered
})

// Funciones
const clearFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  maxPrice.value = 100
  sortBy.value = 'name'
}

const addToCart = (product) => {
  // Obtener carrito actual del localStorage
  const currentCart = JSON.parse(localStorage.getItem('cart')) || []
  
  // Verificar si el producto ya existe en el carrito
  const existingItem = currentCart.find(item => item.id === product.id)
  
  if (existingItem) {
    // Si ya existe, incrementar cantidad
    existingItem.quantity += 1
    toastStore.success('Producto actualizado', `Se agregó otra unidad de ${product.name} al carrito.`)
  } else {
    // Si no existe, agregar nuevo producto
    currentCart.push({
      ...product,
      quantity: 1
    })
    toastStore.success('Producto agregado', `${product.name} se agregó correctamente al carrito.`)
  }
  
  // Guardar en localStorage
  localStorage.setItem('cart', JSON.stringify(currentCart))
  
  // Emitir evento para actualizar el contador del carrito en el header
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: currentCart }))
}
</script>

<style scoped>
.slider {
  background: linear-gradient(to right, #9333ea 0%, #9333ea 50%, #e5e7eb 50%, #e5e7eb 100%);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(to right, #9333ea, #7c3aed);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(147, 51, 234, 0.3);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(to right, #9333ea, #7c3aed);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(147, 51, 234, 0.3);
}
</style>
