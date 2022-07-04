import { connectDB, fetchAndInsert, readIDsFromDirectory } from "./config";
import pLimit from "p-limit";
import { Logger } from "./lib";

(async () => {
    // const pLimit = await import("p-limit")
    const res = await connectDB();

    Logger.info(`Connected to db: ${res.connections[0].port}`);
    const limit = pLimit(1);
    const ids = await readIDsFromDirectory("resources");
    let current = 1;
    // console.log(ids)
    const inputs = [];
    for (let i = 0; i < ids.length; i += 20) {
        const curr = ids.slice(i, i + 20);
        console.log(current);
        current++;
        inputs.push(limit(() => fetchAndInsert(curr)));
    }
    const result = await Promise.all(inputs);
    console.log(result);
})();
