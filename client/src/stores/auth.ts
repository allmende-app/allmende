import type { LoginInput, RegisterInput } from '@/interfaces/inputs'
import { defineStore } from 'pinia'
import { backend } from '../utils'

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => ({
    user: null
  }),

  actions: {
    register(registerData: RegisterInput): Promise<unknown> {
      return new Promise((resolve, reject) => {
        backend.client
          .post('/api/users/register', { user: registerData })
          .then((response) => {
            this.user = response.data.user
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    login(credentials: LoginInput): Promise<unknown> {
      return new Promise((resolve, reject) => {
        backend.client
          .post('/api/users/login', { user: credentials })
          .then((response) => {
            this.user = response.data.user
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    logout(): Promise<void> {
      return new Promise((resolve, reject) => {
        backend.client
          .delete('/api/users/logout')
          .then((response) => {
            this.user = null
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    setUser(user: any) {
      this.user = user
    }
  },
})
