import { customAlphabet } from 'nanoid/non-secure'
import _axios, { AxiosError } from 'axios'
import router from './router'
import type { LocationInfo, OsmSearchResult } from './interfaces/types'

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 5)

export function getRandomId() {
  return nanoid()
}

/**
 * backend data
 */
export const BACKEND_URL =
  process.env.NODE_ENV != 'production'
    ? 'http://localhost:3000/'
    : '/'

export const backend = {
  baseURL: BACKEND_URL,
  client: _axios.create({
    baseURL: BACKEND_URL,
    timeout: 2000,
    withCredentials: true,
  }),
}

backend.client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push('/auth/login')
        }
      }
    }
    return Promise.reject(error)
  },
)

const osmToLocationInfo = (osm: OsmSearchResult): LocationInfo => {
  const nameItems = Object.entries(osm.address)
    .filter(
      ([key]) =>
        key !== 'country_code' &&
        key !== 'postcode' &&
        key !== 'ISO3166-2-lvl6' &&
        key !== 'ISO3166-2-lvl4' &&
        key !== 'ISO3166-2-lvl3',
    )
    .slice(0, 3)
    .map(([, value]) => value)

  const name = nameItems.join(', ')
  // reduce nameItems from display_name
  const subname = nameItems.reduce((acc, item) => {
    return acc.replace(`${item}, `, '').replace(item, '')
  }, osm.display_name)

  return {
    osmId: String(osm.osm_id),
    name,
    subname,
    lat: parseFloat(osm.lat),
    lng: parseFloat(osm.lon),
  }
}

export const locationSearch = async (
  search: string,
): Promise<LocationInfo[]> => {
  console.log('locationSearch', search)
  const options = {
    method: 'POST',
    url: 'https://nominatim.openstreetmap.org/search',
    params: {
      q: search,
      format: 'json',
      limit: '5',
      addressdetails: '1',
    },
  }
  const response = await _axios.request(options)

  return response.data.map(osmToLocationInfo)
}

export const reverseLocationSearch = async (
  longitude: number,
  latitude: number,
): Promise<LocationInfo> => {
  const options = {
    method: 'POST',
    url: 'https://nominatim.openstreetmap.org/reverse',
    params: {
      lat: latitude,
      lon: longitude,
      format: 'json',
      addressdetails: '1',
    },
  }

  const response = await _axios.request(options)
  return osmToLocationInfo(response.data)
}
