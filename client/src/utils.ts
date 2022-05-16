import { customAlphabet } from 'nanoid/non-secure'
import _axios from 'axios'
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 5)

export function getRandomId() {
  return nanoid()
}

/**
 * backend data
 */
const BACKEND_URL = "http://localhost:3000/"

export const backend = {
  baseURL: BACKEND_URL,
  client: _axios.create({
    baseURL: BACKEND_URL,
    timeout: 2000,
    withCredentials: true
  })
}

