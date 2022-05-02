import session from "express-session";
import connectRedis from "connect-redis";
import { CONFIG } from "../config";

export const RedisStore = connectRedis(session);

export const store = new RedisStore({
    port: 6379,
    host: "127.0.0.1"
});

export const sessionMiddleWare = session({
    store: store,
    secret: CONFIG.secret as string,
});
