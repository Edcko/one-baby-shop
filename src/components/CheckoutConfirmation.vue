<template>
  <div class="text-center py-8">
    <svg class="mx-auto mb-4 w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
    <h2 class="font-heading text-2xl font-bold text-green-600 mb-2">¡Compra realizada con éxito!</h2>
    <p class="text-gray-700 mb-4">Gracias por tu compra. Pronto recibirás un email con los detalles de tu pedido.</p>
    <router-link to="/orders" class="inline-block mt-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300">Ver mis pedidos</router-link>
  </div>
</template> 