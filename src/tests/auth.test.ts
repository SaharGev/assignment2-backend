import request from "supertest";
import initApp from "../index";
import { Express } from "express";
import User from "../model/userModel";
import postModel from "../model/postModel";
import { getLogedInUser, UserData, postsList } from "./utils"; 

let app: Express;
let user: UserData;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
  await postModel.deleteMany();
  user = await getLogedInUser(app);
});

afterAll((done) => {
  done();
});

describe("Test Auth Suite", () => {
  test("Test create post without token fails", async () => {
    const postData = postsList[0];
    const response = await request(app).post("/post").send(postData);
    expect(response.status).toBe(401);
  });

    test("Test Registration", async () => {
    const username = "authUser_" + Date.now();
  const email = `auth_${Date.now()}@test.com`;
  const password = "testpass";

  const response = await request(app).post("/auth/register").send({
    username,
    email,
    password,
  });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
  });

  test("Test Registration missing fields fails", async () => {
    const cases = [
      { body: { email: "a@test.com", password: "123456" }, missing: "username" },
      { body: { username: "u1", password: "123456" }, missing: "email" },
      { body: { username: "u1", email: "a@test.com" }, missing: "password" },
    ];

    for (const c of cases) {
      const response = await request(app).post("/auth/register").send(c.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Username, email and password are required");
    }
  });

  test("Test create post with token succeeds", async () => {
    const postData = postsList[0];
    const response = await request(app)
    .post("/post")
    .set("Authorization", "Bearer " + user.token)
    .send(postData);
    expect(response.status).toBe(201);
  });

  test("Test create a post with compromised token fails", async () => {
    const postData = postsList[1];
    const compromisedToken = user.token + "a"; // alter the token
    const response = await request(app)
    .post("/post")
    .set("Authorization", "Bearer " + compromisedToken)
    .send(postData);
    expect(response.status).toBe(401);
  });

  test("Test Login missing fields fails", async () => {
    const cases = [
      { body: { password: "123456" }, missing: "email" },
      { body: { email: "test@test.com" }, missing: "password" },
    ];

    for (const c of cases) {
      const response = await request(app).post("/auth/login").send(c.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Email and password are required");
    }
  });

  test("Test Login with invalid credentials fails", async () => {
    // 1) email not found
    const res1 = await request(app).post("/auth/login").send({
      email: "notexist@test.com",
      password: "123456",
    });

    expect(res1.status).toBe(401);
    expect(res1.body).toHaveProperty("message");

    // 2) wrong password for existing email
    const res2 = await request(app).post("/auth/login").send({
      email: user.email,
      password: "wrongPassword",
    });

    expect(res2.status).toBe(401);
    expect(res2.body).toHaveProperty("message");
  });

  test("Test Login", async () => {
    const email = user.email;
    const password = user.password;
    const response = await request(app).post("/auth/login")
    .send({ "email": email, "password": password });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");

    // update tokens for next tests
    user.token = response.body.token;
    user.refreshToken = response.body.refreshToken;
  });

  test("Test Refresh Token works", async () => {
    const refreshResponse = await request(app).post("/auth/refresh")
    .send({ "refreshToken": user.refreshToken });
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toHaveProperty("token");
    expect(refreshResponse.body).toHaveProperty("refreshToken");

    // update tokens for next tests
    user.token = refreshResponse.body.token;
    user.refreshToken = refreshResponse.body.refreshToken;

    // try to create post again with the new token
    const postData = postsList[2];
    const response = await request(app)
    .post("/post")
    .set("Authorization", "Bearer " + user.token)
    .send(postData);
    expect(response.status).toBe(201);
  });

  test("Test double use of refresh token fails", async () => {
    // first use of refresh token
    const firstResponse1 = await request(app).post("/auth/refresh")
    .send({ refreshToken: user.refreshToken });
    expect(firstResponse1.status).toBe(200);
    expect(firstResponse1.body).toHaveProperty("token");
    expect(firstResponse1.body).toHaveProperty("refreshToken");

    const newRefreshToken = firstResponse1.body.refreshToken;

    // second use of the OLD refresh token - should fail
    const secondResponse = await request(app).post("/auth/refresh").send({
      refreshToken: user.refreshToken,
    });

    expect(secondResponse.status).toBe(401);

    // try to use the NEW refresh token - should also fail (because list is cleared)
    const refreshResponse3 = await request(app).post("/auth/refresh").send({
      refreshToken: newRefreshToken,
    });

    expect(refreshResponse3.status).toBe(401);
  });

  test("Test Logout without refresh token fails", async () => {
    const response = await request(app).post("/auth/logout").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Refresh token is required");
  });

  test("Test Logout invalidates refresh token", async () => {
    const logoutResponse = await request(app).post("/auth/logout")
    .send({ refreshToken: user.refreshToken });
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body).toHaveProperty("message");

    // try to use the same refresh token again - should fail
    const refreshResponse = await request(app).post("/auth/refresh")
    .send({ "refreshToken": user.refreshToken });
    expect(refreshResponse.status).toBe(401);
  });

});