import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: axios
  }
}

export {}
