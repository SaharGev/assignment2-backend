import request from "supertest";
import initApp from "../index";
import userModel from "../model/userModel";
import { Express } from "express";
import { usersList, UserData, getLogedInUser } from "./utils";

let app: Express;
let userId = "";
let user: UserData;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany({});
  user = await getLogedInUser(app);
});

afterAll((done) => {
   done();
});

describe("Users Test Suite", () => {
    test("Initial empty users", async () => {
        const response = await request(app).get("/users").set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1); // because getLogedInUser creates one user
    });

    /*
    test("Create users", async () => {
        for (const newUser of usersList) {
            const response = await request(app)
                .post("/users")
                .set("Authorization", "Bearer " + user.token)
                .send(newUser);
            expect(response.status).toBe(201);
            expect(response.body.username).toBe(newUser.username);
            expect(response.body.email).toBe(newUser.email);
        }
    });
    */
    test("Register users", async () => {
    for (const newUser of usersList) {
        const response = await request(app)
        .post("/auth/register")
        .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
    }
    });

    test("Get All Users", async () => {
        const response = await request(app).get("/users").set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(usersList.length + 1); // +1 for the logged in user
    });

    test("Get User by username", async () => {
        const response = await request(app).get("/users?username=" + usersList[0].username).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].username).toBe(usersList[0].username);
        userId = response.body[0]._id;
        expect(userId).toBeDefined();
    });

    test("Get User by email", async () => {
        const response = await request(app).get("/users?email=" + usersList[1].email).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].email).toBe(usersList[1].email);
    });

    test("Get User by ID", async () => {
        const response = await request(app).get("/users/" + userId).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.username).toBe(usersList[0].username);
        expect(response.body.email).toBe(usersList[0].email);   
    });

    test("Update User", async () => {
        usersList[0].username = "updatedUser1";
        usersList[0].email = "updatedUser1@test.com";
        const response = await request(app)
            .put("/users/" + userId)
            .set("Authorization", "Bearer " + user.token)
            .send(usersList[0]);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.username).toBe(usersList[0].username);
        expect(response.body.email).toBe(usersList[0].email);
    });

    test("Delete User", async () => {
        const response = (await request(app).delete("/users/" + userId).set("Authorization", "Bearer " + user.token));
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
    });

    test("Get Deleted User by ID", async () => {
        const response = await request(app).get("/users/" + userId).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(404);
    });

});