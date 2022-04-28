import { connect, ConnectOptions } from "mongoose";

const MONGO_USER = process.env.NODE_ENV !== "production" ? "admin" : process.env.MONGO_USER;
const MONGO_PW = process.env.NODE_ENV !== "production" ? "password" : process.env.MONGO_PW;
const MONGO_HOST = process.env.NODE_ENV !== "production" ? "localhost" : process.env.MONGO_HOST;
const MONGO_PORT = 27017;

const connectString = `mongodb://${MONGO_USER}:${MONGO_PW}@${MONGO_HOST}:${MONGO_PORT}`;

export const connectDB = async() => {
    const options: ConnectOptions = {
        dbName: "allmende",
    }
    const res = await connect(connectString, options);
    return res;
}