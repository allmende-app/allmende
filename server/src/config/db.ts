import { connect, ConnectOptions } from "mongoose";
// import { ClientClosedError, createClient } from "redis";
import redis from "ioredis";
// import { Logger } from "../lib";

const MONGO_USER = process.env.MONGO_USER || "admin";
const MONGO_PW = process.env.MONGO_PW || "password";
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = 27017;

export const connectString = `mongodb://${MONGO_USER}:${MONGO_PW}@${MONGO_HOST}:${MONGO_PORT}`;

export const connectDB = async () => {
    const options: ConnectOptions = {
        dbName: "allmende",
    };
    const res = await connect(connectString, options);
    return res;
};

export const connectRedis = () => {
    const client = new redis({
        port: 6379,
        host: process.env.REDIS_HOST || "localhost",
    });
    client.on("error", console.error);
    return client;
};

export const fixImageUrlOfProfiles = async () => {
    const profiles = await User.find({
        avatarUrl: {
            $regex: "http",
            $options: "i",
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pendings = await Promise.all(
        profiles.map(
            (profile) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                new Promise<IUserDocument & { _id: any }>((resolve) => {
                    profile.avatarUrl = randomAvatarURL();
                    profile.save().then((d) => {
                        Logger.info(`Fix avatarUrl of: ${d._id}`);
                        resolve(d);
                    });
                }),
        ),
    );
};
