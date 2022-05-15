import axios from 'axios'
import { useAuthStore } from './stores/auth'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/global.sass'

// dirty workaround
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).$axios = axios

// TODO: use this with axios...
// const token = localStorage.getItem('user-token')
//  if (token) {
//   axios.defaults.headers.common['Authorization'] = token
// }

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

const store = useAuthStore()

// check if authentication is required for the page
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !store.isAuthenticated) return '/auth/login'
})
