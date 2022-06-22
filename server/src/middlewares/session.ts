import session from "express-session";
import connectRedisStore from "connect-redis";
import { connectRedis } from "../config";
import { CONFIG } from "../config";

export const RedisStore = connectRedisStore(session);

export const store = new RedisStore({
    port: 6379,
    host: process.env.REDIS_HOST || "localhost",
    client: connectRedis() as any,
});

export const sessionMiddleWare = session({
    store: store,
    secret: CONFIG.secret as string,
    cookie: {
        secure: process.env.NODE_ENV !== "production" ? false : false,
        maxAge: 1000 * 60 * 60 * 24 * 31,
    },
    saveUninitialized: true,
    resave: true,
});
