import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { useUserStore } from '@/store/user'
import { useToastStore } from '@/store/toast'

const CART_KEY = 'cart'

/**
 * Cart store — single source of truth (F1) with server sync (F4).
 *
 * - Guest: mutations hit localStorage only.
 * - Authenticated: mutations go to the API (server is authoritative);
 *   on login, the guest cart is merged once via POST /cart/merge.
 * - Shape is uniform in both modes: { id, name, priceCents, image, quantity }.
 */
function loadLocalCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw
      .filter((item) => item && item.id != null && Number(item.priceCents) > 0)
      .map((item) => ({
        id: item.id,
        name: item.name || '',
        priceCents: Number(item.priceCents),
        image: item.image || '',
        quantity: Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1,
      }))
  } catch {
    return []
  }
}

/** Maps a server cart line to the store shape. */
function fromServer(items) {
  return items.map((line) => ({
    id: line.productId,
    name: line.name,
    priceCents: line.priceCents,
    image: line.image ?? '',
    quantity: line.quantity,
  }))
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadLocalCart())
  const isOpen = ref(false)
  const syncing = ref(false)

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const totalCents = computed(() =>
    items.value.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
  )

  const isAuthed = () => Boolean(useUserStore().user)

  function persistLocal() {
    localStorage.setItem(CART_KEY, JSON.stringify(items.value))
  }

  watch(items, persistLocal, { deep: true })

  async function applyServerResponse(response) {
    if (response?.ok && response.data?.data?.items) {
      items.value = fromServer(response.data.data.items)
      return true
    }
    return false
  }

  /** Called once right after a successful login/registration. */
  async function syncOnLogin() {
    const guestItems = items.value.map((item) => ({ productId: item.id, quantity: item.quantity }))
    syncing.value = true
    try {
      const response = await api('/cart/merge', {
        method: 'POST',
        body: { items: guestItems },
      })
      if (!(await applyServerResponse(response))) {
        // Network/5xx: keep the local cart; a later page reload retries via GET.
        const fetched = await api('/cart')
        await applyServerResponse(fetched)
      }
    } finally {
      syncing.value = false
    }
  }

  /** Adds a product (or increments). Returns true when a new line was created. */
  async function add(product, quantity = 1) {
    if (isAuthed()) {
      const existing = items.value.find((item) => item.id === product.id)
      const desired = (existing?.quantity ?? 0) + quantity
      const response = await api('/cart/items', {
        method: 'PUT',
        body: { productId: product.id, quantity: desired },
      })
      if (response.ok) {
        await applyServerResponse(response)
        return !existing
      }
      useToastStore().error(
        'No se pudo agregar',
        response.data?.message ?? 'Revisa tu conexión e inténtalo de nuevo.'
      )
      return false
    }

    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
      return false
    }
    items.value.push({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      image: product.image ?? '',
      quantity,
    })
    return true
  }

  async function remove(id) {
    if (isAuthed()) {
      const response = await api('/cart/items', {
        method: 'PUT',
        body: { productId: id, quantity: 0 },
      })
      if (response.ok) {
        await applyServerResponse(response)
        return
      }
      useToastStore().error('No se pudo remover', 'Revisa tu conexión e inténtalo de nuevo.')
      return
    }
    items.value = items.value.filter((item) => item.id !== id)
  }

  /** Sets an absolute quantity; removing the line when it drops to zero or below. */
  async function setQuantity(id, quantity) {
    if (quantity <= 0) return remove(id)
    if (isAuthed()) {
      const response = await api('/cart/items', {
        method: 'PUT',
        body: { productId: id, quantity },
      })
      if (response.ok) {
        await applyServerResponse(response)
        return
      }
      useToastStore().error('No se pudo actualizar', 'Revisa tu conexión e inténtalo de nuevo.')
      return
    }
    const item = items.value.find((entry) => entry.id === id)
    if (item) item.quantity = quantity
  }

  async function clear() {
    if (isAuthed()) {
      const response = await api('/cart', { method: 'DELETE' })
      if (!response.ok) {
        useToastStore().error('No se pudo vaciar', 'Revisa tu conexión e inténtalo de nuevo.')
        return
      }
    }
    items.value = []
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    items,
    isOpen,
    syncing,
    count,
    totalCents,
    add,
    remove,
    setQuantity,
    clear,
    open,
    close,
    syncOnLogin,
  }
})
