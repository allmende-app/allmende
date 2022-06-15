import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/global.sass'
import { FocusTrap } from 'focus-trap-vue'
import { backend } from '@/utils'
import { useAuthStore } from './stores/auth'

// dirty workaround
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).$axios = axios

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('FocusTrap', FocusTrap)
app.mount('#app')

/**
 * fetching user when authenticated, else redirect to login
 */
const authStore = useAuthStore()
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (authStore.user) {
      next()
    } else {
      backend.client
        .get('/api/users/')
        .then((response) => {
          authStore.setUser(response.data.user)
          next()
        })
        .catch((error) => {
          router.push('/auth/login')
        })
    }
  }
  next()
})
