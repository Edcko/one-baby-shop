<template>
  <footer class="relative bg-linen-dark text-ink overflow-hidden border-t border-ink/10">
    <!-- textura cálida de fondo -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-[#332C26] to-[#26201B]"
      aria-hidden="true"
    ></div>
    <div
      class="absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-primary-600/10 blur-3xl"
      aria-hidden="true"
    ></div>
    <div
      class="absolute -bottom-24 right-1/5 w-64 h-64 rounded-full bg-accent-500/10 blur-3xl"
      aria-hidden="true"
    ></div>

    <div class="container mx-auto px-4 relative">
      <!-- fila superior -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
        <!-- Marca -->
        <div class="lg:col-span-1">
          <router-link to="/" class="inline-flex items-center gap-3 group">
            <div
              class="w-11 h-11 bg-white rounded-xl border border-linen-dark flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
            >
              <svg class="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"
                />
              </svg>
            </div>
            <span class="font-heading text-2xl font-bold tracking-tight">
              <span class="text-primary-500">One</span>
              <span class="text-accent-500">Baby</span>
              <span class="text-dustblue">Shop</span>
            </span>
          </router-link>

          <p class="mt-4 text-sm leading-relaxed text-ink-soft max-w-xs">
            Ropa, pañales y todo lo que tu bebé necesita — elegido con el mismo cuidado con el que
            lo guardarías tú.
          </p>

          <!-- Redes -->
          <div class="flex gap-3 mt-6">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.name"
              class="w-10 h-10 rounded-xl bg-white border border-linen-dark flex items-center justify-center text-ink hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                v-html="social.icon"
              ></svg>
            </a>
          </div>
        </div>

        <!-- Enlaces -->
        <div>
          <h3 class="font-heading font-bold text-lg mb-5 text-primary-700">Tienda</h3>
          <ul class="space-y-3 text-sm">
            <li v-for="link in shopLinks" :key="link.label">
              <router-link
                :to="link.to"
                class="text-ink-soft hover:text-primary-600 hover:pl-1 transition-all duration-200 inline-block"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Cuenta -->
        <div>
          <h3 class="font-heading font-bold text-lg mb-5 text-primary-700">Tu cuenta</h3>
          <ul class="space-y-3 text-sm">
            <li v-for="link in accountLinks" :key="link.label">
              <router-link
                :to="link.to"
                class="text-ink-soft hover:text-primary-600 hover:pl-1 transition-all duration-200 inline-block"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h3 class="font-heading font-bold text-lg mb-5 text-primary-700">Contacto</h3>
          <ul class="space-y-4 text-sm">
            <li class="flex items-start gap-3">
              <span
                class="w-9 h-9 rounded-lg bg-white border border-linen-dark flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-4 h-4 text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </span>
              <div>
                <a
                  href="tel:+525500000000"
                  class="text-ink hover:text-primary-600 transition-colors"
                  >+52 55 0000 0000</a
                >
                <p class="text-ink-light text-xs mt-0.5">Lun–Vie 9:00–18:00</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="w-9 h-9 rounded-lg bg-white border border-linen-dark flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-4 h-4 text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </span>
              <div>
                <a
                  href="mailto:hola@onebabyshop.mx"
                  class="text-ink hover:text-primary-600 transition-colors"
                  >hola@onebabyshop.mx</a
                >
                <p class="text-ink-light text-xs mt-0.5">Respondemos en 24 h</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="w-9 h-9 rounded-lg bg-white border border-linen-dark flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-4 h-4 text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </span>
              <div>
                <p class="text-ink">Envíos a todo México</p>
                <p class="text-ink-light text-xs mt-0.5">Gratis desde $500 MXN</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- aviso de pago -->
      <div
        class="border-t border-ink/10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-light"
      >
        <p>© {{ new Date().getFullYear() }} One Baby Shop. Todos los derechos reservados.</p>
        <p class="flex items-center gap-2">
          Pagos seguros con
          <span class="font-bold text-ink">Mercado Pago</span>
          <span class="text-ink-light">·</span>
          Tarjeta · MSI · OXXO · SPEI
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const shopLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/catalog' },
  { label: 'Mis pedidos', to: '/orders' },
  { label: 'Contacto', to: '/contact' },
]

const accountLinks = [
  { label: 'Mi cuenta', to: '/profile' },
  { label: 'Mis favoritos', to: '/wishlist' },
  { label: 'Carrito', to: '/checkout' },
]

// Sustituir href="#" por las cuentas reales cuando existan
const socials = [
  {
    name: 'Instagram',
    href: '#',
    icon: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>',
  },
  {
    name: 'Facebook',
    href: '#',
    icon: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
  },
  {
    name: 'TikTok',
    href: '#',
    icon: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  },
]
</script>
