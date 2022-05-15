import { defineStore } from 'pinia'
import type { User, Credentials } from '../interfaces/auth'
import type { RegisterInput, LoginInput } from '../../../server/src/interfaces/inputs'
import axios from 'axios'

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
        axios
          .post("http://127.0.0.1:3000/api/users/register", { user: registerData }, {withCredentials: true})
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
      // TODO: send axios request to server here ... receive token and set token ...
      this.status = 'LOADING'

      return new Promise((resolve, reject) => {
        // TODO do axios request here instead of promise!!!
        axios.post("http://127.0.0.1:3000/api/users/login", { user: credentials }, {withCredentials: true})
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
        axios.delete("http://127.0.0.1:3000/api/users/logout", {withCredentials: true})
          .then(response => {
            this.user = null
            this.token = "" // TODO remove auth cookie here!!!// TODO das funktioniert noch nicht :(
            // localStorage.removeItem('user-token')
            // TODO: use: delete axios.defaults.headers.common['Authorization']
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  },
})
