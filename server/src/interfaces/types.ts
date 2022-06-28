import { BooleanSchemaDefinition, ObjectId } from "mongoose";

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

export interface SightingInfo {
    species: ObjectId;
    description: string;
    lat: number;
    lng: number;
}

export interface GBIFMediaFormat {
    type: string;
    format: string;
    source: string;
    created: string;
    license: string;
    rightsHolder: string;
    taxonKey: number;
    sourceTaxonKey: number;
    identifier: string; // url image
}

export interface GBIFMedia {
    offset: number;
    limit: number;
    endOfRecords: boolean;
    results: GBIFMediaFormat[];
}

export interface GBIFInfo {
    key?: number;
    nubKey?: number;
    nameKey?: number;
    taxonID?: string;
    sourceTaxonKey?: number;
    kingdom?: string;
    kingdomKey?: number;
    phylumKey?: number;
    datasetKey?: string;
    constituentKey?: string;
    parentKey?: number;
    scientificName?: string;
    canonicalName?: string;
    vernacularName?: string;
    authorShip?: string;
    nameType?: string;
    rank?: string;
    origin?: string;
    taxonomicStatus?: string;
    nomenclaturalStatus?: any[];
    remarks?: string;
    numDescendants?: number;
    lastCrawled?: string;
    lastInterpreted?: string;
    issues?: any[];
    synonym?: boolean;
}

/**
 * @author @JulianWels
 */
export interface LocationInfo {
    osmId?: string;
    name: string;
    subname: string;
    lat: number;
    lng: number;
}

/**
 * @author @JulianWels
 */
export interface OsmSearchResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    address: { [key: string]: string };
}
