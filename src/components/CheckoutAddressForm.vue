<template>
  <div class="mb-8">
    <h2 class="font-heading text-2xl font-bold text-purple-700 mb-4">Dirección de envío</h2>
    <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
        <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Nombre" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
        <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Apellido" required />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
        <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Calle, número, piso..." required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
        <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Ciudad" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Código postal</label>
        <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Código postal" required />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
        <input type="tel" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="Teléfono" required />
      </div>
    </form>
  </div>
</template> 