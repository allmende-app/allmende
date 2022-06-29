import { connectDB, fetchAndInsert, fetchGBIFData, readIDsFromDirectory } from "./config"
import pLimit from "p-limit"


(async () => {
    // const pLimit = await import("p-limit")
    const res = await connectDB();

    console.log(`Connected to db: ${res.connections[0].port}`)
    console.log("hi")
    const limit = pLimit(1);
    const ids = await readIDsFromDirectory("resources")
    let current = 1;
    // console.log(ids)
    const inputs = [];
    for (let i = 0; i < ids.length; i += 20) {
        const curr = ids.slice(i, i + 20);
        console.log(current)
        current++;
        inputs.push(limit(() => fetchAndInsert(curr)))
    }
    const result = await Promise.all(inputs)
    console.log(result)
})()