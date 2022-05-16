import cors from "cors";

export const createWhiteList = () => {
    let whiteList: string[] = [];
    if (process.env.NODE_ENV !== "production") {
        for (let i = 1000; i < 9000; i++) {
            const url = `http://localhost:${i}`;
            whiteList.push(url);
        }
    } else {
        whiteList = [
            "http://"
        ];
    }
    return whiteList;
}

export const middlewareCors = () => {
    const whiteList = createWhiteList();
    return cors({
        credentials: true,
        origin: (origin: any, callback) => {
            // cases for frontend 
            if (whiteList.includes(origin)) {
                callback(null, true);
            // case for POSTMAN
            } else if (process.env.NODE_ENV !== "production") {
                callback(null, true);
            } else {
                callback(new Error("not whitelisted"));
            }
        }
    });
}