import mongoose, { Schema, ObjectId, model, Model, Document } from "mongoose";
import { LocationInfo, PostInput } from "../interfaces";
import { ISighting, ISightingDocument } from "./sighting";
import { IUser, IUserDocument, User } from "./user";

export interface IPostObject {
    _id: string;
    text?: string;
    sightings?: ISightingDocument[] | ObjectId[];
    likes?: IUserDocument[] | ObjectId[];
    author: unknown;
    commentsCount?: number;
    createdAt: string;
    updatedAt: string;
}

export const replicateIPost = async (post: IPostDocument, me: ObjectId) => {
    let like = false;
    let location: LocationInfo | null = null;
    if (post.likes) {
        for (let i = 0; i < post.likes.length; i++) {
            const user = post.likes[i] as IUserDocument;
            if (user._id == me) {
                like = true;
                break;
            }
        }
    }
    if (post.sightings) {
        for (let i = 0; i < post.sightings.length; i++) {
            const sighting = post.sightings[i] as ISighting;
            if (sighting.lat && sighting.lng) {
                const { location: l, osmId, subname } = sighting;

                if (l) {
                    location = {
                        name: l,
                        subname: subname || "",
                        osmId: osmId || "",
                        lat: sighting.lat,
                        lng: sighting.lng,
                    };
                }
                break;
            }
        }
    }

    const doc: IPostObject & {
        liked: boolean;
        location: LocationInfo | null;
    } = {
        _id: post._id,
        text: post.text,
        sightings: post.sightings,
        likes: post.likes,
        author: post.author,
        commentsCount: post.commentsCount,
        createdAt: post.get("createdAt"),
        updatedAt: post.get("updatedAt"),
        liked: like,
        location: location,
    };
    return doc;
};

export interface IPost {
    text?: string;
    sightings?: ObjectId[] | ISightingDocument[];
    author?: ObjectId | IUserDocument;
    likes?: ObjectId[] | IUserDocument[];
    commentsCount?: number;
    tags?: string[];
}

export interface IPostDocument extends IPost, Document {
    addLike: (user: IUserDocument) => Promise<void>;
    removeLike: (user: IUserDocument) => Promise<void>;
    incrementCommentsCount: () => Promise<number>;
    decrementCommentsCount: () => Promise<number>;
    construct: (post: PostInput, user: ObjectId) => Promise<IPostDocument>;
    changeProperties: (post: PostInput) => Promise<void>;
}

export interface IPostModel extends Model<IPostDocument> {
    findByTag: (tag: string, page: number) => Promise<IPostDocument[]>;
    findPosts: (limit: number, page: number) => Promise<IPostDocument[]>;
    findPostsOfUser: (
        user: string,
        page: number,
        limit: number,
    ) => Promise<IPostDocument[]>;

    countPostsOfUser: (user: string) => Promise<number>;
}

export const postSchema = new Schema<IPostDocument>(
    {
        text: { type: Schema.Types.String },
        sightings: [{ type: Schema.Types.ObjectId, ref: "Sighting" }],
        author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        commentsCount: { type: Schema.Types.Number },
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

postSchema.methods.incrementCommentsCount = async function () {
    let commentsCount = this.commentsCount;
    if (!commentsCount) commentsCount = 1;
    else commentsCount++;
    this.commentsCount = commentsCount;
    await this.save();
    return this.commentsCount;
};

postSchema.methods.decrementCommentsCount = async function () {
    let commentsCount = this.commentsCount;
    if (!commentsCount) commentsCount = 0;
    else commentsCount--;
    this.commentsCount = commentsCount;
    await this.save();
    return this.commentsCount;
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

postSchema.statics.findPostsOfUser = async function (
    user: string,
    page = 1,
    limit = 20,
) {
    const profile = await User.findByUsername(user);
    const id = profile._id;
    const posts = await this.find({ author: id })
        .limit(limit)
        .skip(page > 0 ? (page - 1) * limit : 0)
        .sort({
            createdAt: "descending",
        });
    return posts;
};

postSchema.statics.countPostsOfUser = async function (user: string) {
    const profile = await User.findByUsername(user);
    const id = profile._id;
    const number = await this.countDocuments({ author: id });
    return number;
};

export const Post = model<IPostDocument, IPostModel>("Post", postSchema);
