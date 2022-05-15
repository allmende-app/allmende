import { customAlphabet } from 'nanoid/non-secure'
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 5)

export function getRandomId() {
  return nanoid()
}

/**
 * backend data
 */
const backend = {
  baseURL: "http://localhost:3000/",
}
