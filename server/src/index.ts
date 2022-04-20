import app from "./main";
import { CONFIG } from "./config";

app.listen(CONFIG.port, () => {
  console.log(`Server listening on PORT: ${CONFIG.port}`);
});
