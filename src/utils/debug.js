// Utilidades de debugging y testing

// Logger personalizado para desarrollo
export const debug = {
  log: (message, data = null) => {
    if (import.meta.env.DEV) {
      console.log(`🔍 [DEBUG] ${message}`, data)
    }
  },
  
  error: (message, error = null) => {
    if (import.meta.env.DEV) {
      console.error(`❌ [ERROR] ${message}`, error)
    }
  },
  
  warn: (message, data = null) => {
    if (import.meta.env.DEV) {
      console.warn(`⚠️ [WARN] ${message}`, data)
    }
  },
  
  info: (message, data = null) => {
    if (import.meta.env.DEV) {
      console.info(`ℹ️ [INFO] ${message}`, data)
    }
  }
}

// Función para validar datos del carrito
export const validateCartItem = (item) => {
  const required = ['id', 'name', 'price', 'quantity']
  const missing = required.filter(field => !item[field])
  
  if (missing.length > 0) {
    debug.error(`Cart item missing required fields: ${missing.join(', ')}`, item)
    return false
  }
  
  if (typeof item.price !== 'number' || item.price <= 0) {
    debug.error('Invalid price in cart item', item)
    return false
  }
  
  if (typeof item.quantity !== 'number' || item.quantity <= 0) {
    debug.error('Invalid quantity in cart item', item)
    return false
  }
  
  return true
}

// Función para validar datos de usuario
export const validateUser = (user) => {
  if (!user) {
    debug.error('User is null or undefined')
    return false
  }
  
  const required = ['firstName', 'lastName', 'email']
  const missing = required.filter(field => !user[field])
  
  if (missing.length > 0) {
    debug.error(`User missing required fields: ${missing.join(', ')}`, user)
    return false
  }
  
  // Validar email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(user.email)) {
    debug.error('Invalid email format', user.email)
    return false
  }
  
  return true
}

// Función para monitorear performance
export const performanceMonitor = {
  start: (label) => {
    if (import.meta.env.DEV) {
      console.time(`⏱️ [PERF] ${label}`)
    }
  },
  
  end: (label) => {
    if (import.meta.env.DEV) {
      console.timeEnd(`⏱️ [PERF] ${label}`)
    }
  },
  
  measure: async (label, fn) => {
    if (import.meta.env.DEV) {
      const start = performance.now()
      const result = await fn()
      const end = performance.now()
      console.log(`⏱️ [PERF] ${label}: ${(end - start).toFixed(2)}ms`)
      return result
    } else {
      return await fn()
    }
  }
}

// Función para testing de localStorage
export const localStorageTest = {
  isAvailable: () => {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      debug.error('localStorage not available', e)
      return false
    }
  },
  
  getSize: () => {
    try {
      let size = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length
        }
      }
      return size
    } catch (e) {
      debug.error('Error calculating localStorage size', e)
      return 0
    }
  },
  
  clearOld: (maxAge = 7 * 24 * 60 * 60 * 1000) => { // 7 días por defecto
    try {
      const now = Date.now()
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const item = JSON.parse(localStorage[key])
          if (item.timestamp && (now - item.timestamp) > maxAge) {
            localStorage.removeItem(key)
            debug.info(`Cleared old localStorage item: ${key}`)
          }
        }
      }
    } catch (e) {
      debug.error('Error clearing old localStorage items', e)
    }
  }
}

// Función para debugging de rutas
export const routeDebug = {
  logNavigation: (to, from) => {
    if (import.meta.env.DEV) {
      debug.info(`Navigation: ${from?.path || '/'} → ${to.path}`)
    }
  },
  
  logRouteError: (error) => {
    debug.error('Route navigation error', error)
  }
}

// Función para debugging de estado
export const stateDebug = {
  logStoreChange: (storeName, action, data) => {
    if (import.meta.env.DEV) {
      debug.info(`Store [${storeName}] ${action}`, data)
    }
  },
  
  logCartChange: (action, items) => {
    if (import.meta.env.DEV) {
      debug.info(`Cart ${action}`, {
        itemCount: items.length,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      })
    }
  }
}

// Función para debugging de errores de red
export const networkDebug = {
  logRequest: (url, method, data) => {
    if (import.meta.env.DEV) {
      debug.info(`🌐 [NETWORK] ${method} ${url}`, data)
    }
  },
  
  logResponse: (url, status, data) => {
    if (import.meta.env.DEV) {
      const icon = status >= 200 && status < 300 ? '✅' : '❌'
      debug.info(`${icon} [NETWORK] ${status} ${url}`, data)
    }
  },
  
  logError: (url, error) => {
    debug.error(`🌐 [NETWORK] Error in ${url}`, error)
  }
} 