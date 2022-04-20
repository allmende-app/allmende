import Express from "express";
import Routes from "./routes";
import { morganMiddleware } from "./lib";

const app = Express();

app.use(Express.json());
app.use(morganMiddleware);
app.use(Routes);

export = app;
