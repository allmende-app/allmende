import { Schema, ObjectId, model, Model, Document } from 'mongoose';
import bcrypt from "bcrypt";

export interface IUser {
    username?: string;
    email?: string;
    password?: string;
    avatarUrl?: string;
    following?: ObjectId[];
    followers?: ObjectId[];
    confirmed?: boolean;
}

export interface IUserDocument extends IUser, Document {
    setPassword: (password: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;

    addUserToFollowing: (user: ObjectId) => Promise<ObjectId[]>;
    removeUserFromFollowing: (user: ObjectId) => Promise<ObjectId[]>;

    removeUserFromFollowers: (user: ObjectId) => Promise<ObjectId[]>;
}

export interface IUserModel extends Model<IUserDocument>{
    findByUsername: (username: string) => Promise<IUserDocument>;
    findByEmail: (email: string) => Promise<IUserDocument>;
}

export const userSchema = new Schema<IUserDocument>({
    email: { type: Schema.Types.String, required: true},
    username: { type: Schema.Types.String, required: true},
    password: { type: Schema.Types.String, required: true},
    avatarUrl: { type: Schema.Types.String },
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    confirmed: { type: Boolean },
}, {
    timestamps: true,
    validateBeforeSave: true
});

userSchema.methods.setPassword = async function(password: string) {
    const hash = await bcrypt.hash(password, 10);
    this.password = hash;
}

userSchema.methods.checkPassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.addUserToFollowing = async function(user: ObjectId) {
    if (this._id === user) return this.following;
    if (!this.following.includes(user)) {
        this.following.push(user);
    }
    return this.following;
}

userSchema.methods.removeUserFromFollowing = async function(user: ObjectId) {
    if (this._id === user) return this.following;
    if (this.following.includes(user)) {
        const i = this.following.indexOf(user);
        if (i > -1) {
            this.following.splice(i, 1);
        }        
    }
    return this.following;
}

userSchema.methods.removeUserFromFollowers = async function(user: ObjectId) {
    if (this._id === user) return this.followers;
    if (this.followers.includes(user)) {
        const i = this.following.indexOf(user);
        if (i > -1) {
            this.following.splice(i, 1);
        }
    }
}

userSchema.statics.findByEmail = async function(email: string) {
    return this.findOne({ email });
}

userSchema.statics.findByUsername = async function(username: string) {
    return await this.findOne({ username });
}

export const User = model<IUserDocument, IUserModel>("User", userSchema);   