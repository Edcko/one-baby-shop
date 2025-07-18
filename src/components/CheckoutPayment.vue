<template>
  <div class="mb-8">
    <h2 class="font-heading text-2xl font-bold text-purple-700 mb-4">Método de pago</h2>
    <div class="flex flex-col gap-4">
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="radio" name="payment" checked class="accent-purple-600" />
        <span class="font-medium text-gray-700">Tarjeta de crédito/débito (próximamente)</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="radio" name="payment" disabled class="accent-purple-600" />
        <span class="font-medium text-gray-400">PayPal (próximamente)</span>
      </label>
    </div>
  </div>
</template> 