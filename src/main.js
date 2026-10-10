import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { reveal } from './directives/reveal'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

app.directive('reveal', reveal)

app.use(pinia)
app.use(router)

app.mount('#app')
