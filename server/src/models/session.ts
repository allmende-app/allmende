import { Schema, ObjectId, model } from "mongoose";

export interface ISession {
    user: ObjectId;
    token: string;
}

export const sessionSchema = new Schema<ISession>(
    {
        user: { type: Schema.Types.ObjectId, required: true },
        token: { type: Schema.Types.String, required: true },
    },
    {
        timestamps: true,
        validateBeforeSave: true,
    },
);

export const SessionToken = model("Session", sessionSchema);
