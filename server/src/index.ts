import app from "./main";
import { CONFIG, initializeFolders } from "./config";
import { Logger } from "./lib";

app.listen(CONFIG.port, () => {
  initializeFolders();
  Logger.info(`Server listening on PORT: ${CONFIG.port}`);
});
