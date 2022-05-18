import Supertest from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../main";

const requests = Supertest(app);

describe("Test Routes", () => {
    it("Test /GET API Route", async () => {
        const req = await requests.get("/api");
        expect(req.statusCode).toBe(StatusCodes.OK);
        expect(req.text).toBe("From API Controller");
    });
    it("Test /GET Predict Route", async () => {
        const req = await requests.get("/api/predict");
        expect(req.statusCode).toBe(StatusCodes.OK);
        expect(req.text).toBe("From Prediction Controller");
    });
    // it("Test /GET Upload Route", async () => {
    //   const req = await requests.get("/api/upload");
    //   expect(req.statusCode).toBe(StatusCodes.OK);
    //   expect(req.text).toBe("From Upload Controller");
    // });
});
