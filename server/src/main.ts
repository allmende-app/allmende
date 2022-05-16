import Express from "express";
import Routes from "./routes";
import { sessionMiddleWare } from "./middlewares";
import cors from  'cors';

const app = Express();

const corsOptions: cors.CorsOptions = {
  origin: 'http://127.0.0.1:3001',
  credentials: true,
  exposedHeaders: ["set-cookie"],
}
app.use(cors(corsOptions))
app.use(Express.json());
app.use(Express.urlencoded({extended: true}));
// app.use(morganMiddleware);
app.use(sessionMiddleWare);
app.use(Routes);

export = app;
