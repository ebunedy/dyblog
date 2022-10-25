const supertest = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const sessionStore = require("../../db/mongo-store");

beforeEach((done) => {
  jest.setTimeout(60000);
  mongoose.connect(
    "mongodb://localhost:27017/dyblog",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  sessionStore.close();
  mongoose.connection.close(() => done());
});

describe("User route", () => {
  it("GET / it should response the get method ", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  it("GET /api/v1/user/profile/lovedy it should return user profile ", async () => {
    const response = await supertest(app).get("/api/v1/user/profile/lovedy");
    expect(response.status).toBe(200);
    //expect(response).toBe("New name");
  });
});
