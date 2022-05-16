import { defineStore } from 'pinia'
import type { User, Credentials } from '../interfaces/auth'
import type { RegisterInput, LoginInput } from '../../../server/src/interfaces/inputs'
import axios from 'axios'
import { backend } from '../utils';

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

    register(registerData: RegisterInput) : Promise<unknown> {
      return new Promise((resolve, reject) => {
        backend.client
          .post("/api/users/register", { user: registerData })
          .then(response => {
            this.setUser(response.data.user)
            this.token = "changeMe" // TODO change this to the cookie send by the register response
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    login(credentials: LoginInput): Promise<unknown> {
      return new Promise((resolve, reject) => {
        backend.client
          .post("/api/users/login", { user: credentials })
          .then(response => {
            this.setUser(response.data.user)
            this.token = "changeME" // TODO: see register()
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    logout(): Promise<unknown> {
      return new Promise((resolve, reject) => {
        backend.client
          .delete("/api/users/logout")
          .then(response => {
            this.user = null
            this.token = "" // TODO remove auth cookie here!!!
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  },
})
