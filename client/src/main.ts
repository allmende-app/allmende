import axios from 'axios'
import { useAuthStore } from './stores/auth'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/global.sass'
import { backend } from '@/utils';

// dirty workaround
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).$axios = axios

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')


/**
 * fetching user when authenticated, else redirect to login
 */
const authStore = useAuthStore()
router.beforeEach((to, from, next) => {
  if (authStore.user) {
    next()
  } else {
    backend.client.get("/api/users/")
      .then(response => {
        authStore.setUser(response.data.user)
        next()
      })
      .catch(error => {
        router.push("/auth/login")
      })
  }
})
