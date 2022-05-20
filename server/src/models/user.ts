import mongoose, { Schema, ObjectId, model, Model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { RegisterInput } from "../interfaces";
import { randomAvatarURL } from "../utils";

export interface IUser {
    username?: string;
    email?: string;
    password?: string;
    avatarUrl?: string;
    following?: ObjectId[];
    followers?: ObjectId[];
    confirmed?: boolean;
    bio?: string;
}

export interface IUserDocument extends IUser, Document {
    construct: (input: RegisterInput) => Promise<void>;
    setPassword: (password: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
    hideSensibleData: () => Promise<void>;

    addUserToFollowing: (user: IUserDocument) => Promise<ObjectId[]>;
    removeUserFromFollowing: (user: IUserDocument) => Promise<ObjectId[]>;

    addUserToFollowers: (user: IUserDocument) => Promise<ObjectId[]>;
    removeUserFromFollowers: (user: IUserDocument) => Promise<ObjectId[]>;
}

export interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>;
    findByEmail: (email: string) => Promise<IUserDocument>;
}

export const userSchema = new Schema<IUserDocument>(
    {
        email: { type: Schema.Types.String, required: true },
        username: { type: Schema.Types.String, required: true },
        password: { type: Schema.Types.String, required: true },
        avatarUrl: { type: Schema.Types.String },
        following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        confirmed: { type: Boolean },
        bio: { type: String },
    },
    {
        timestamps: true,
        validateBeforeSave: true,
    },
);

userSchema.methods.construct = async function (input: RegisterInput) {
    this.email = input.email;
    await this.setPassword(input.password);
    this.avatarUrl = randomAvatarURL();
    this.username = input.username;
    this.confirmed = false;
};

userSchema.methods.hideSensibleData = async function () {
    this.password = undefined;
    this.followers = undefined;
    this.following = undefined;
    this.confirmed = undefined;
};

userSchema.methods.setPassword = async function (password: string) {
    const hash = await bcrypt.hash(password, 10);
    this.password = hash;
};

userSchema.methods.checkPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.addUserToFollowing = async function (user: IUserDocument) {
    const id = this._id.toString();
    const userId = user._id.toString();
    if (id === userId) return this.following;
    const _id = new mongoose.Types.ObjectId(userId);
    if (!this.following.includes(_id)) {
        this.following.push(_id);
    }
    return this.following;
};

userSchema.methods.removeUserFromFollowing = async function (
    user: IUserDocument,
) {
    const id = this._id;
    const userId = user._id.toString();
    if (id === userId) return this.followers;
    const _id = new mongoose.Types.ObjectId(userId);
    if (this.following.includes(_id)) {
        const i = this.following.indexOf(_id);
        this.following.splice(i, 1);
    }
    return this.following;
};

userSchema.methods.addUserToFollowers = async function (user: IUserDocument) {
    const id = this._id.toString();
    const userId = user._id.toString();
    if (id === userId) return this.followers;
    const _id = new mongoose.Types.ObjectId(userId);
    if (!this.followers.includes(_id)) {
        this.followers.push(_id);
    }
    return this.followers;
};

userSchema.methods.removeUserFromFollowers = async function (
    user: IUserDocument,
) {
    const id = this._id.toString();
    const userId = user._id.toString();
    if (id === userId) return this.followers;
    const _id = new mongoose.Types.ObjectId(userId);
    if (this.followers.includes(_id)) {
        const i = this.followers.indexOf(_id);
        this.followers.splice(i, 1);
    }
    return this.followers;
};

userSchema.statics.findByEmail = async function (email: string) {
    return this.findOne({ email });
};

userSchema.statics.findByUsername = async function (username: string) {
    return await this.findOne({ username });
};

export const User = model<IUserDocument, IUserModel>("User", userSchema);
