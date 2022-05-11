import Express from "express";
import Routes from "./routes";
import { sessionMiddleWare } from "./middlewares";

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({extended: true}));
// app.use(morganMiddleware);
app.use(sessionMiddleWare);
app.use(Routes);

export = app;
