<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
    <!-- Hero Section -->
    <section class="relative py-16 bg-gradient-to-r from-primary via-secondary to-accent overflow-hidden">
      <div class="absolute inset-0 bg-black bg-opacity-10"></div>
      <div class="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div class="absolute bottom-0 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="font-heading text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Contáctanos
          </h1>
          <p class="text-xl text-white/90 mb-8 leading-relaxed">
            Estamos aquí para ayudarte con cualquier pregunta sobre nuestros productos
          </p>
        </div>
      </div>
    </section>

    <!-- Formulario de contacto -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Información de contacto -->
            <div class="space-y-8">
              <div>
                <h2 class="font-heading text-3xl font-bold text-gray-800 mb-6">Hablemos</h2>
                <p class="text-gray-600 text-lg leading-relaxed">
                  ¿Tienes alguna pregunta sobre nuestros productos? ¿Necesitas ayuda con tu pedido? 
                  Nuestro equipo está listo para ayudarte.
                </p>
              </div>

              <!-- Información de contacto -->
              <div class="space-y-6">
                <div class="flex items-center gap-4 group">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Teléfono</h3>
                    <p class="text-gray-600">+1 234 567 890</p>
                    <p class="text-sm text-gray-500">Lun-Vie 9AM-6PM</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 group">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Email</h3>
                    <p class="text-gray-600">info@onebabyshop.com</p>
                    <p class="text-sm text-gray-500">Respuesta en 24h</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 group">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Dirección</h3>
                    <p class="text-gray-600">123 Baby Street, City</p>
                    <p class="text-sm text-gray-500">Centro comercial</p>
                  </div>
                </div>
              </div>

              <!-- Horarios -->
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 class="font-semibold text-gray-800 mb-4">Horarios de atención</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Lunes - Viernes</span>
                    <span class="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Sábados</span>
                    <span class="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Domingos</span>
                    <span class="font-medium">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario -->
            <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 class="font-heading text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h3>
              
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input 
                      type="text" 
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    <input 
                      type="text" 
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                  <select class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300">
                    <option>Consulta general</option>
                    <option>Soporte técnico</option>
                    <option>Información de productos</option>
                    <option>Problemas con pedido</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea 
                    rows="5"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium text-lg shadow-lg transform hover:scale-105"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Página de contacto con diseño moderno
</script> 