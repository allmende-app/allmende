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
  updatedAt: string
}

export interface Sighting {
  _id: string
  imageUrl: string
  alt: string
  createdAt: string
  updatedAt: string
}

export interface Author {
  _id: string
  username: string
  avatarUrl: string
}
