import { Schema, ObjectId, model, Model, Document } from 'mongoose';

export interface ISighting {
    imageUrl?: string;
    originalName?: string;
    lat?: number;
    lng?: number;
    location?: string;
    specie?: string;
}

export interface GeoBounds {
    lat: {
        minLat: number;
        maxLat: number;
    }
    lng: {
        minLng: number;
        maxLng: number;
    }
}

export interface ISightingDocument extends ISighting, Document {
    setBounds: (bounds: GeoBounds) => Promise<void>;
}

export interface ISightingModel extends Model<ISightingDocument> {
    findByURL: (url: string) => Promise<ISightingDocument>;
    findBySpecie: (specie: string, limit?: number, page?: number) => Promise<ISightingDocument[]>;
    findByBounds: (bounds: GeoBounds) => Promise<ISightingDocument[]>;
}

export const sightningSchema = new Schema<ISightingDocument>({
    imageUrl: { type: Schema.Types.String, required: true },
    lat: { type: Schema.Types.Number },
    lng: { type: Schema.Types.Number },
    location: { type: Schema.Types.String, required: true },
    specie: { type: Schema.Types.String, required: true }
}, {
    timestamps: true,
    validateBeforeSave: true
});

export const Sighting = model<ISightingDocument, ISightingModel>("Sighting", sightningSchema);