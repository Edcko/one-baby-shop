import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToastStore } from '@/store/toast'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(null)
  const favorites = ref(JSON.parse(localStorage.getItem('favorites')) || [])
  const toastStore = useToastStore()

  // Simulación local, reemplazar por fetch/axios a tu backend
  const register = async (data) => {
    // Aquí conectarías a tu backend: await fetch('/api/register', ...)
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      toastStore.error('Error de registro', 'Todos los campos son obligatorios.')
      return { success: false, message: 'Todos los campos son obligatorios.' }
    }
    if (data.password.length < 6) {
      toastStore.error('Error de registro', 'La contraseña debe tener al menos 6 caracteres.')
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' }
    }
    // Simulación: guardar en localStorage
    localStorage.setItem('user', JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    }))
    user.value = { firstName: data.firstName, lastName: data.lastName, email: data.email }
    token.value = 'fake-token'
    toastStore.success('¡Registro exitoso!', 'Te hemos enviado un email de confirmación.')
    return { success: true }
  }

  const login = async (data) => {
    // Aquí conectarías a tu backend: await fetch('/api/login', ...)
    const saved = JSON.parse(localStorage.getItem('user'))
    if (saved && saved.email === data.email) {
      user.value = saved
      token.value = 'fake-token'
      toastStore.success('¡Bienvenido!', `Hola ${saved.firstName}, has iniciado sesión correctamente.`)
      return { success: true }
    }
    // Usuario admin de prueba
    if (data.email === 'admin@babyshop.com' && data.password === 'admin123') {
      const adminUser = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@babyshop.com',
        role: 'admin'
      }
      user.value = adminUser
      token.value = 'admin-token'
      localStorage.setItem('user', JSON.stringify(adminUser))
      toastStore.success('¡Bienvenido Admin!', 'Has iniciado sesión como administrador.')
      return { success: true }
    }
    toastStore.error('Error de login', 'Credenciales incorrectas.')
    return { success: false, message: 'Credenciales incorrectas.' }
  }

  const logout = () => {
    const userName = user.value?.firstName || 'Usuario'
    user.value = null
    token.value = null
    localStorage.removeItem('user')
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
    favorites.value = favorites.value.filter(id => id !== productId)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
    toastStore.info('Removido de favoritos', 'El producto se removió de tu lista de favoritos.')
  }

  const isFavorite = (productId) => favorites.value.includes(productId)

  // Cargar usuario al iniciar
  if (localStorage.getItem('user')) {
    user.value = JSON.parse(localStorage.getItem('user'))
    token.value = 'fake-token'
  }

  return { user, token, register, login, logout, favorites, addFavorite, removeFavorite, isFavorite }
}) 