<template>
  <ErrorBoundary>
    <div id="app">
      <RouterView />
      <Toast />
      <DevTools />
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Toast from '@/components/Toast.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import DevTools from '@/components/DevTools.vue'
import { onMounted } from 'vue'

// Configuración SEO básica
onMounted(() => {
  // Configurar título y meta tags básicos
  document.title = 'One Baby Shop - Tu tienda de confianza para productos de bebé'
  
  // Agregar meta description si no existe
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = 'Descubre nuestra amplia selección de productos para bebé. Pañales, ropa, juguetes, alimentación y más. Envío gratis en pedidos superiores a $50.'
  
  // Agregar meta keywords si no existe
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.content = 'bebé, pañales, ropa infantil, juguetes bebé, alimentación bebé, productos bebé, tienda bebé'
  
  // Agregar meta author si no existe
  let metaAuthor = document.querySelector('meta[name="author"]')
  if (!metaAuthor) {
    metaAuthor = document.createElement('meta')
    metaAuthor.name = 'author'
    document.head.appendChild(metaAuthor)
  }
  metaAuthor.content = 'One Baby Shop'
})
</script>

<style>
/* Estilos globales para accesibilidad - Mejorados */
:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.3), 0 0 0 4px rgba(147, 51, 234, 0.1);
  border-radius: 0.375rem;
  transition: box-shadow 0.2s ease-in-out;
}

:focus:not(:focus-visible) {
  box-shadow: none;
}

:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.3), 0 0 0 4px rgba(147, 51, 234, 0.1);
  border-radius: 0.375rem;
}

/* Estilos específicos para botones */
button:focus-visible {
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.4), 0 0 0 4px rgba(147, 51, 234, 0.15);
}

/* Estilos específicos para enlaces */
a:focus-visible {
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.3), 0 0 0 4px rgba(147, 51, 234, 0.1);
}

/* Mejoras de contraste para accesibilidad */
@media (prefers-contrast: high) {
  .text-gray-600 {
    color: #374151 !important;
  }
  .text-gray-500 {
    color: #6b7280 !important;
  }
}

/* Reducir movimiento para usuarios sensibles */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
