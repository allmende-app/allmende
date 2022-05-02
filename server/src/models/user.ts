import { Schema, ObjectId, model, Model, Document } from 'mongoose';
import bcrypt from "bcrypt";

export interface IUser {
    name: string;
    email: string;
    password: string;
    avatarUrl?: string;
    following: ObjectId[];
    followee: ObjectId[];
}

export interface IUserDocument extends IUser, Document {
    setPassword: (password: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument>{
    findByUsername: (username: string) => Promise<IUserDocument>;
}

export const userSchema = new Schema<IUserDocument>({
    email: { type: Schema.Types.String, required: true},
    name: { type: Schema.Types.String, required: true},
    password: { type: Schema.Types.String, required: true},
    avatarUrl: String,
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    followee: [{type: Schema.Types.ObjectId, ref: 'User'}]
}, {
    timestamps: true,
    validateBeforeSave: true
});

userSchema.methods.setPassword = async function(password: string) {
    const hash = bcrypt.hash(password, 10);
    this.password = hash;
}

userSchema.methods.checkPassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
}

export const User = model<IUserDocument, IUserModel>("User", userSchema);