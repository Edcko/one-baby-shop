<template>
  <footer class="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
    <!-- Elementos decorativos de fondo -->
    <div class="absolute inset-0 bg-black bg-opacity-20"></div>
    <div class="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl"></div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="py-16">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <!-- Información de la empresa mejorada -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-6">
              <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
                  </svg>
                </div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div class="flex flex-col">
                <span class="font-heading text-2xl font-bold leading-tight">One Baby</span>
                <span class="text-white/80 text-sm font-medium">Shop</span>
              </div>
            </div>
            <p class="text-white/80 mb-8 max-w-lg leading-relaxed">
              Tu tienda de confianza para todo lo que tu bebé necesita. Productos de calidad, 
              seguros y con el mejor precio garantizado. Hacemos que cada momento sea especial.
            </p>
            
            <!-- Redes sociales mejoradas -->
            <div class="flex gap-4">
              <a href="#" class="group relative p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                <svg class="relative w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="group relative p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                <svg class="relative w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" class="group relative p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                <svg class="relative w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Enlaces rápidos mejorados -->
          <div>
            <h3 class="font-heading text-xl font-bold mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              </div>
              Enlaces rápidos
            </h3>
            <ul class="space-y-3">
              <li>
                <router-link to="/" class="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group">
                  <div class="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <span>Inicio</span>
                </router-link>
              </li>
              <li>
                <router-link to="/catalog" class="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group">
                  <div class="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <span>Catálogo</span>
                </router-link>
              </li>
              <li>
                <a href="#" class="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group">
                  <div class="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <span>Ofertas</span>
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 group">
                  <div class="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <span>Novedades</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Contacto mejorado -->
          <div>
            <h3 class="font-heading text-xl font-bold mb-6 flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              Contacto
            </h3>
            <ul class="space-y-4">
              <li class="flex items-center gap-3 group">
                <div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-white font-medium">+1 234 567 890</div>
                  <div class="text-white/60 text-sm">Lun-Vie 9AM-6PM</div>
                </div>
              </li>
              <li class="flex items-center gap-3 group">
                <div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-white font-medium">info@onebabyshop.com</div>
                  <div class="text-white/60 text-sm">Respuesta en 24h</div>
                </div>
              </li>
              <li class="flex items-center gap-3 group">
                <div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-white font-medium">123 Baby Street, City</div>
                  <div class="text-white/60 text-sm">Centro comercial</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Línea divisoria mejorada -->
      <div class="border-t border-white/20 py-8">
        <div class="flex flex-col lg:flex-row justify-between items-center gap-4">
          <p class="text-white/60 text-sm">© 2024 One Baby Shop. Todos los derechos reservados.</p>
          <div class="flex gap-6">
            <a href="#" class="text-sm text-white/60 hover:text-white transition-colors duration-300">Política de privacidad</a>
            <a href="#" class="text-sm text-white/60 hover:text-white transition-colors duration-300">Términos de servicio</a>
            <a href="#" class="text-sm text-white/60 hover:text-white transition-colors duration-300">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer mejorado con información completa
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 