import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 1

  const addToast = (toast) => {
    const id = nextId++
    const newToast = {
      id,
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      ...toast
    }

    toasts.value.push(newToast)

    // Auto-remover después del tiempo especificado
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearToasts = () => {
    toasts.value = []
  }

  // Métodos de conveniencia para diferentes tipos
  const success = (title, message, duration = 5000) => {
    return addToast({ type: 'success', title, message, duration })
  }

  const error = (title, message, duration = 7000) => {
    return addToast({ type: 'error', title, message, duration })
  }

  const info = (title, message, duration = 5000) => {
    return addToast({ type: 'info', title, message, duration })
  }

  const warning = (title, message, duration = 6000) => {
    return addToast({ type: 'warning', title, message, duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    info,
    warning
  }
}) 