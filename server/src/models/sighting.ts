import { Schema, model, Model, Document, ObjectId } from "mongoose";
import { KingdomType } from "../interfaces";

export interface ISighting {
    imageUrl?: string;
    originalName?: string;
    lat?: number;
    lng?: number;
    location?: string;
    subname?: string;
    osmId?: string;
    species?: ObjectId;
    kingdom?: KingdomType;
    alt?: string;
}
export interface ISightingDocument extends ISighting, Document {
    // some methods
}

export interface ISightingModel extends Model<ISightingDocument> {
    findByURL: (url: string) => Promise<ISightingDocument>;
    findBySpecies: (
        species: string,
        limit?: number,
        page?: number,
    ) => Promise<ISightingDocument[]>;
}

export const sightingSchema = new Schema<ISightingDocument>(
    {
        imageUrl: { type: Schema.Types.String, required: true },
        lat: { type: Schema.Types.Number },
        lng: { type: Schema.Types.Number },
        location: { type: Schema.Types.String },
        subname: { type: Schema.Types.String },
        osmId: { type: Schema.Types.String },
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
