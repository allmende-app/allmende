import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

beforeAll(done => done());
afterAll(done => {
    mongoose.connection.close();
    done();
});

describe("Basic tests", () => {
    jest.setTimeout(100000);
    it("GET /ping route", () => {
        const expectedResponse = {
            foo: 42,
            nature: "allmende",
            nguyen: "dahyun",
        };
        const res = {
            statusCode: StatusCodes.OK,
            body: expectedResponse
        };
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body).toStrictEqual(expectedResponse);
    });
    it("GET /ping route part: 2", () => {
        const expectedResponse = {
            foo: 42,
            nature: "allmende",
            nguyen: "dahyun",
        };
        const wrongExpectation = {
            nguyen: "dahyun",
            tyler: "wow",
            nature: "kek",
            foo: 42,
        };
        const res = {
            statusCode: StatusCodes.OK,
            body: expectedResponse
        };
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.body).not.toBe(wrongExpectation);
    });
})