<template>
  <div class="min-h-screen flex flex-col">
    <Header @toggle-cart="cartOpen = !cartOpen" :cart-count="cartItemCount" />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
    <CartModal 
      :is-open="cartOpen" 
      :cart-items="cartItems" 
      @close="cartOpen = false"
      @remove="removeFromCart"
      @clear="clearCart"
      @checkout="goToCheckout"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CartModal from '../components/CartModal.vue'

const cartOpen = ref(false)
const cartItems = ref(JSON.parse(localStorage.getItem('cart')) || [])
const router = useRouter()

const cartItemCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const updateCart = (newItems) => {
  cartItems.value = newItems
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

function removeFromCart(idx) {
  cartItems.value.splice(idx, 1)
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

function clearCart() {
  cartItems.value = []
  localStorage.removeItem('cart')
}

function goToCheckout() {
  cartOpen.value = false
  router.push('/checkout')
}

// Listener para actualizar carrito desde otras páginas
function handleCartUpdate(event) {
  cartItems.value = event.detail
}

onMounted(() => {
  window.addEventListener('cart-updated', handleCartUpdate)
})

onUnmounted(() => {
  window.removeEventListener('cart-updated', handleCartUpdate)
})

// Sincroniza carrito con localStorage
watch(cartItems, (val) => {
  localStorage.setItem('cart', JSON.stringify(val))
}, { deep: true })
</script>
