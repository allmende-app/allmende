import { Schema, model, Model, Document, ObjectId } from "mongoose";
import { KingdomType } from "../interfaces";

export interface ISighting {
    imageUrl?: string;
    originalName?: string;
    lat?: number;
    lng?: number;
    location?: string;
    species?: ObjectId;
    kingdom?: KingdomType;
    alt?: string;
}

export interface GeoBounds {
    lat: {
        minLat: number;
        maxLat: number;
    };
    lng: {
        minLng: number;
        maxLng: number;
    };
}

export interface ISightingDocument extends ISighting, Document {
    setBounds: (bounds: GeoBounds) => Promise<void>;
}

export interface ISightingModel extends Model<ISightingDocument> {
    findByURL: (url: string) => Promise<ISightingDocument>;
    findBySpecies: (
        species: string,
        limit?: number,
        page?: number,
    ) => Promise<ISightingDocument[]>;
    findByBounds: (bounds: GeoBounds) => Promise<ISightingDocument[]>;
}

export const sightingSchema = new Schema<ISightingDocument>(
    {
        imageUrl: { type: Schema.Types.String, required: true },
        lat: { type: Schema.Types.Number },
        lng: { type: Schema.Types.Number },
        location: { type: Schema.Types.String },
        species: { type: Schema.Types.ObjectId, ref: "Species" },
        alt: { type: Schema.Types.String },
    },
    {
        timestamps: true,
        validateBeforeSave: true,
    },
);

export const Sighting = model<ISightingDocument, ISightingModel>(
    "Sighting",
    sightingSchema,
);
