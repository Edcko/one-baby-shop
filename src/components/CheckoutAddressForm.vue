<template>
  <div class="mb-8">
    <h2 class="font-heading text-2xl font-bold text-primary-700 mb-6">Dirección de envío</h2>

    <!-- Direcciones guardadas -->
    <div v-if="savedAddresses.length > 0" class="mb-6 space-y-3">
      <button
        v-for="address in savedAddresses"
        :key="address.id"
        type="button"
        @click="$emit('select-saved', address)"
        class="w-full text-left p-4 rounded-xl border-2 transition-colors"
        :class="
          selectedId === address.id
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-200 hover:border-primary-300'
        "
      >
        <div class="flex items-center justify-between">
          <span class="font-semibold text-gray-800">{{ address.recipientName }}</span>
          <span
            v-if="address.isDefault"
            class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
            >Predeterminada</span
          >
        </div>
        <p class="text-sm text-gray-600 mt-1">
          {{ address.street }} {{ address.exteriorNumber
          }}<span v-if="address.interiorNumber">, {{ address.interiorNumber }}</span> ·
          {{ address.colonia }} · {{ address.municipality }}, {{ address.state }} · CP
          {{ address.postalCode }}
        </p>
        <p class="text-sm text-gray-500">Tel: {{ address.phone }}</p>
      </button>

      <button
        type="button"
        @click="$emit('select-new')"
        class="w-full p-4 rounded-xl border-2 border-dashed transition-colors"
        :class="
          selectedId === null
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-300 hover:border-primary-300'
        "
      >
        <span class="font-medium text-primary-700">+ Usar otra dirección</span>
      </button>
    </div>

    <!-- Formulario (dirección nueva) -->
    <form v-if="selectedId === null" class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de quien recibe</label>
        <input
          v-model="form.recipientName"
          type="text"
          required
          minlength="3"
          placeholder="Nombre y apellido"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono (10 dígitos)</label>
        <input
          v-model="form.phone"
          type="tel"
          required
          pattern="[0-9]{10}"
          maxlength="10"
          placeholder="5512345678"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">Calle</label>
        <input
          v-model="form.street"
          type="text"
          required
          placeholder="Av. Reforma"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Número exterior</label>
        <input
          v-model="form.exteriorNumber"
          type="text"
          required
          placeholder="123"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Número interior (opcional)</label
        >
        <input
          v-model="form.interiorNumber"
          type="text"
          placeholder="4B"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Colonia</label>
        <input
          v-model="form.colonia"
          type="text"
          required
          placeholder="Juárez"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Alcaldía / Municipio</label>
        <input
          v-model="form.municipality"
          type="text"
          required
          placeholder="Cuauhtémoc"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
        <input
          v-model="form.state"
          type="text"
          required
          placeholder="CDMX"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Código postal (5 dígitos)</label
        >
        <input
          v-model="form.postalCode"
          type="text"
          required
          pattern="[0-9]{5}"
          maxlength="5"
          placeholder="06600"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">Referencias (opcional)</label>
        <input
          v-model="form.references"
          type="text"
          placeholder="Timbrar 4B, casa azul…"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <label class="md:col-span-2 flex items-center gap-2 text-sm text-gray-700">
        <input v-model="saveAddress" type="checkbox" class="accent-purple-600" />
        Guardar esta dirección en mi cuenta
      </label>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

defineProps({
  savedAddresses: { type: Array, default: () => [] },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select-saved', 'select-new', 'update:form'])

const saveAddress = ref(true)

const form = reactive({
  recipientName: '',
  phone: '',
  street: '',
  exteriorNumber: '',
  interiorNumber: '',
  colonia: '',
  municipality: '',
  state: '',
  postalCode: '',
  references: '',
})

watch(form, (value) => emit('update:form', { ...value, saveAddress: saveAddress.value }), {
  deep: true,
})
watch(saveAddress, (v) => emit('update:form', { ...form, saveAddress: v }))

function reset() {
  Object.assign(form, {
    recipientName: '',
    phone: '',
    street: '',
    exteriorNumber: '',
    interiorNumber: '',
    colonia: '',
    municipality: '',
    state: '',
    postalCode: '',
    references: '',
  })
}

defineExpose({ reset })
</script>
