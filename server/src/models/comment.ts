import mongoose, { Schema, ObjectId, model, Document, Model } from "mongoose";
import { CommentInput } from "../interfaces";

export interface IComment {
    body?: string;
    post?: ObjectId;
    author: ObjectId;
}

export interface ICommentDocument extends IComment, Document {
    // some instance methods
    construct: (
        body: string,
        post: ObjectId,
        author: ObjectId,
    ) => Promise<void>;
}

export interface ICommentModel extends Model<ICommentDocument> {
    findCommentsByPostID: (post: string, page?: number, limit?: number) => Promise<ICommentDocument[]>;
    findCommentsByUserID: (post: string) => Promise<ICommentDocument[]>;

    findCommentByIDAndDelete: (
        id: string,
        user: ObjectId | string,
    ) => Promise<ICommentDocument>;
    findCommentByIDAndEdit: (
        id: string,
        user: ObjectId | string,
        comment: CommentInput,
    ) => Promise<ICommentDocument>;
}

export const commentSchema = new Schema<ICommentDocument>(
    {
        body: { type: mongoose.Schema.Types.String, min: 10, required: true },
        post: { type: mongoose.Types.ObjectId, required: true, ref: "Post", },
        author: { type: mongoose.Types.ObjectId, required: true, ref: "User", },
    },
    {
        validateBeforeSave: true,
        timestamps: true,
    },
);

commentSchema.methods.construct = async function (
    body: string,
    post: ObjectId,
    author: ObjectId,
) {
    this.body = body;
    this.post = post;
    this.author = author;
};

commentSchema.statics.findCommentsByPostID = async function (post: string, page = 1, limit = 20) {
    return this.find({ post: post }).limit(limit).skip(page > 0 ? (page - 1) * 20 : 0);
};

commentSchema.statics.findCommentByIDAndEdit = async function (
    id: string,
    user: ObjectId | string,
    comment: CommentInput,
) {
    const doc = await this.findById(id);
    if (doc.author == user) {
        const { body } = comment;
        doc.body = body;
        const _doc = await doc.save();
        return _doc;
    } else {
        throw new Error("Unauthorized user");
    }
};

commentSchema.statics.findCommentByIDAndDelete = async function (
    id: string,
    user: ObjectId | string,
) {
    const doc = await this.findById(id);
    if (doc.author == user) {
        await doc.delete();
        return doc;
    } else {
        throw new Error("Unauthorized user");
    }
};

export const Comment = model<ICommentDocument, ICommentModel>(
    "Comment",
    commentSchema,
);
