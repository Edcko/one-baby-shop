import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ErrorBoundary from './components/ErrorBoundary.vue'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Registrar ErrorBoundary globalmente
app.component('ErrorBoundary', ErrorBoundary)

app.mount('#app')

