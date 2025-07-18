<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- Spinner principal -->
      <div class="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      
      <!-- Spinner secundario (opcional) -->
      <div v-if="showSecondary" class="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-pink-400 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
    </div>
    
    <!-- Texto de carga -->
    <span v-if="text" class="ml-3 text-gray-600 font-medium">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  showSecondary: {
    type: Boolean,
    default: false
  },
  containerClass: {
    type: String,
    default: 'p-8'
  }
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style> 