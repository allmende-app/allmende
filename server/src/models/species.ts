import mongoose, { Document, model, Model, Schema } from "mongoose";
import { GBIFInfo } from "../interfaces";

export interface ISpecies {
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
    imageUrl?: string;
}

export interface ISpeciesDocument extends ISpecies, Document {
    construct: (data: ISpecies) => Promise<ISpeciesDocument>;
}

export interface ISpeciesModel extends Model<ISpeciesDocument> {
    findBySpeciesID: (id: string) => Promise<ISpeciesDocument>;
    speciesExist: (id: string) => Promise<boolean>;
}

export const speciesSchema = new Schema<ISpeciesDocument>({
    key: {
        type: Schema.Types.Number, required: true,
    },
    nubKey: {
        type: Schema.Types.Number,
    },
    nameKey: {
        type: Schema.Types.Number,
    },
    taxonID: {
        type: Schema.Types.String,
    },
    sourceTaxonKey: {
        type: Schema.Types.Number,
    },
    kingdom: {
        type: Schema.Types.String,
    },
    kingdomKey: {
        type: Schema.Types.Number,
    },
    phylumKey: {
        type: Schema.Types.Number,
    },
    datasetKey: {
        type: Schema.Types.Number,
    },
    constituentKey: {
        type: Schema.Types.String,
    },
    parentKey: {
        type: Schema.Types.Number,
    },
    scientificName: {
        type: Schema.Types.String,
    },
    canonicalName: {
        type: Schema.Types.String,
    },
    vernacularName: {
        type: Schema.Types.String,
    },
    authorShip: {
        type: Schema.Types.String,
    },
    nameType: {
        type: Schema.Types.String,
    },
    rank: {
        type: Schema.Types.String,
    },
    origin: {
        type: Schema.Types.String,
    },
    taxonomicStatus: {
        type: Schema.Types.String,
    },
    nomenclaturalStatus: {
        type: Schema.Types.DocumentArray,
    },
    remarks: {
        type: Schema.Types.String,
    },
    numDescendants: {
        type: Schema.Types.Number,
    },
    lastCrawled: {
        type: Schema.Types.String,
    },
    lastInterpreted: {
        type: Schema.Types.String,
    },
    issues: {
        type: Schema.Types.Array,
    },
    synonym: {
        type: Schema.Types.Boolean,
    },
    imageUrl: {
        type: Schema.Types.String,
    },
}, {
    timestamps: true,
    validateBeforeSave: true
});

speciesSchema.methods.construct = async function (data: ISpecies) {
    this.vernacularName = data.vernacularName;
    this.key = data.key;
    this.imageUrl = data.imageUrl;
    this.kingdom = data.kingdom;

    return this;
}

speciesSchema.statics.findBySpeciesID = async function (id: string) {
    const doc = await this.findOne({ key: id });
    if (doc) return doc;
}

speciesSchema.statics.speciesExist = async function (id: string) {
    const doc = await this.findOne({ key: id });
    if (doc) return true;
    else return false;
}

export const Species = model<ISpeciesDocument, ISpeciesModel>("species", speciesSchema);