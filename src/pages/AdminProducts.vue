<template>
  <div class="min-h-screen flex bg-gray-50">
    <aside class="w-64 bg-gray-100 p-4 hidden md:block">
      <AdminSidebar />
    </aside>
    <main class="flex-1 p-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-heading font-bold">Productos</h2>
        <button
          @click="openForm()"
          class="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700"
        >
          + Nuevo producto
        </button>
      </div>

      <!-- Buscador -->
      <input
        v-model="search"
        @input="debouncedFetch"
        placeholder="Buscar por nombre o SKU…"
        class="w-full max-w-md px-4 py-2 mb-4 border border-gray-200 rounded-xl"
      />

      <!-- Formulario (nuevo / editar) -->
      <div
        v-if="formOpen"
        class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-primary-200"
      >
        <h3 class="font-heading font-bold text-lg mb-4">
          {{ editingId ? `Editar #${editingId}` : 'Nuevo producto' }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.name" placeholder="Nombre" class="input" />
          <input v-model="form.sku" placeholder="SKU (único)" class="input" />
          <input
            v-model="form.description"
            placeholder="Descripción corta"
            class="input md:col-span-2"
          />
          <label class="text-sm text-gray-600">
            Precio (MXN, IVA incluido)
            <input v-model.number="form.price" type="number" min="1" step="0.01" class="input" />
          </label>
          <label class="text-sm text-gray-600">
            Stock
            <input v-model.number="form.stock" type="number" min="0" class="input" />
          </label>
          <label class="text-sm text-gray-600">
            Categoría
            <select v-model="form.categorySlug" class="input">
              <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                {{ cat.name }}
              </option>
            </select>
          </label>
          <label class="text-sm text-gray-600">
            Tasa IVA
            <select v-model="form.ivaRate" class="input">
              <option value="SIXTEEN">16%</option>
              <option value="EIGHT">8%</option>
              <option value="ZERO">0% (tasa cero)</option>
            </select>
          </label>
          <input v-model="form.imageUrl" placeholder="URL de imagen" class="input md:col-span-2" />
          <div class="flex gap-6 items-center md:col-span-2">
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.isFeatured" type="checkbox" class="accent-purple-600" />
              Destacado
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.isActive" type="checkbox" class="accent-purple-600" /> Activo
            </label>
          </div>
        </div>
        <div class="flex gap-2 mt-4 justify-end">
          <button @click="formOpen = false" class="px-4 py-2 rounded-lg border-2 border-gray-200">
            Cancelar
          </button>
          <button
            @click="save"
            :disabled="saving"
            class="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {{ saving ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>
        <p v-if="formError" class="text-red-600 text-sm mt-2">{{ formError }}</p>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow overflow-x-auto">
        <table class="w-full text-sm" v-if="!loading">
          <thead class="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th class="px-4 py-3">Producto</th>
              <th class="px-4 py-3">Precio</th>
              <th class="px-4 py-3">Stock</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.image ?? ''"
                    alt=""
                    class="w-10 h-10 rounded-lg object-cover border"
                  />
                  <div>
                    <p class="font-medium text-gray-800">{{ product.name }}</p>
                    <p class="text-xs text-gray-400">
                      {{ product.sku }} · {{ product.categoryName }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 font-bold text-primary-700">
                {{ formatMXN(product.priceCents) }}
              </td>
              <td class="px-4 py-3">
                <span
                  :class="product.available <= 5 ? 'text-red-600 font-bold' : 'text-gray-700'"
                  >{{ product.available }}</span
                >
                <span class="text-xs text-gray-400" v-if="product.reservedQuantity > 0">
                  (+{{ product.reservedQuantity }} reservados)</span
                >
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-xs px-2 py-1 rounded-full font-semibold"
                  :class="
                    product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  "
                >
                  {{ product.isActive ? 'Activo' : 'Inactivo' }}
                </span>
                <span
                  v-if="product.isFeatured"
                  class="ml-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700"
                  >★</span
                >
              </td>
              <td class="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                <button
                  @click="openForm(product)"
                  class="px-3 py-1 rounded-lg border-2 border-gray-200 hover:border-primary-300 text-sm"
                >
                  Editar
                </button>
                <button
                  v-if="product.isActive"
                  @click="deactivate(product)"
                  class="px-3 py-1 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm"
                >
                  Desactivar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="py-12 text-center text-gray-400">Cargando…</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useToastStore } from '@/store/toast'
import { formatMXN } from '@/utils/money'
import AdminSidebar from '@/components/AdminSidebar.vue'

const toast = useToastStore()

const products = ref([])
const categories = ref([])
const loading = ref(true)
const search = ref('')

const formOpen = ref(false)
const editingId = ref(null)
const saving = ref(false)
const formError = ref('')
const emptyForm = {
  name: '',
  sku: '',
  description: '',
  price: null,
  stock: 0,
  categorySlug: '',
  ivaRate: 'SIXTEEN',
  imageUrl: '',
  isActive: true,
  isFeatured: false,
}
const form = ref({ ...emptyForm })

let debounce
function debouncedFetch() {
  clearTimeout(debounce)
  debounce = setTimeout(() => fetchProducts(), 300)
}

async function fetchProducts() {
  const response = await api(
    `/admin/products?limit=50${search.value ? `&search=${encodeURIComponent(search.value)}` : ''}`
  )
  if (response.ok) products.value = response.data.data.products
}

onMounted(async () => {
  await fetchProducts()
  const cats = await api('/categories')
  if (cats.ok) categories.value = cats.data.data.categories
  loading.value = false
})

function openForm(product = null) {
  formError.value = ''
  if (product) {
    editingId.value = product.id
    form.value = {
      name: product.name,
      sku: product.sku,
      description: product.description ?? '',
      price: product.priceCents / 100,
      stock: product.stockQuantity,
      categorySlug: categories.value.find((c) => c.name === product.categoryName)?.slug ?? '',
      ivaRate: product.ivaRate,
      imageUrl: product.image ?? '',
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    }
  } else {
    editingId.value = null
    form.value = { ...emptyForm }
  }
  formOpen.value = true
}

async function save() {
  saving.value = true
  formError.value = ''
  const body = {
    name: form.value.name,
    sku: form.value.sku,
    description: form.value.description,
    priceCents: Math.round(form.value.price * 100),
    stockQuantity: form.value.stock,
    categorySlug: form.value.categorySlug,
    ivaRate: form.value.ivaRate,
    imageUrl: form.value.imageUrl || null,
    isActive: form.value.isActive,
    isFeatured: form.value.isFeatured,
  }
  const response = editingId.value
    ? await api(`/admin/products/${editingId.value}`, { method: 'PUT', body })
    : await api('/admin/products', { method: 'POST', body })

  saving.value = false
  if (!response.ok) {
    formError.value = response.data?.message ?? 'Revisa los campos e inténtalo de nuevo.'
    return
  }
  formOpen.value = false
  toast.success(
    editingId.value ? 'Producto actualizado' : 'Producto creado',
    `${body.name} quedó guardado.`
  )
  await fetchProducts()
}

async function deactivate(product) {
  const response = await api(`/admin/products/${product.id}`, { method: 'DELETE' })
  if (response.ok) {
    toast.info('Producto desactivado', `${product.name} ya no aparece en el catálogo.`)
    await fetchProducts()
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  outline: none;
}
.input:focus {
  border-color: #9333ea;
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.15);
}
</style>
