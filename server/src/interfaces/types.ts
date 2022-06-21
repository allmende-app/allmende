import { ObjectId } from "mongoose";

export enum KingdomType {
    PLANTAE = "plantae",
    FUNGI = "fungi",
    ANIMALIA = "animalia",
}

export interface SightingInfo {
    species: ObjectId;
    description: string;
    lat: number;
    lng: number;
}

/**
 * @author @JulianWels
 */
export interface LocationInfo {
    osmId?: string
    name: string
    subname: string
    lat: number
    lng: number
}

/**
 * @author @JulianWels
 */
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
