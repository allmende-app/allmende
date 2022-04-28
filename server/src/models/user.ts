import { Schema, ObjectId, model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password: string;
    avatarUrl?: string;
    following: ObjectId[];
    followee: ObjectId[];
}

export const userSchema = new Schema<IUser>({
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

export const User = model<IUser>("User", userSchema);