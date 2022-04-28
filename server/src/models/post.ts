import { Schema, ObjectId, model } from 'mongoose';

export interface IPost {
    text: string;
    sightings: ObjectId[];
    author: ObjectId;
    likes: ObjectId[];
    tags?: string[];
}

export const postSchema = new Schema<IPost>({
    text: { type: Schema.Types.String },
    sightings: { type: Schema.Types.ObjectId },
    author: { type: Schema.Types.ObjectId, required: true },
    likes: [{ type: Schema.Types.ObjectId }],
    tags: [{ type: Schema.Types.String }]
}, {
    validateBeforeSave: true,
    timestamps: true
});

export const Post = model("Post", postSchema);