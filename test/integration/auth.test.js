const supertest = require("supertest");
const app = require("../../app");
const sessionStore = require("../../db/mongo-store");

describe("User route", () => {
  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    sessionStore.close();
    done();
  });

  it("it should response the get method ", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  it("it should return user creation ", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
