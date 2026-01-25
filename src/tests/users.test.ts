import request from "supertest";
import initApp from "../index";
import userModel from "../model/userModel";
import e, { Express } from "express";

let app: Express;
let userId = "";

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany({});
});

afterAll((done) => {
   done();
});

type UserData = { username: string; email: string; password: string; _id?: string };

const usersList: UserData[] = [
    { username: "user1", email: "user1@test.com", password: "123456" },
  { username: "user2", email: "user2@test.com", password: "123456" },
  { username: "user3", email: "user3@test.com", password: "123456" },
];

describe("Users Test Suite", () => {
    test("Initial empty users", async () => {
        const response = await request(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("Create users", async () => {
        for (const user of usersList) {
            const response = await request(app)
                .post("/users")
                .send(user);
            expect(response.status).toBe(201);
            expect(response.body.username).toBe(user.username);
            expect(response.body.email).toBe(user.email);
        }
    });

    test("Get All Users", async () => {
        const response = await request(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(usersList.length);
    });

    test("Get User by username", async () => {
        const response = await request(app).get("/users?username=" + usersList[0].username);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].username).toBe(usersList[0].username);
        userId = response.body[0]._id;
        expect(userId).toBeDefined();
    });

    test("Get User by email", async () => {
        const response = await request(app).get("/users?email=" + usersList[1].email);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].email).toBe(usersList[1].email);
    });

    test("Get User by ID", async () => {
        const response = await request(app).get("/users/" + userId);
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
            .send(usersList[0]);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.username).toBe(usersList[0].username);
        expect(response.body.email).toBe(usersList[0].email);
    });

    test("Delete User", async () => {
        const response = await request(app).delete("/users/" + userId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
    });

    test("Get Deleted User by ID", async () => {
        const response = await request(app).get("/users/" + userId);
        expect(response.status).toBe(404);
    });

});