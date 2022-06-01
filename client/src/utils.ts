import { customAlphabet } from 'nanoid/non-secure'
import _axios, { AxiosError } from 'axios'
import router from './router'

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 5)

export function getRandomId() {
  return nanoid()
}

/**
 * backend data
 */
const BACKEND_URL = 'http://localhost:3000/'

const backend = {
  baseURL: BACKEND_URL,
  client: _axios.create({
    baseURL: BACKEND_URL,
    timeout: 2000,
    withCredentials: true,
  }),
}

/**
 * catches the 401 unauthorized error and redirects to the login page
 * @param error
 * @returns
 */
function errorResponseHandler(error: AxiosError) {
  if (error.response?.status == 401) {
    // router.push("/auth/login") // TODO comment this in when autentication is working properly again!
  }
  return error
}

backend.client.interceptors.response.use(
  (response) => response,
  errorResponseHandler,
)

export { backend }
