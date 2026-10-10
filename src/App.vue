<template>
  <ErrorBoundary>
    <div id="app">
      <RouterView />
      <Toast />
      <!-- Dev panel: dev-only. The dynamic import is dead-code-eliminated
           in production builds, so it never reaches the shipped bundle. -->
      <component :is="DevTools" />
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { shallowRef, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { useCartStore } from '@/store/cart'
import Toast from '@/components/Toast.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'

// Static SEO meta lives in index.html — the single source of truth.
const DevTools = shallowRef(null)

// Login → merge the guest cart into the server cart (once per session).
// Lives here (App) to avoid a circular import between the user and cart stores.
const userStore = useUserStore()
const cartStore = useCartStore()
watch(
  () => userStore.user?.id,
  (id, previousId) => {
    if (id && id !== previousId) cartStore.syncOnLogin()
  }
)

if (import.meta.env.DEV) {
  import('@/components/DevTools.vue').then((m) => {
    DevTools.value = m.default
  })
}
</script>

<style>
/* Global accessibility styles */
:focus {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(168, 85, 57, 0.3),
    0 0 0 4px rgba(168, 85, 57, 0.1);
  border-radius: 0.375rem;
  transition: box-shadow 0.2s ease-in-out;
}

:focus:not(:focus-visible) {
  box-shadow: none;
}

:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(168, 85, 57, 0.3),
    0 0 0 4px rgba(168, 85, 57, 0.1);
  border-radius: 0.375rem;
}

button:focus-visible {
  box-shadow:
    0 0 0 2px rgba(168, 85, 57, 0.4),
    0 0 0 4px rgba(168, 85, 57, 0.15);
}

a:focus-visible {
  box-shadow:
    0 0 0 2px rgba(168, 85, 57, 0.3),
    0 0 0 4px rgba(168, 85, 57, 0.1);
}

@media (prefers-contrast: high) {
  .text-gray-600 {
    color: #374151 !important;
  }
  .text-gray-500 {
    color: #6b7280 !important;
  }
}

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
