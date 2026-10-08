import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const CART_KEY = 'cart'

/**
 * Cart store — single source of truth.
 *
 * Replaces the old pattern where DefaultLayout.vue owned the cart as a local
 * ref and pages synced through localStorage + window CustomEvent('cart-updated').
 * Every component reads/writes THIS store; persistence is handled here once.
 */
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    // Migration guard: drop corrupt or legacy entries without id/price.
    return raw
      .filter((item) => item && item.id != null && Number(item.price) > 0)
      .map((item) => ({
        id: item.id,
        name: item.name || '',
        price: Number(item.price),
        image: item.image || '',
        quantity: Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1,
      }))
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCart())
  const isOpen = ref(false)

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  /** Adds a product (or increments its quantity). Returns true when a new line was created. */
  function add(product, quantity = 1) {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
      return false
    }
    items.value.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || '',
      quantity,
    })
    return true
  }

  function remove(id) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  /** Sets an absolute quantity; removing the line when it drops to zero or below. */
  function setQuantity(id, quantity) {
    if (quantity <= 0) return remove(id)
    const item = items.value.find((entry) => entry.id === id)
    if (item) item.quantity = quantity
  }

  function clear() {
    items.value = []
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  // Single persistence point — deep watch keeps localStorage in sync.
  watch(items, (value) => localStorage.setItem(CART_KEY, JSON.stringify(value)), { deep: true })

  return { items, isOpen, count, total, add, remove, setQuantity, clear, open, close }
})
