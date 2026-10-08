<template>
  <div class="mb-8">
    <h2 class="font-heading text-2xl font-bold text-primary-700 mb-6">Método de pago</h2>

    <div class="space-y-3">
      <label
        v-for="method in methods"
        :key="method.id"
        class="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors"
        :class="
          modelValue === method.id
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-200 hover:border-primary-300'
        "
      >
        <div class="flex items-center gap-3">
          <input
            type="radio"
            name="payment"
            :value="method.id"
            :checked="modelValue === method.id"
            @change="$emit('update:modelValue', method.id)"
            class="accent-purple-600"
          />
          <div>
            <div class="font-medium text-gray-800">{{ method.label }}</div>
            <div class="text-xs text-gray-500">{{ method.hint }}</div>
          </div>
        </div>
        <span
          v-if="method.badge"
          class="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium"
          >{{ method.badge }}</span
        >
      </label>
    </div>

    <p class="text-xs text-gray-500 mt-4">
      El pago se procesa de forma segura con Mercado Pago al confirmar el pedido. Todas las
      transacciones están protegidas.
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'card' },
})

defineEmits(['update:modelValue'])

// MX payment landscape (F6 maps these to the MP preference payment_methods)
const methods = [
  { id: 'card', label: 'Tarjeta de crédito/débito', hint: 'Visa, Mastercard, Amex', badge: null },
  {
    id: 'msi',
    label: 'Meses sin intereses',
    hint: 'Hasta 12 MSI con tarjetas participantes',
    badge: 'MSI',
  },
  {
    id: 'oxxo',
    label: 'Efectivo en tienda',
    hint: 'Voucher OXXO — confirma en hasta 72 h',
    badge: null,
  },
  {
    id: 'spei',
    label: 'Transferencia SPEI',
    hint: 'Transferencia bancaria — confirma en 24-48 h',
    badge: null,
  },
]
</script>
