import { Schema, model } from 'mongoose';

export interface ISighting {
    imageUrl: string;
    lat?: number;
    lng?: number;
    location: string;
    specie: string;
}

export const sightningSchema = new Schema<ISighting>({
    imageUrl: { type: Schema.Types.String, required: true },
    lat: { type: Schema.Types.Number },
    lng: { type: Schema.Types.Number },
    location: { type: Schema.Types.String, required: true },
    specie: { type: Schema.Types.String, required: true }
}, {
    timestamps: true,
    validateBeforeSave: true
});

export const Sighting = model("Sighting", sightningSchema);