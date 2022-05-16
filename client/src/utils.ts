import { customAlphabet } from 'nanoid/non-secure'
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 5)

export function getRandomId() {
  return nanoid()
}
