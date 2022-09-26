const supertest = require("supertest");
const app = require("../../app");

describe("User route", () => {
  it("it should response the get method ", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
