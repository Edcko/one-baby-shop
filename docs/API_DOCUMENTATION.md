# 🔌 Documentación de API - One Baby Shop

## 📋 Información General

### Base URL
```
Desarrollo: http://localhost:3000/api
Producción: https://api.onebabyshop.com/api
```

### Autenticación
La API utiliza **JWT (JSON Web Tokens)** para autenticación.

```http
Authorization: Bearer <token>
```

### Headers Comunes
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
```

## 🔐 Autenticación

### POST /auth/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/login
Inicia sesión de usuario.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/logout
Cierra sesión del usuario.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

### POST /auth/refresh
Renueva el token de acceso.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 🛍️ Productos

### GET /products
Obtiene lista de productos con filtros.

**Query Parameters:**
```
?page=1&limit=12&category=ropa&search=vestido&minPrice=10&maxPrice=100&sort=price&order=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Vestido de Bebé",
        "description": "Vestido cómodo y elegante para bebés",
        "price": 29.99,
        "originalPrice": 39.99,
        "category": "ropa",
        "subcategory": "vestidos",
        "images": [
          "https://example.com/vestido-1.jpg",
          "https://example.com/vestido-2.jpg"
        ],
        "rating": 4.5,
        "reviewCount": 12,
        "stock": 25,
        "tags": ["algodón", "cómodo", "elegante"],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 150,
      "totalPages": 13
    },
    "filters": {
      "categories": ["ropa", "juguetes", "alimentación"],
      "priceRange": {
        "min": 5.99,
        "max": 299.99
      }
    }
  }
}
```

### GET /products/:id
Obtiene detalles de un producto específico.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Vestido de Bebé",
      "description": "Vestido cómodo y elegante para bebés",
      "longDescription": "Este vestido está confeccionado con 100% algodón orgánico...",
      "price": 29.99,
      "originalPrice": 39.99,
      "category": "ropa",
      "subcategory": "vestidos",
      "images": [
        "https://example.com/vestido-1.jpg",
        "https://example.com/vestido-2.jpg"
      ],
      "rating": 4.5,
      "reviewCount": 12,
      "stock": 25,
      "tags": ["algodón", "cómodo", "elegante"],
      "specifications": {
        "material": "100% algodón",
        "talla": ["0-3M", "3-6M", "6-9M", "9-12M"],
        "color": ["rosa", "azul", "blanco"],
        "lavado": "Lavar a máquina 30°C"
      },
      "reviews": [
        {
          "id": 1,
          "userId": 2,
          "userName": "María García",
          "rating": 5,
          "comment": "Excelente calidad, muy suave",
          "createdAt": "2024-01-10T15:30:00Z"
        }
      ],
      "relatedProducts": [2, 3, 4],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### GET /products/categories
Obtiene todas las categorías de productos.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ropa",
      "slug": "ropa",
      "description": "Ropa para bebés y niños",
      "image": "https://example.com/ropa.jpg",
      "productCount": 45,
      "subcategories": [
        {
          "id": 1,
          "name": "Vestidos",
          "slug": "vestidos",
          "productCount": 12
        }
      ]
    }
  ]
}
```

## 🛒 Carrito

### GET /cart
Obtiene el carrito del usuario.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 1,
        "name": "Vestido de Bebé",
        "price": 29.99,
        "quantity": 2,
        "image": "https://example.com/vestido-1.jpg",
        "stock": 25
      }
    ],
    "summary": {
      "subtotal": 59.98,
      "shipping": 5.99,
      "tax": 6.00,
      "total": 71.97,
      "itemCount": 2
    }
  }
}
```

### POST /cart/add
Agrega un producto al carrito.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto agregado al carrito",
  "data": {
    "cartItem": {
      "id": 1,
      "productId": 1,
      "quantity": 2
    }
  }
}
```

### PUT /cart/update/:itemId
Actualiza la cantidad de un producto en el carrito.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Carrito actualizado"
}
```

### DELETE /cart/remove/:itemId
Elimina un producto del carrito.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto eliminado del carrito"
}
```

### DELETE /cart/clear
Vacía el carrito completo.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Carrito vaciado"
}
```

## 💳 Pedidos

### POST /orders
Crea un nuevo pedido.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "Juan Pérez",
    "address": "Calle Principal 123",
    "city": "Ciudad",
    "state": "Estado",
    "zipCode": "12345",
    "country": "País",
    "phone": "+1234567890"
  },
  "paymentMethod": "paypal",
  "paymentData": {
    "transactionId": "PAY-123456789",
    "payerId": "PAYER123456"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-2024-001",
      "status": "pending",
      "items": [
        {
          "productId": 1,
          "name": "Vestido de Bebé",
          "price": 29.99,
          "quantity": 2,
          "subtotal": 59.98
        }
      ],
      "summary": {
        "subtotal": 59.98,
        "shipping": 5.99,
        "tax": 6.00,
        "total": 71.97
      },
      "shippingAddress": {
        "name": "Juan Pérez",
        "address": "Calle Principal 123",
        "city": "Ciudad",
        "state": "Estado",
        "zipCode": "12345",
        "country": "País",
        "phone": "+1234567890"
      },
      "paymentMethod": "paypal",
      "paymentStatus": "paid",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### GET /orders
Obtiene el historial de pedidos del usuario.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=10&status=pending
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "status": "pending",
        "total": 71.97,
        "itemCount": 2,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### GET /orders/:id
Obtiene detalles de un pedido específico.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-2024-001",
      "status": "pending",
      "items": [
        {
          "productId": 1,
          "name": "Vestido de Bebé",
          "price": 29.99,
          "quantity": 2,
          "subtotal": 59.98
        }
      ],
      "summary": {
        "subtotal": 59.98,
        "shipping": 5.99,
        "tax": 6.00,
        "total": 71.97
      },
      "shippingAddress": {
        "name": "Juan Pérez",
        "address": "Calle Principal 123",
        "city": "Ciudad",
        "state": "Estado",
        "zipCode": "12345",
        "country": "País",
        "phone": "+1234567890"
      },
      "paymentMethod": "paypal",
      "paymentStatus": "paid",
      "trackingNumber": "TRK123456789",
      "shippingUpdates": [
        {
          "status": "shipped",
          "message": "Pedido enviado",
          "date": "2024-01-16T10:30:00Z"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-16T10:30:00Z"
    }
  }
}
```

## 👤 Usuarios

### GET /user/profile
Obtiene el perfil del usuario.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+1234567890",
      "avatar": "https://example.com/avatar.jpg",
      "addresses": [
        {
          "id": 1,
          "name": "Casa",
          "address": "Calle Principal 123",
          "city": "Ciudad",
          "state": "Estado",
          "zipCode": "12345",
          "country": "País",
          "isDefault": true
        }
      ],
      "preferences": {
        "newsletter": true,
        "notifications": true,
        "language": "es"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### PUT /user/profile
Actualiza el perfil del usuario.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "phone": "+1234567890",
  "preferences": {
    "newsletter": true,
    "notifications": true,
    "language": "es"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+1234567890",
      "preferences": {
        "newsletter": true,
        "notifications": true,
        "language": "es"
      }
    }
  }
}
```

### POST /user/addresses
Agrega una nueva dirección.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Trabajo",
  "address": "Calle Secundaria 456",
  "city": "Ciudad",
  "state": "Estado",
  "zipCode": "12345",
  "country": "País",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Dirección agregada exitosamente",
  "data": {
    "address": {
      "id": 2,
      "name": "Trabajo",
      "address": "Calle Secundaria 456",
      "city": "Ciudad",
      "state": "Estado",
      "zipCode": "12345",
      "country": "País",
      "isDefault": false
    }
  }
}
```

## ⭐ Favoritos

### GET /user/favorites
Obtiene la lista de favoritos del usuario.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": 1,
        "productId": 1,
        "name": "Vestido de Bebé",
        "price": 29.99,
        "image": "https://example.com/vestido-1.jpg",
        "addedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### POST /user/favorites
Agrega un producto a favoritos.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Producto agregado a favoritos"
}
```

### DELETE /user/favorites/:productId
Elimina un producto de favoritos.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto eliminado de favoritos"
}
```

## 🔍 Búsqueda

### GET /search
Búsqueda avanzada de productos.

**Query Parameters:**
```
?q=vestido&category=ropa&minPrice=10&maxPrice=100&sort=price&order=asc&page=1&limit=12
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Vestido de Bebé",
        "price": 29.99,
        "image": "https://example.com/vestido-1.jpg",
        "rating": 4.5,
        "reviewCount": 12
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 25,
      "totalPages": 3
    },
    "suggestions": [
      "vestido de niña",
      "vestido de fiesta",
      "vestido casual"
    ]
  }
}
```

## 📊 Analytics (Admin)

### GET /admin/analytics
Obtiene estadísticas para el panel de administración.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sales": {
      "total": 15420.50,
      "thisMonth": 3240.75,
      "lastMonth": 2890.30,
      "growth": 12.1
    },
    "orders": {
      "total": 156,
      "pending": 12,
      "shipped": 89,
      "delivered": 55
    },
    "users": {
      "total": 1247,
      "newThisMonth": 89,
      "active": 892
    },
    "products": {
      "total": 234,
      "lowStock": 12,
      "outOfStock": 3
    }
  }
}
```

## 🚨 Códigos de Error

### Errores Comunes

**400 - Bad Request**
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Datos de entrada inválidos",
  "details": {
    "email": "El email es requerido",
    "password": "La contraseña debe tener al menos 6 caracteres"
  }
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Token de autenticación inválido o expirado"
}
```

**403 - Forbidden**
```json
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "No tienes permisos para acceder a este recurso"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "El recurso solicitado no existe"
}
```

**500 - Internal Server Error**
```json
{
  "success": false,
  "error": "INTERNAL_ERROR",
  "message": "Error interno del servidor"
}
```

## 📝 Ejemplos de Uso

### JavaScript/Fetch
```javascript
// Login de usuario
const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (data.success) {
      localStorage.setItem('token', data.data.token)
      return data.data.user
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('Error en login:', error)
    throw error
  }
}

// Obtener productos
const getProducts = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(filters).toString()
    const response = await fetch(`/api/products?${queryString}`)
    const data = await response.json()
    
    return data.data
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    throw error
  }
}

// Agregar al carrito
const addToCart = async (productId, quantity) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    })
    
    const data = await response.json()
    
    if (data.success) {
      return data.message
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('Error agregando al carrito:', error)
    throw error
  }
}
```

### cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"password123"}'

# Obtener productos
curl -X GET "http://localhost:3000/api/products?category=ropa&page=1&limit=12"

# Agregar al carrito
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"productId":1,"quantity":2}'
```

---

**Para más información, contacta al equipo de desarrollo.** 