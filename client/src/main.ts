import { useAuthStore } from './stores/auth';
import { createApp } from 'vue';
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'

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
