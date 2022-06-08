import axios from 'axios'
import { useAuthStore } from './stores/auth'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/global.sass'

// dirty workaround
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).$axios = axios

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
