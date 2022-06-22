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
        type: Schema.Types.String,
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
        type: Schema.Types.Array,
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
    this.key = data.key || undefined;
    this.nubKey = data.nubKey || undefined;
    this.nameKey = data.nameKey || undefined;
    this.taxonID = data.taxonID || undefined;
    this.sourceTaxonKey = data.sourceTaxonKey || undefined;
    this.kingdom = data.kingdom || undefined;
    this.kingdomKey = data.kingdomKey || undefined;
    this.phylumKey = data.phylumKey || undefined;
    this.datasetKey = data.datasetKey || undefined;
    this.constituentKey = data.constituentKey || undefined;
    this.parentKey = data.parentKey || undefined;
    this.scientificName = data.scientificName || undefined;
    this.canonicalName = data.canonicalName || undefined;
    this.vernacularName = data.vernacularName || undefined;
    this.authorShip = data.authorShip || undefined;
    this.nameType = data.nameType || undefined;
    this.rank = data.rank || undefined;
    this.origin = data.origin || undefined;
    this.taxonomicStatus = data.taxonomicStatus || undefined;
    this.nomenclaturalStatus = data.nomenclaturalStatus || undefined;
    this.remarks = data.remarks || undefined;
    this.numDescendants = data.numDescendants || undefined;
    this.lastCrawled = data.lastCrawled || undefined;
    this.lastInterpreted = data.lastInterpreted || undefined;
    this.issues = data.issues || undefined;
    this.synonym = data.synonym || undefined;
    this.imageUrl = data.imageUrl || undefined;

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