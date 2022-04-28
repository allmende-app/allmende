import app from "./main";
import { CONFIG, initializeFolders, connectDB } from "./config";
import { Logger } from "./lib";

app.listen(CONFIG.port, async() => {
  try {
    const res = await connectDB();
    initializeFolders();
    Logger.info(`Connected to DB: "${res.connections[0].name}"`);
    Logger.info(`Server listening on PORT: ${CONFIG.port}`);
  } catch (e) {
    Logger.error(e);
  }
});
