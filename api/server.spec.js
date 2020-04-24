const server = require("./server");

const request = require("supertest");
const db = require("../database/dbConfig");

describe("POST /api/auth/register", () => {
  const newUser = { username: "samet", password: "123" };
  const { username } = newUser;

  beforeEach(async () => {
    await db("users").truncate(); // Empty rows, reset ID back to 1
  });

  it("returns 201 OK", async () => {
    await request(server)
      .post("/api/auth/register")
      .send(newUser)
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  it("returns with user object after register", async () => {
    await request(server)
      .post("/api/auth/register")
      .send(newUser)
      .then((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("username");
        expect(res.body).toHaveProperty("password");
      });
  });

  it("user found in DB after registering", async () => {
    await request(server)
      .post("/api/auth/register")
      .send(newUser)
      .then(async (res) => {
        const addedUser = await db("users").where({ username }).first();
        expect(addedUser).toHaveProperty("id");
        expect(addedUser).toHaveProperty("username");
        expect(addedUser).toHaveProperty("password");
      });
  });
});

describe("POST /api/auth/login", () => {
  const newUser = { username: "samet", password: "123" };
  const { username } = newUser;

  it("returns 200 OK with right credentials", async () => {
    await request(server)
      .post("/api/auth/login")
      .send(newUser)
      .then((res) => {
        expect(res.status).toBe(200);
      })
      .catch((err) => console.log(err));
  });

  it("returns 400 OK with wrong credentials", async () => {
    await request(server)
      .post("/api/auth/login")
      .send({ username: "asd" })
      .then((res) => {
        expect(res.status).toBe(400);
      })
      .catch((err) => console.log(err));
  });

  it("returning object have token", async () => {
    await request(server)
      .post("/api/auth/login")
      .send(newUser)
      .then((res) => {
        expect(res.body.message.includes("Welcome, ")).toBe(true);
        expect(res.body).toHaveProperty("token");
      })
      .catch((err) => console.log(err));
  });
});

describe("GET /api/jokes", () => {
  it("returns 404 without token in header", () => {
    return request(server)
      .get("/api/jokes")
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it.todo("returns an array of jokes with valid token");
});
