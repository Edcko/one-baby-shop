<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="font-heading text-3xl font-bold text-gray-900 mb-2">Checkout</h1>

    <!-- Progreso -->
    <ol v-if="step < 4" class="flex items-center gap-2 mb-8 text-sm">
      <li
        v-for="(label, index) in ['Dirección', 'Resumen', 'Pago']"
        :key="label"
        class="flex items-center gap-2"
      >
        <span
          class="w-7 h-7 rounded-full flex items-center justify-center font-bold"
          :class="
            step > index
              ? 'bg-primary-600 text-white'
              : step === index + 1
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-600'
                : 'bg-gray-100 text-gray-400'
          "
          >{{ index + 1 }}</span
        >
        <span :class="step === index + 1 ? 'font-semibold text-gray-800' : 'text-gray-500'">{{
          label
        }}</span>
        <span v-if="index < 2" class="w-8 h-px bg-gray-300 mx-1"></span>
      </li>
    </ol>

    <!-- Paso 1: dirección -->
    <template v-if="step === 1">
      <CheckoutAddressForm
        ref="addressFormRef"
        :saved-addresses="savedAddresses"
        :selected-id="selectedAddressId"
        @select-saved="chooseSaved"
        @select-new="selectedAddressId = null"
        @update:form="newAddress = $event"
      />
      <div class="flex justify-end">
        <button
          @click="goToSummary"
          :disabled="!hasValidAddress"
          class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar al resumen
        </button>
      </div>
    </template>

    <!-- Paso 2: resumen -->
    <template v-else-if="step === 2">
      <div
        v-if="selectedAddress"
        class="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-xl flex justify-between items-start"
      >
        <div class="text-sm">
          <p class="font-semibold text-gray-800">{{ selectedAddress.recipientName }}</p>
          <p class="text-gray-600">
            {{ selectedAddress.street }} {{ selectedAddress.exteriorNumber }}
            {{ selectedAddress.interiorNumber ? ', ' + selectedAddress.interiorNumber : '' }} ·
            {{ selectedAddress.colonia }} · {{ selectedAddress.municipality }},
            {{ selectedAddress.state }} · CP {{ selectedAddress.postalCode }}
          </p>
          <p class="text-gray-500">Tel: {{ selectedAddress.phone }}</p>
        </div>
        <button @click="step = 1" class="text-primary-700 font-medium text-sm hover:underline">
          Cambiar
        </button>
      </div>

      <CheckoutSummary
        :items="cartStore.items"
        :subtotal-cents="subtotalCents"
        :iva-cents="estimatedIvaCents"
        :shipping-cents="estimatedShippingCents"
        :total-cents="estimatedTotalCents"
      />

      <div class="flex justify-between">
        <button
          @click="step = 1"
          class="px-6 py-3 rounded-xl border-2 border-gray-200 font-medium text-gray-700 hover:border-primary-300"
        >
          Regresar
        </button>
        <button
          @click="step = 3"
          class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold hover:from-primary-700 hover:to-primary-800 transition-all"
        >
          Continuar al pago
        </button>
      </div>
    </template>

    <!-- Paso 3: pago -->
    <template v-else-if="step === 3">
      <CheckoutSummary
        :items="cartStore.items"
        :subtotal-cents="subtotalCents"
        :iva-cents="estimatedIvaCents"
        :shipping-cents="estimatedShippingCents"
        :total-cents="estimatedTotalCents"
      />
      <CheckoutPayment v-model="paymentMethod" />

      <div class="flex justify-between">
        <button
          @click="step = 2"
          class="px-6 py-3 rounded-xl border-2 border-gray-200 font-medium text-gray-700 hover:border-primary-300"
        >
          Regresar
        </button>
        <button
          @click="placeOrder"
          :disabled="placing"
          class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50"
        >
          {{ placing ? 'Creando pedido…' : `Confirmar pedido · ${formatMXN(estimatedTotalCents)}` }}
        </button>
      </div>
    </template>

    <!-- Paso 4: confirmación -->
    <CheckoutConfirmation v-else-if="createdOrder" :order="createdOrder" />

    <!-- Carrito vacío -->
    <div v-if="cartEmpty && step < 4" class="text-center py-16">
      <h2 class="text-xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
      <p class="text-gray-600 mb-6">Agrega productos antes de continuar con el checkout.</p>
      <router-link
        to="/catalog"
        class="inline-block px-6 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700"
        >Ir al catálogo</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/store/cart'
import { useToastStore } from '@/store/toast'
import { api } from '@/services/api'
import { formatMXN } from '@/utils/money'
import CheckoutAddressForm from '@/components/CheckoutAddressForm.vue'
import CheckoutSummary from '@/components/CheckoutSummary.vue'
import CheckoutPayment from '@/components/CheckoutPayment.vue'
import CheckoutConfirmation from '@/components/CheckoutConfirmation.vue'

const cartStore = useCartStore()
const toastStore = useToastStore()

const step = ref(1)
const placing = ref(false)
const createdOrder = ref(null)
const paymentMethod = ref('card')

// ── Direcciones ────────────────────────────────────────────────────────────
const savedAddresses = ref([])
const selectedAddressId = ref(null)
const newAddress = ref(null)

const selectedAddress = computed(() => {
  if (selectedAddressId.value !== null) {
    return savedAddresses.value.find((a) => a.id === selectedAddressId.value) ?? null
  }
  return newAddress.value && isCompleteAddress(newAddress.value) ? newAddress.value : null
})

const hasValidAddress = computed(() => selectedAddress.value !== null)

function isCompleteAddress(address) {
  return Boolean(
    address?.recipientName &&
    /^[0-9]{10}$/.test(address.phone ?? '') &&
    address.street &&
    address.exteriorNumber &&
    address.colonia &&
    address.municipality &&
    address.state &&
    /^[0-9]{5}$/.test(address.postalCode ?? '')
  )
}

function chooseSaved(address) {
  selectedAddressId.value = address.id
}

onMounted(async () => {
  const response = await api('/user/addresses')
  if (response.ok) {
    savedAddresses.value = response.data.data.addresses
    const preferred = savedAddresses.value.find((a) => a.isDefault) ?? savedAddresses.value[0]
    if (preferred) selectedAddressId.value = preferred.id
  }
})

// ── Totales (espejo de visualización; el servidor recalcula TODO) ──────────
const cartEmpty = computed(() => cartStore.items.length === 0 && step.value < 4)
const subtotalCents = computed(() => cartStore.totalCents)
const estimatedShippingCents = computed(() =>
  subtotalCents.value >= 50000 ? 0 : subtotalCents.value > 0 ? 9900 : 0
)
const estimatedTotalCents = computed(() => subtotalCents.value + estimatedShippingCents.value)
const estimatedIvaCents = computed(() =>
  Math.round(subtotalCents.value - subtotalCents.value / 1.16)
)

function goToSummary() {
  if (!hasValidAddress.value) {
    toastStore.warning('Falta información', 'Completa los campos de la dirección de envío.')
    return
  }
  step.value = 2
}

// ── Crear pedido ───────────────────────────────────────────────────────────
async function placeOrder() {
  placing.value = true
  try {
    const address = { ...selectedAddress.value }

    // Persist as a saved address if the user asked for it (best effort).
    if (selectedAddressId.value === null && address.saveAddress && !address.id) {
      const saved = await api('/user/addresses', {
        method: 'POST',
        body: {
          recipientName: address.recipientName,
          phone: address.phone,
          street: address.street,
          exteriorNumber: address.exteriorNumber,
          interiorNumber: address.interiorNumber || null,
          colonia: address.colonia,
          municipality: address.municipality,
          state: address.state,
          postalCode: address.postalCode,
          references: address.references || null,
        },
      })
      if (saved.ok) savedAddresses.value.push(saved.data.data)
    }

    const response = await api('/orders', {
      method: 'POST',
      body: {
        shippingAddress: {
          recipientName: address.recipientName,
          phone: address.phone,
          street: address.street,
          exteriorNumber: address.exteriorNumber,
          interiorNumber: address.interiorNumber || null,
          colonia: address.colonia,
          municipality: address.municipality,
          state: address.state,
          postalCode: address.postalCode,
          references: address.references || null,
        },
      },
    })

    if (!response.ok) {
      // 409 = stock insuficiente; el servidor dice qué producto falló
      toastStore.error(
        'No se pudo crear el pedido',
        response.data?.message ?? 'Revisa tu carrito e inténtalo de nuevo.'
      )
      if (response.status === 409) step.value = 2
      return
    }

    createdOrder.value = {
      ...response.data.data,
      paymentMethod: paymentMethod.value,
    }
    // El carrito servidor quedó vacío; recargar SIN merge (syncOnLogin re-agregaría)
    await cartStore.refreshFromServer()
    step.value = 4
  } finally {
    placing.value = false
  }
}
</script>
