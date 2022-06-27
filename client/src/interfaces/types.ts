export enum KingdomType {
  PLANTAE = 'plantae',
  FUNGI = 'fungi',
  ANIMALIA = 'animalia',
}

export interface Post {
  _id: string
  author: Author
  createdAt: string
  likes: string[]
  sightings: Sighting[]
  text: string
  location: LocationInfo
  updatedAt: string
}

export interface Sighting {
  _id: string
  imageUrl: string
  alt: string
  lat?: number
  lng?: number
  createdAt: string
  updatedAt: string
}

export interface Author {
  _id: string
  username: string
  avatarUrl: string
}

export interface LocationInfo {
  osmId?: string
  name: string
  subname: string
  lat: number
  lng: number
}

export interface OsmSearchResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: string[]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  address: { [key: string]: string }
}
