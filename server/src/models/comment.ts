import { Schema, ObjectId, model } from 'mongoose';

export interface IComment {
    body: string;
    post: ObjectId
    author: ObjectId
}

export const commentSchema = new Schema<IComment>({
    body: { type: Schema.Types.String, min: 10, required: true },
    post: { type: Schema.Types.ObjectId, required: true },
    author: { type: Schema.Types.ObjectId, required: true }
}, {
    validateBeforeSave: true,
    timestamps: true
});

export const Comment = model("Comment", commentSchema);