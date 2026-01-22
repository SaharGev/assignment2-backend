import request from "supertest";
import initApp from "../index";
//import moviesModel from "../model/moviesModel";
import { Express } from "express";
import User from "../model/userModel";
//import { getLogedInUser, UserData, MovieData, moviesList } from "./utils"

let app: Express;
//let loginUser: UserData;
let movieId = "";

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
  //oginUser = await getLogedInUser(app);
});

afterAll((done) => {
  done();
});

describe("Test Auth Suite", () => {
  test("Test Registration", async () => {
    const email = "test@test.com";
    const password = "testpass";
    const response = await request(app).post("/auth/register")
    .send({ "email": email, "password": password });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  test("Test Login", async () => {
    const email = "test@test.com";
    const password = "testpass";
    const response = await request(app).post("/auth/login")
    .send({ "email": email, "password": password });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
  
});