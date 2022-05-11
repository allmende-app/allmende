import { Schema, ObjectId, model, Document, Model } from 'mongoose';

export interface IComment {
    body?: string;
    post?: ObjectId
    author?: ObjectId
}

export interface ICommentDocument extends IComment, Document {
    // some instance methods
    construct: (body: string, post: ObjectId, author: ObjectId) => Promise<void>;
}

export interface ICommentModel extends Model<ICommentDocument> {
    findCommentsByPostID: (post: string) => Promise<ICommentDocument[]>;
    findCommentsByUserID: (post: string) => Promise<ICommentDocument[]>;
}

export const commentSchema = new Schema<ICommentDocument>({
    body: { type: Schema.Types.String, min: 10, required: true },
    post: { type: Schema.Types.ObjectId, required: true },
    author: { type: Schema.Types.ObjectId, required: true }
}, {
    validateBeforeSave: true,
    timestamps: true
});

commentSchema.methods.construct = async function(body: string, post: ObjectId, author: ObjectId) {
    this.body = body;
    this.post = post;
    this.author = author;
}

commentSchema.statics.findCommentsByPostID = async function(post: string) {
    return this.find({post: post});
}

export const Comment = model<ICommentDocument, ICommentModel>("Comment", commentSchema);