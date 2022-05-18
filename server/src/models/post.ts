import { Schema, ObjectId, model, Model, Document } from 'mongoose';
import { PostInput } from '../interfaces';

export interface IPost {
    text?: string;
    sightings?: ObjectId[];
    author?: ObjectId;
    likes?: ObjectId[];
    // comments?: ObjectId[];
    tags?: string[];
}

export interface IPostDocument extends IPost, Document {
    addLike: (user: ObjectId) => Promise<void>;
    removeLike: (user: ObjectId) => Promise<void>;

    // addComment: (comment: ObjectId) => Promise<void>;
    // removeComment: (comment: ObjectId) => Promise<void>;

    construct: (post: PostInput, user: ObjectId) => Promise<IPostDocument>;
    changeProperties: (post: PostInput) => Promise<void>;
}

export interface IPostModel extends Model<IPostDocument> {
    findByTag: (tag: string, page: number) => Promise<IPostDocument[]>;
    findPosts: (limit: number, page: number, tag?: string | undefined) => Promise<IPostDocument[]>;
}

export const postSchema = new Schema<IPostDocument>({
    text: { type: Schema.Types.String },
    sightings: [{type: Schema.Types.ObjectId}],
    author: { type: Schema.Types.ObjectId, required: true },
    likes: [{ type: Schema.Types.ObjectId }],
    // comments: [{type: Schema.Types.ObjectId}],
    tags: [{ type: Schema.Types.String }],
}, {
    validateBeforeSave: true,
    timestamps: true
});

postSchema.methods.addLike = async function(user: ObjectId) {
    const likes: ObjectId[] = this.likes;
    if (!likes.includes(user)) {
        likes.push(user);
        this.likes = likes;
    }
}

postSchema.methods.removeLike = async function(user: ObjectId) {
    const likes: ObjectId[] = this.likes;
    if (likes.includes(user)) {
        const index = likes.indexOf(user);
        likes.splice(index, 1);
        this.likes = likes;
    }
}

postSchema.methods.addComment = async function(comment: ObjectId) {
    const comments: ObjectId[] = this.comments;
    if (!comments.includes(comment)) {
        comments.push(comment);
        this.comments = comments;
    }
}

postSchema.methods.removeComment = async function(comment: ObjectId) {
    const comments: ObjectId[] = this.comments;
    if (comments.includes(comment)) {
        const index = comments.indexOf(comment);
        comments.splice(index, 1);
        this.comments = comments;
    }
}

postSchema.methods.construct = async function(post: PostInput, user: ObjectId) {
    const { text, tags } = post;
    this.text = text;
    this.tags = tags;
    this.author = user;
}

postSchema.methods.changeProperties = async function(post: PostInput) {
    const { text, tags } = post;
    this.text = text;
    this.tags = tags;
}

postSchema.statics.findByTag = async function(tag: string, page: number) {
    return this.find({tags: {"$regex": tag, "$options": "i"}}).limit(20).skip(page > 0 ? (page - 1) * 20 : 0);
}

postSchema.statics.findPosts = async function(limit = 20, page = 0, tag?: string) {
    if (!tag) return this.find({}).limit(limit).skip(page > 0 ? (page - 1) * limit : 0);
    else return this.find({"tags": {"$regex": tag, "$options": "i"}}).limit(20).skip(page > 0 ? (page - 1) * limit : 0);
}

export const Post = model<IPostDocument, IPostModel>("Post", postSchema);