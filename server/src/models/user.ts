import { Schema, ObjectId, model, Model, Document } from 'mongoose';
import bcrypt from "bcrypt";

export interface IUser {
    username?: string;
    email?: string;
    password?: string;
    avatarUrl?: string;
    following?: ObjectId[];
    followers?: ObjectId[];
}

export interface IUserDocument extends IUser, Document {
    setPassword: (password: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument>{
    findByUsername: (username: string) => Promise<IUserDocument>;
    findByEmail: (email: string) => Promise<IUserDocument>;
}

export const userSchema = new Schema<IUserDocument>({
    email: { type: Schema.Types.String, required: true},
    username: { type: Schema.Types.String, required: true},
    password: { type: Schema.Types.String, required: true},
    avatarUrl: String,
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}]
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

userSchema.statics.findByEmail = async function(email: string) {
    return this.findOne({ email });
}

userSchema.statics.findByUsername = async function(username: string) {
    return await this.findOne({ username });
}

export const User = model<IUserDocument, IUserModel>("User", userSchema);   