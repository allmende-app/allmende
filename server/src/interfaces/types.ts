import { BooleanSchemaDefinition, ObjectId } from "mongoose";

export enum KingdomType {
    BIRD = "bird",
    FUNGI = "fungi",
    INSECT = "insect",
    MAMMAL = "mammal",
    MOLLUSCA = "mollusca",
    OTHER = "other",
    PLANTAE = "plantae",
    REPTILE = "reptile",
}

export interface SightingInfo {
    species: ObjectId;
    description: string;
    lat: number;
    lng: number;
    osmId: string;
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

export enum OsmType {
    W = "W",
    R = "R",
    N = "N",
}

export enum MapType {
    PLATFORM = "platform",
    POINT = "point",
    COUNTRY_CODE = "country_code",
    COUNTRY = "country",
    CITY = "city",
    ADMINISTRATIVE = "administrative",
    BOROUGH = "borough",
    SUBURB = "suburb",
    SERVICE = "service",
    POSTAL_CODE = "postal_code",
}

export enum MapClass {
    HIGHWAY = "highway",
    PLACE = "place",
    BOUNDARY = "boundary",
    RAILWAY = "railway",
}

export interface OsmAddress {
    localname: string;
    place_id: number;
    osm_id: number;
    osm_type: OsmType;
    place_type: MapType;
    class: MapClass;
    type: MapType;
    admin_level: number;
    rank_address: number;
    distance: number;
    isaddress: boolean;
}

export interface Geometry {
    type: MapType;
    coordinates: number[];
}

export interface OsmIdResponse {
    place_id: number | string;
    parent_place_id: number | string;
    osm_type: OsmType;
    osm_id: number | string;
    type: MapType;
    admin_level: number;
    localname: string;
    names: Map<string, any>;
    addresstags: string[];
    houseNumber: string;
    calculated_postcode: string;
    country_code: string;
    indexed_date: string;
    importance: number;
    calculated_importance: number;
    extratags: Map<string, any>;
    rank_address: number;
    rank_search: number;
    isarea: boolean;
    centroid: Geometry;
    geometry: Geometry;
    address: OsmAddress[];
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
