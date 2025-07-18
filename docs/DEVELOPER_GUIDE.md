# 👨‍💻 Guía de Desarrollador - One Baby Shop

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Frontend**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Development**: ESLint + Prettier

### Estructura de Carpetas
```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas de la aplicación
├── layouts/       # Layouts principales
├── store/         # Stores de Pinia
├── router/        # Configuración de rutas
├── utils/         # Utilidades y helpers
├── data/          # Datos estáticos
└── assets/        # Recursos estáticos
```

## 🎯 Patrones de Desarrollo

### Componentes Vue 3
```vue
<template>
  <!-- Template con Tailwind CSS -->
</template>

<script setup>
// Composition API
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store/store'

// Props y emits
const props = defineProps({
  title: String,
  items: Array
})

const emit = defineEmits(['update', 'delete'])

// Reactive state
const loading = ref(false)
const data = ref([])

// Computed properties
const filteredData = computed(() => {
  return data.value.filter(item => item.active)
})

// Methods
const handleClick = () => {
  emit('update', data.value)
}

// Lifecycle
onMounted(() => {
  // Inicialización
})
</script>
```

### Stores con Pinia
```javascript
// store/example.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref([])
  const loading = ref(false)

  // Getters
  const totalItems = computed(() => items.value.length)

  // Actions
  const fetchItems = async () => {
    loading.value = true
    try {
      // API call
      items.value = await api.getItems()
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    totalItems,
    fetchItems
  }
})
```

### Rutas con Vue Router
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { title: 'Inicio' }
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: ProductDetail,
        props: true
      }
    ]
  }
]
```

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
/* Tailwind config */
colors: {
  primary: {
    50: '#faf5ff',
    500: '#9333ea',
    600: '#7c3aed',
    700: '#6d28d9'
  },
  secondary: {
    500: '#ec4899',
    600: '#db2777'
  },
  accent: {
    400: '#fbbf24',
    500: '#f59e0b'
  }
}
```

### Componentes Base
- **ProductCard**: Tarjetas de productos
- **LoadingSpinner**: Indicadores de carga
- **Toast**: Notificaciones del sistema
- **ErrorBoundary**: Manejo de errores
- **DevTools**: Herramientas de desarrollo

### Responsive Design
```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Contenido responsive -->
  </div>
</template>
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```env
# .env.development
VITE_APP_TITLE=One Baby Shop (Dev)
VITE_APP_API_URL=http://localhost:3000/api
VITE_APP_DEBUG=true

# .env.production
VITE_APP_TITLE=One Baby Shop
VITE_APP_API_URL=https://api.onebabyshop.com
VITE_APP_DEBUG=false
```

### Scripts de Desarrollo
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs",
    "format": "prettier --write src/"
  }
}
```

## 🧪 Testing y Debugging

### Utilidades de Debug
```javascript
// utils/debug.js
export const debug = {
  log: (message, data) => {
    if (import.meta.env.DEV) {
      console.log(`🔍 [DEBUG] ${message}`, data)
    }
  },
  error: (message, error) => {
    if (import.meta.env.DEV) {
      console.error(`❌ [ERROR] ${message}`, error)
    }
  }
}
```

### Validaciones
```javascript
// Validación de datos
export const validateCartItem = (item) => {
  const required = ['id', 'name', 'price', 'quantity']
  return required.every(field => item[field])
}
```

### DevTools
- **Acceso**: Solo en modo desarrollo
- **Funcionalidades**: Monitoreo de estado, testing, logs
- **Ubicación**: Esquina inferior derecha

## 📦 Gestión de Estado

### Stores Principales
1. **UserStore**: Autenticación y perfil de usuario
2. **ToastStore**: Notificaciones del sistema
3. **CartStore**: Gestión del carrito (futuro)

### Patrones de Estado
```javascript
// Estado local vs global
const localState = ref([]) // Solo para el componente
const globalState = useStore() // Compartido entre componentes

// Computed properties para derivaciones
const filteredItems = computed(() => {
  return items.value.filter(item => item.active)
})
```

## 🚀 Optimización

### Performance
- **Lazy loading**: Componentes y rutas
- **Memoización**: computed properties
- **Virtual scrolling**: Para listas grandes
- **Image optimization**: Lazy loading de imágenes

### Bundle Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['@headlessui/vue', '@heroicons/vue']
        }
      }
    }
  }
})
```

## 🔒 Seguridad

### Validaciones
- **Frontend**: Validación de formularios
- **Backend**: Validación de datos (futuro)
- **Sanitización**: Limpieza de inputs

### Autenticación
```javascript
// Protección de rutas
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/login')
      } else if (!isAdmin()) {
        next('/')
      } else {
        next()
      }
    }
  }
]
```

## 📱 Responsive Development

### Breakpoints
```css
/* Tailwind breakpoints */
sm: '640px'   /* Small */
md: '768px'   /* Medium */
lg: '1024px'  /* Large */
xl: '1280px'  /* Extra Large */
2xl: '1536px' /* 2X Large */
```

### Mobile First
```vue
<template>
  <!-- Mobile first approach -->
  <div class="w-full md:w-1/2 lg:w-1/3">
    <!-- Contenido responsive -->
  </div>
</template>
```

## 🔄 Integración con APIs

### Patrón de API Calls
```javascript
// utils/api.js
const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${baseURL}${endpoint}`)
      return await response.json()
    } catch (error) {
      throw new Error(`API Error: ${error.message}`)
    }
  },
  
  async post(endpoint, data) {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      throw new Error(`API Error: ${error.message}`)
    }
  }
}
```

## 🎯 Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase (ProductCard.vue)
- **Archivos**: kebab-case (user-profile.vue)
- **Variables**: camelCase (userName)
- **Constantes**: UPPER_SNAKE_CASE (API_BASE_URL)

### Estructura de Componentes
```vue
<template>
  <!-- 1. Template -->
</template>

<script setup>
// 2. Imports
import { ref, computed } from 'vue'

// 3. Props y emits
const props = defineProps({})
const emit = defineEmits([])

// 4. Composables
const store = useStore()

// 5. Reactive state
const data = ref([])

// 6. Computed properties
const computedValue = computed(() => {})

// 7. Methods
const handleClick = () => {}

// 8. Lifecycle
onMounted(() => {})
</script>

<style scoped>
/* 9. Styles */
</style>
```

## 🤝 Contribución

### Flujo de Trabajo
1. **Fork** el repositorio
2. **Crea** una rama para tu feature
3. **Desarrolla** siguiendo las convenciones
4. **Testea** tu código
5. **Commit** con mensajes descriptivos
6. **Push** y crea un Pull Request

### Estándares de Código
- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **Vue Style Guide**: Mejores prácticas
- **TypeScript**: Para futuras versiones

### Testing
```javascript
// Ejemplo de test unitario
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        title: 'Test Product',
        price: 29.99
      }
    })
    
    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('29.99')
  })
})
```

## 📚 Recursos Adicionales

### Documentación
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)

### Herramientas
- **Vue DevTools**: Extensión del navegador
- **Tailwind CSS IntelliSense**: Extensión de VS Code
- **ESLint**: Linting de código
- **Prettier**: Formateo automático

### Comunidad
- **Vue.js Forum**: Comunidad oficial
- **Stack Overflow**: Preguntas y respuestas
- **GitHub Issues**: Reportes de bugs
- **Discord**: Comunidad de desarrolladores

---

**¡Happy Coding! 🚀** 