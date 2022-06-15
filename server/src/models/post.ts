import mongoose, { Schema, ObjectId, model, Model, Document } from "mongoose";
import { PostInput } from "../interfaces";
import { IUserDocument } from "./user";

export interface IPost {
    text?: string;
    sightings?: ObjectId[];
    author?: ObjectId;
    likes?: ObjectId[];
    // comments?: ObjectId[];
    tags?: string[];
}

export interface IPostDocument extends IPost, Document {
    addLike: (user: IUserDocument) => Promise<void>;
    removeLike: (user: IUserDocument) => Promise<void>;

    // addComment: (comment: ObjectId) => Promise<void>;
    // removeComment: (comment: ObjectId) => Promise<void>;

    construct: (post: PostInput, user: ObjectId) => Promise<IPostDocument>;
    changeProperties: (post: PostInput) => Promise<void>;
}

export interface IPostModel extends Model<IPostDocument> {
    findByTag: (tag: string, page: number) => Promise<IPostDocument[]>;
    findPosts: (
        limit: number,
        page: number,
        tag?: string | undefined,
    ) => Promise<IPostDocument[]>;
}

export const postSchema = new Schema<IPostDocument>(
    {
        text: { type: Schema.Types.String },
        sightings: [{ type: Schema.Types.ObjectId, ref: "Sighting" }],
        author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        // comments: [{type: Schema.Types.ObjectId}],
        tags: [{ type: Schema.Types.String }],
    },
    {
        validateBeforeSave: true,
        timestamps: true,
    },
);

postSchema.methods.addLike = async function (user: IUserDocument) {
    const id = new mongoose.Types.ObjectId(user._id);
    const likes = this.likes;
    if (!likes.includes(id)) {
        likes.push(id);
        this.likes = likes;
    }
    await this.save();
};

postSchema.methods.removeLike = async function (user: IUserDocument) {
    const id = new mongoose.Types.ObjectId(user._id);
    const likes = this.likes;
    if (likes.includes(id)) {
        const index = likes.indexOf(id);
        likes.splice(index, 1);
        this.likes = likes;
    }
    await this.save();
};

postSchema.methods.addComment = async function (comment: ObjectId) {
    const comments: ObjectId[] = this.comments;
    if (!comments.includes(comment)) {
        comments.push(comment);
        this.comments = comments;
    }
};

postSchema.methods.removeComment = async function (comment: ObjectId) {
    const comments: ObjectId[] = this.comments;
    if (comments.includes(comment)) {
        const index = comments.indexOf(comment);
        comments.splice(index, 1);
        this.comments = comments;
    }
};

postSchema.methods.construct = async function (
    post: PostInput,
    user: ObjectId,
) {
    const { text } = post;
    this.text = text;
    this.author = user;
};

postSchema.methods.changeProperties = async function (post: PostInput) {
    const { text } = post;
    this.text = text;
};

/**
 * @deprecated
 * @param tag
 * @param page
 * @returns
 */
postSchema.statics.findByTag = async function (tag: string, page: number) {
    return this.find({ tags: { $regex: tag, $options: "i" } })
        .limit(20)
        .skip(page > 0 ? (page - 1) * 20 : 0);
};

postSchema.statics.findPosts = async function (limit = 20, page = 0) {
    return this.find({})
        .limit(limit)
        .skip(page > 0 ? (page - 1) * limit : 0)
        .sort({ createdAt: "descending" });
};

export const Post = model<IPostDocument, IPostModel>("Post", postSchema);
