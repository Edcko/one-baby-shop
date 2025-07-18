# 🍼 One Baby Shop

**Tu tienda de confianza para productos de bebé**

Una aplicación e-commerce moderna y completa desarrollada con Vue 3, Vite y Tailwind CSS. Diseñada para ofrecer la mejor experiencia de compra para productos infantiles.

## ✨ Características

### 🛒 Funcionalidades del E-commerce
- **Catálogo de productos** con filtros avanzados
- **Sistema de carrito** con persistencia en localStorage
- **Checkout completo** con integración de pagos (PayPal y Mercado Pago)
- **Sistema de usuarios** con registro, login y perfiles
- **Favoritos/Wishlist** para usuarios autenticados
- **Reseñas y valoraciones** de productos
- **Historial de pedidos** y seguimiento

### 👤 Gestión de Usuarios
- Registro y login de usuarios
- Recuperación de contraseña
- Perfiles de usuario personalizados
- Sistema de roles (usuario/admin)
- Panel de administración completo

### 🎨 Diseño y UX
- **Diseño moderno** con gradientes y animaciones
- **Responsive design** para todos los dispositivos
- **Accesibilidad mejorada** con ARIA labels y navegación por teclado
- **Loading states** y error boundaries
- **Notificaciones toast** para feedback del usuario

### 🛠️ Herramientas de Desarrollo
- **DevTools integrado** para debugging
- **Validación de datos** en tiempo real
- **Monitoreo de performance**
- **Logs detallados** para desarrollo
- **Error boundaries** para manejo elegante de errores

## 🚀 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/one-baby-shop.git
cd one-baby-shop
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 📁 Estructura del Proyecto

```
one-baby-shop/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/            # Imágenes y recursos
│   ├── components/        # Componentes reutilizables
│   │   ├── CartModal.vue
│   │   ├── DevTools.vue
│   │   ├── ErrorBoundary.vue
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── LoadingSpinner.vue
│   │   ├── ProductCard.vue
│   │   └── Toast.vue
│   ├── data/              # Datos estáticos
│   │   └── products.json
│   ├── layouts/           # Layouts de la aplicación
│   │   └── DefaultLayout.vue
│   ├── pages/             # Páginas de la aplicación
│   │   ├── Home.vue
│   │   ├── Catalog.vue
│   │   ├── Checkout.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   └── ...
│   ├── router/            # Configuración de rutas
│   │   └── index.js
│   ├── store/             # Stores de Pinia
│   │   ├── user.js
│   │   └── toast.js
│   ├── utils/             # Utilidades y helpers
│   │   └── debug.js
│   ├── App.vue            # Componente raíz
│   └── main.js            # Punto de entrada
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Funcionalidades Principales

### 🛍️ Catálogo de Productos
- **Filtros avanzados**: por categoría, precio y búsqueda
- **Ordenamiento**: por nombre, precio y popularidad
- **Vista de productos**: con imágenes, precios y valoraciones
- **Agregar al carrito**: con notificaciones instantáneas

### 🛒 Sistema de Carrito
- **Persistencia**: datos guardados en localStorage
- **Gestión de cantidades**: incrementar/decrementar productos
- **Cálculo automático**: totales y subtotales
- **Modal de carrito**: vista detallada de productos

### 💳 Checkout y Pagos
- **Múltiples métodos**: PayPal y Mercado Pago
- **Modo sandbox**: para pruebas seguras
- **Flujo completo**: desde carrito hasta confirmación
- **Notificaciones**: de éxito y error

### 👤 Sistema de Usuarios
- **Registro**: con validaciones completas
- **Login**: con credenciales seguras
- **Perfiles**: información personal editable
- **Favoritos**: lista de productos guardados
- **Historial**: de pedidos realizados

### 🔧 Panel de Administración
- **Dashboard**: estadísticas y métricas
- **Gestión de productos**: CRUD completo
- **Gestión de pedidos**: seguimiento y estados
- **Gestión de usuarios**: administración de cuentas

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Purple (#9333ea)
- **Secundario**: Pink (#ec4899)
- **Acento**: Yellow (#fbbf24)
- **Neutros**: Gray scale para textos y fondos

### Tipografía
- **Títulos**: Baloo 2 (cursiva)
- **Cuerpo**: Nunito (sans-serif)

### Componentes Reutilizables
- **ProductCard**: Tarjetas de productos con hover effects
- **LoadingSpinner**: Indicadores de carga
- **Toast**: Notificaciones del sistema
- **ErrorBoundary**: Manejo de errores
- **DevTools**: Herramientas de desarrollo

## 🛠️ Desarrollo

### Scripts Disponibles
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

### Variables de Entorno
```env
# Desarrollo
VITE_APP_TITLE=One Baby Shop
VITE_APP_API_URL=http://localhost:3000/api

# Producción
VITE_APP_TITLE=One Baby Shop
VITE_APP_API_URL=https://api.onebabyshop.com
```

### DevTools
En modo desarrollo, puedes acceder a las herramientas de desarrollo:
- **Botón flotante**: Esquina inferior derecha
- **Monitoreo**: Estado del carrito, usuario y localStorage
- **Testing**: Validaciones y simulaciones
- **Performance**: Métricas de rendimiento

## 🔧 Configuración

### Integración de Pagos
Para configurar los métodos de pago:

1. **PayPal**
   - Obtener Client ID de sandbox en [PayPal Developers](https://developer.paypal.com/)
   - Reemplazar en `src/pages/Checkout.vue`

2. **Mercado Pago**
   - Obtener Public Key de test en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/)
   - Reemplazar en `src/pages/Checkout.vue`

### Backend Integration
Para conectar con un backend:

1. **Configurar API endpoints** en los stores
2. **Reemplazar localStorage** por llamadas a API
3. **Implementar autenticación** con JWT
4. **Configurar CORS** en el servidor

## 🧪 Testing

### Validaciones Implementadas
- ✅ Datos del carrito
- ✅ Información de usuario
- ✅ Formularios de registro/login
- ✅ Integridad de localStorage
- ✅ Performance de componentes

### Herramientas de Debugging
- **Console logs** con emojis para fácil identificación
- **Error boundaries** para captura de errores
- **Performance monitoring** para métricas
- **DevTools panel** para desarrollo

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Características Responsive
- **Grid adaptativo**: productos se ajustan automáticamente
- **Menú móvil**: navegación optimizada para touch
- **Modal responsive**: carrito y formularios
- **Imágenes optimizadas**: lazy loading y tamaños adaptativos

## 🔒 Seguridad

### Implementaciones de Seguridad
- **Validación de datos**: en frontend y backend
- **Sanitización**: de inputs de usuario
- **CORS**: configuración para APIs
- **HTTPS**: en producción
- **Error handling**: sin exposición de información sensible

## 🚀 Despliegue

### Build para Producción
```bash
npm run build
```

### Servidor Web
Configurar un servidor web (nginx, Apache) para servir los archivos estáticos.

### Variables de Entorno
Asegurarse de configurar las variables de entorno para producción.

## 🤝 Contribución

### Guías de Contribución
1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código
- **Vue 3 Composition API** para componentes
- **Tailwind CSS** para estilos
- **ESLint** para linting
- **Prettier** para formateo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

### Contacto
- **Email**: soporte@onebabyshop.com
- **Documentación**: [docs.onebabyshop.com](https://docs.onebabyshop.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/one-baby-shop/issues)

### Recursos Adicionales
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

**Desarrollado con ❤️ para One Baby Shop**
