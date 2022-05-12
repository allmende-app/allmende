import { defineStore } from 'pinia'
import type { User, Credentials } from '../interfaces/auth'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('user-token') || ('' as string),
    status: '' as string,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(user: User) {
      this.user = user
    },

    login(credentials: Credentials): promise {
      // TODO: send axios request to server here ... receive token and set token ...
      this.status = 'LOADING'

      console.log('login from authStore')

      return new Promise((resolve, reject) => {
        // TODO do axios request here instead of promise!!!

        // TODO use axios.defaults.headers.common['Authorization'] = token

        resolve('test')
      })
    },
    logout(): promise {
      console.log('logout user')
      return new Promise((resolve, reject) => {
        this.token = ''
        localStorage.removeItem('user-token')
        // TODO: use: delete axios.defaults.headers.common['Authorization']
        resolve(null)
      })
    },
  },
})
