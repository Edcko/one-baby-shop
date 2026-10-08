import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToastStore } from '@/store/toast'
import { api, setAccessToken } from '@/services/api'

/**
 * Real auth store — talks to the API (F3).
 *
 * The old version compared only the email and had admin credentials
 * hardcoded in source. Both are gone: the server verifies argon2 hashes,
 * admin accounts are seeded from env vars only.
 *
 * The access token NEVER lives here — the api service owns it in memory.
 * This store holds only the user profile and session state.
 */
export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const initialized = ref(false)
  const favorites = ref(JSON.parse(localStorage.getItem('favorites')) || [])
  const toastStore = useToastStore()

  /**
   * Restores the session on app load using the httpOnly refresh cookie.
   * Call once from App.vue; router guards wait on `initialized`.
   */
  async function initialize() {
    if (initialized.value) return
    initialized.value = true
    const response = await api('/auth/refresh', { method: 'POST' })
    if (response.ok && response.data?.data?.accessToken) {
      setAccessToken(response.data.data.accessToken)
      const me = await api('/auth/me')
      if (me.ok) user.value = me.data.data
    }
  }

  async function register(data) {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      toastStore.error('Error de registro', 'Todos los campos son obligatorios.')
      return { success: false, message: 'Todos los campos son obligatorios.' }
    }
    if (data.password.length < 8) {
      toastStore.error('Error de registro', 'La contraseña debe tener al menos 8 caracteres.')
      return { success: false, message: 'La contraseña debe tener al menos 8 caracteres.' }
    }
    if (data.password !== data.confirmPassword) {
      toastStore.error('Error de registro', 'Las contraseñas no coinciden.')
      return { success: false, message: 'Las contraseñas no coinciden.' }
    }

    const response = await api('/auth/register', {
      method: 'POST',
      body: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
    })

    if (!response.ok) {
      const message =
        response.status === 409
          ? 'Ya existe una cuenta con este correo.'
          : (response.data?.message ?? 'No se pudo completar el registro.')
      toastStore.error('Error de registro', message)
      return { success: false, message }
    }

    setAccessToken(response.data.data.accessToken)
    user.value = response.data.data.user
    toastStore.success(
      '¡Registro exitoso!',
      'Te hemos enviado un correo de verificación (revisa la consola del servidor en desarrollo).'
    )
    return { success: true }
  }

  async function login(data) {
    const response = await api('/auth/login', {
      method: 'POST',
      body: { email: data.email, password: data.password },
    })

    if (!response.ok) {
      const message =
        response.status === 0
          ? 'No hay conexión con el servidor.'
          : (response.data?.message ?? 'Credenciales incorrectas.')
      toastStore.error('Error de login', message)
      return { success: false, message }
    }

    setAccessToken(response.data.data.accessToken)
    user.value = response.data.data.user
    toastStore.success(
      '¡Bienvenido!',
      `Hola ${user.value.firstName}, has iniciado sesión correctamente.`
    )
    return { success: true }
  }

  async function logout() {
    const userName = user.value?.firstName || 'Usuario'
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setAccessToken(null)
    user.value = null
    toastStore.info('Sesión cerrada', `Hasta luego ${userName}, has cerrado sesión correctamente.`)
  }

  const addFavorite = (productId) => {
    if (!favorites.value.includes(productId)) {
      favorites.value.push(productId)
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
      toastStore.success('Agregado a favoritos', 'El producto se agregó a tu lista de favoritos.')
    }
  }

  const removeFavorite = (productId) => {
    favorites.value = favorites.value.filter((id) => id !== productId)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
    toastStore.info('Removido de favoritos', 'El producto se removió de tu lista de favoritos.')
  }

  const isFavorite = (productId) => favorites.value.includes(productId)

  return {
    user,
    initialized,
    favorites,
    initialize,
    register,
    login,
    logout,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
})
