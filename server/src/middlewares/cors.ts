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
            "https://142.93.232.240/",
            "http://142.93.232.240/",
            "http://allmendeapp.xyz",
            "https://allmendeapp.xyz",
        ];
    }
    return whiteList;
};

export const middlewareCors = () => {
    // const whiteList = createWhiteList();
    return cors({
        credentials: true,
        origin: (origin: any, callback) => {
            // cases for frontend
            // if (process.env.NODE !== "production") {
            //     callback(null, true);
            // } else {
            //     if (whiteList.indexOf(origin) !== -1 || !origin) {
            //         callback(null, true);
            //     } else {
            //         callback(null, false);
            //     }
            // }
            callback(null, true);
        },
    });
};
