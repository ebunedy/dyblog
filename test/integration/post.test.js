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

describe("Post route", () => {
  /*it("POST /api/v1/post/create it should return user creation ", async () => {
    const post = {
      title: "Linux tr Command with Examples",
      body: `
        <h2>Introduction</h2>
        <p>The tr command is a Linux command-line utility that translates or deletes characters
        from standard input (stdin) and writes the result to standard output (stdout). Use tr
        to perform different text transformations, including case conversion, squeezing or
        deleting characters, and basic text replacement.
        Since tr can't read a file directly and outputs the results in standard output, it is often
        used with pipes (|) and redirects (>>) to allow more complex file content processing.
        </p>
        <h3>Prerequisites</h3>
        <ul>
          <li>A system running Linux.</li>
          <li>Access to the terminal (Ctrl + Alt + T).</li>
        </ul>
        <p>The tr command is a Linux command-line utility that translates or deletes characters
        from standard input (stdin) and writes the result to standard output (stdout). Use tr
        to perform different text transformations, including case conversion, squeezing or
        deleting characters, and basic text replacement.
        Since tr can't read a file directly and outputs the results in standard output, it is often
        used with pipes (|) and redirects (>>) to allow more complex file content processing.
        </p>
      `,
      tags: ["6356f305676e46a177ef9e5a", "63571077a1f185ddff2e9561"],
    };
    const response = await supertest(app)
      .post("/api/v1/post/create")
      .send(post);
    expect(response.status).toBe(201);
    expect(response.message).toBe("post created successfully");
  });*/

  it("Get /api/v1/post/6357ff7ffc443e5a4c7ae496 it should return a single post", async () => {
    const response = await supertest(app).get(
      "/api/v1/post/6357ff7ffc443e5a4c7ae496"
    );
    expect(response.status).toBe(200);
  });

  it("Get /api/v1/post/pre-update/6357ff7ffc443e5a4c7ae496 it should return post to be updated", async () => {
    const response = await supertest(app).get(
      "/api/v1/post/pre-update/6357ff7ffc443e5a4c7ae496"
    );
    expect(response.status).toBe(200);
  });

  it("Get /api/v1/post/related-posts/6357ff7ffc443e5a4c7ae496?tag=react it should return related posts", async () => {
    const response = await supertest(app).get(
      "/api/v1/post/related-posts/6357ff7ffc443e5a4c7ae496?tag=react"
    );
    expect(response.status).toBe(200);
  });

  it("Post /api/v1/post/update/6357ff7ffc443e5a4c7ae496 it should update posts", async () => {
    const newpost = {
      title: "Linux find Command Usage",
    };
    const response = await supertest(app)
      .patch("/api/v1/post/update/6357ff7ffc443e5a4c7ae496")
      .send(newpost);
    expect(response.status).toBe(200);
  });

  it("Post /api/v1/post/add-like/6357ff7ffc443e5a4c7ae496 it should update posts", async () => {
    const response = await supertest(app).patch(
      "/api/v1/post/add-like/6357ff7ffc443e5a4c7ae496"
    );
    expect(response.status).toBe(200);
  });
});
