<template>
  <div class="space-y-6">
    <h3 class="text-xl font-heading font-bold">Reseñas</h3>
    
    <!-- Resumen de valoraciones -->
    <div class="flex items-center space-x-4">
      <div class="text-center">
        <div class="text-3xl font-bold text-primary">{{ averageRating }}</div>
        <div class="flex justify-center mt-1">
          <span v-for="i in 5" :key="i" class="text-yellow-400">
            <svg v-if="i <= Math.round(averageRating)" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <svg v-else class="w-5 h-5 fill-current text-gray-300" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          </span>
        </div>
        <div class="text-sm text-gray-600">{{ reviews.length }} reseñas</div>
      </div>
    </div>

    <!-- Formulario para nueva reseña -->
    <div v-if="userStore.user" class="bg-gray-50 p-4 rounded-lg">
      <h4 class="font-heading font-bold mb-3">Escribe tu reseña</h4>
      <form @submit.prevent="submitReview">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Valoración</label>
          <div class="flex space-x-1">
            <button 
              v-for="i in 5" 
              :key="i"
              type="button"
              @click="newReview.rating = i"
              class="text-2xl"
              :class="i <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'"
            >
              ★
            </button>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Comentario</label>
          <textarea 
            v-model="newReview.comment"
            class="textarea textarea-bordered w-full"
            rows="3"
            placeholder="Comparte tu experiencia con este producto..."
            required
          ></textarea>
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Enviando...' : 'Enviar reseña' }}
        </button>
      </form>
    </div>

    <!-- Lista de reseñas -->
    <div class="space-y-4">
      <div v-for="review in reviews" :key="review.id" class="border-b pb-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <span class="font-medium">{{ review.userName }}</span>
            <div class="flex">
              <span v-for="i in 5" :key="i" class="text-yellow-400">
                <svg v-if="i <= review.rating" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                <svg v-else class="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              </span>
            </div>
          </div>
          <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
        </div>
        <p class="text-gray-700">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useToastStore } from '@/store/toast'

const props = defineProps({
  productId: {
    type: String,
    required: true
  }
})

const userStore = useUserStore()
const toastStore = useToastStore()

// Simulación de reseñas existentes
const reviews = ref([
  {
    id: 1,
    userName: 'María García',
    rating: 5,
    comment: 'Excelente producto, muy buena calidad y llegó en perfectas condiciones.',
    date: new Date('2024-01-15')
  },
  {
    id: 2,
    userName: 'Carlos López',
    rating: 4,
    comment: 'Buen producto, cumple con lo esperado. Recomendado.',
    date: new Date('2024-01-10')
  }
])

const newReview = ref({
  rating: 0,
  comment: ''
})

const submitting = ref(false)

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0)
  return (total / reviews.value.length).toFixed(1)
})

const submitReview = async () => {
  if (!userStore.user) return
  
  submitting.value = true
  
  // Simulación de envío
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const review = {
    id: Date.now(),
    userName: `${userStore.user.firstName} ${userStore.user.lastName}`,
    rating: newReview.value.rating,
    comment: newReview.value.comment,
    date: new Date()
  }
  
  reviews.value.unshift(review)
  
  // Reset form
  newReview.value = {
    rating: 0,
    comment: ''
  }
  
  submitting.value = false
  
  // Mostrar notificación de éxito
  toastStore.success('Reseña enviada', 'Gracias por compartir tu experiencia. Tu reseña ha sido publicada.')
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
</script> 