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
