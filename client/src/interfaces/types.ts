export enum KingdomType {
  BIRD = 'bird',
  FUNGI = 'fungi',
  INSECT = 'insect',
  MAMMAL = 'mammal',
  MOLLUSCA = 'mollusca',
  OTHER = 'other',
  PLANTAE = 'plantae',
  REPTILE = 'reptile',
}

export interface Post {
  _id: string
  author: Author
  createdAt: string
  likes: string[]
  liked: boolean
  sightings: Sighting[]
  text: string
  location: LocationInfo
  updatedAt: string
  commentsCount: number
}

export interface Sighting {
  _id: string
  imageUrl: string
  alt: string
  lat?: number
  lng?: number
  location?: string
  species?: Species
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

export interface PredictionResult {
  id: number
  score: number
  species: Species
}

export interface Species {
  _id: string
  key: number
  vernacularName?: string
  imageUrl?: string
  nubKey: number
  nameKey: number
  taxonID: string
  sourceTaxonKey: number
  kingdom: string
  kingdomKey: number
  phylumKey: number
  datasetKey: string
  constituentKey: string
  parentKey: number
  scientificName: string
  canonicalName: string
  nameType: string
  rank: string
  origin: string
  taxonomicStatus: string
  numDescendants: number
  lastCrawled: Date
  lastInterpreted: Date
}

export interface User {
  _id: string
  following: unknown[]
  followers: unknown[]
  avatarUrl: string
  username: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id: string
  body: string
  post: Post
  author: User
  createdAt: Date
  updatedAt: Date
}

export interface SpeciesSearchResult {
  _id: string
  nomenclaturalStatus: string[]
  key: number
  vernacularName: string
  nubKey?: number
  nameKey: number
  taxonID: string
  sourceTaxonKey?: number
  phylumKey?: number
  datasetKey: string
  constituentKey?: string
  parentKey: number
  scientificName: string
  canonicalName: string
  numDescendants?: number
  lastCrawled: Date
  lastInterpreted: Date
  createdAt: Date
  updatedAt: Date
  imageUrl?: string
  remarks?: string
  synonym?: boolean
  name: string
  binomial: string
}
