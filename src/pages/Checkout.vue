<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Selecciona el método de pago</h2>
      <div class="flex gap-4 mb-4">
        <button
          class="px-4 py-2 rounded border focus:outline-none"
          :class="paymentMethod === 'paypal' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'"
          @click="paymentMethod = 'paypal'"
        >
          PayPal
        </button>
        <button
          class="px-4 py-2 rounded border focus:outline-none"
          :class="paymentMethod === 'mercadopago' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'"
          @click="paymentMethod = 'mercadopago'"
        >
          Mercado Pago
        </button>
      </div>
    </div>

    <div v-if="paymentMethod === 'paypal'">
      <h3 class="font-semibold mb-2">Pagar con PayPal</h3>
      <div id="paypal-button-container"></div>
    </div>

    <div v-if="paymentMethod === 'mercadopago'">
      <h3 class="font-semibold mb-2">Pagar con Mercado Pago</h3>
      <div id="mercadopago-button-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/store/toast'

const paymentMethod = ref('paypal')
const router = useRouter()
const toastStore = useToastStore()

// Credenciales de ejemplo (reemplaza por las tuyas en producción)
const PAYPAL_CLIENT_ID = 'sb'; // 'sb' es el client-id de sandbox de PayPal
const MP_PUBLIC_KEY = 'TEST-12345678-abcdefghijklmno'; // Ejemplo de public key de Mercado Pago

function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function limpiarCarrito() {
  localStorage.removeItem('cart');
  // Si usas un store de carrito, aquí también lo vacías
}

function pagoExitoso(metodo) {
  limpiarCarrito();
  toastStore.success('¡Pago exitoso!', `Tu pago con ${metodo} fue procesado correctamente. Gracias por tu compra.`);
  setTimeout(() => {
    router.push('/orders'); // Redirige al historial de pedidos o página de confirmación
  }, 1500);
}

async function renderPayPalButton() {
  await loadScript(`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`, 'paypal-sdk');
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        // Monto de ejemplo, reemplaza por el real
        return actions.order.create({
          purchase_units: [{ amount: { value: '10.00' } }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          pagoExitoso('PayPal');
        });
      },
      onError: (err) => {
        toastStore.error('Error en el pago con PayPal', 'Ocurrió un problema al procesar el pago.');
      }
    }).render('#paypal-button-container');
  }
}

async function renderMercadoPagoButton() {
  await loadScript('https://sdk.mercadopago.com/js/v2', 'mp-sdk');
  if (window.MercadoPago) {
    const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'es-AR' });
    // Preferencia de ejemplo, normalmente la genera el backend
    const preferenceId = '123456789-abcdef-123456-abcdef';
    mp.checkout({
      preference: { id: preferenceId },
      render: {
        container: '#mercadopago-button-container',
        label: 'Pagar con Mercado Pago',
      },
      onComplete: () => {
        pagoExitoso('Mercado Pago');
      }
    });
  }
}

// Renderiza el botón correspondiente cuando cambia el método de pago
watch(paymentMethod, async (method) => {
  await nextTick();
  if (method === 'paypal') {
    document.getElementById('paypal-button-container').innerHTML = '';
    renderPayPalButton();
  } else if (method === 'mercadopago') {
    document.getElementById('mercadopago-button-container').innerHTML = '';
    renderMercadoPagoButton();
  }
});

// Render inicial
onMounted(async () => {
  if (paymentMethod.value === 'paypal') {
    renderPayPalButton();
  } else if (paymentMethod.value === 'mercadopago') {
    renderMercadoPagoButton();
  }
});
</script>

<style scoped>
button {
  transition: background 0.2s, border 0.2s;
}
</style> 