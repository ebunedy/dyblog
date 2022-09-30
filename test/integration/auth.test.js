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

  it("POST /api/v1/user-auth/register it should return user creation ", async () => {
    const user = {
      name: "New name",
      username: "namelove",
      email: "a@gmail.com",
      password: "test23488",
    };
    const response = await supertest(app)
      .post("/api/v1/user-auth/register")
      .send(user);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New name");
  });
});
