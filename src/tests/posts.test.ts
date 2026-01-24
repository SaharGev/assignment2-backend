import request from "supertest";
import initApp from "../index";
import postModel from "../model/postModel";
import commentModel from "../model/commentModel";
import { Express } from "express";
import { postsList, commentsList, getLogedInUser, UserData } from "./utils";

let app: Express;
let postId = "";
let user: UserData;

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
  await commentModel.deleteMany();
  user = await getLogedInUser(app);
});

afterAll((done) => {
    done();
});

/*
type CommentData = { content: string };

const commentsList: Omit<CommentData, "postId">[] = [
  { content: "comment 1" },
  { content: "comment 2" },
];
*/

describe("Posts Test Suite", () => {
    test("Initial empty posts", async () => {
        const response = await request(app).get("/post");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("Create Post", async () => {
        for (const post of postsList) {
            const response = await request(app).post("/post").set("Authorization", "Bearer " + user.token).send(post);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(post.title);
            expect(response.body.content).toBe(post.content);
            expect(response.body).toHaveProperty("sender");
            expect(response.body.sender.toString()).toBe(user._id.toString());
        }
    });

    test("Get All Posts", async () => {
        const response = await request(app).get("/post");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(postsList.length);
    });

    test("Get Posts by Sender", async () => {
        const response = await request(app).get("/post?sender=" + user._id);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].title).toBe(postsList[0].title);

        postId = response.body[0]._id;
        expect(postId).toBeDefined();
    });

    test("Get Post by ID", async () => {
        const response = await request(app).get("/post/" + postId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(postId);
        expect(response.body.title).toBe(postsList[0].title);
        expect(response.body.content).toBe(postsList[0].content);
        expect(response.body).toHaveProperty("sender");
        expect(response.body.sender.toString()).toBe(user._id.toString());
    });

    test("Update Post", async () => {
        postsList[0].title = "updated title";
        postsList[0].content = "updated content";

        const response = await (await request(app).put("/post/" + postId).set("Authorization", "Bearer " + user.token).send(postsList[0]));
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(postId);
        expect(response.body.title).toBe(postsList[0].title);
        expect(response.body.content).toBe(postsList[0].content);
        expect(response.body).toHaveProperty("sender");
        expect(response.body.sender.toString()).toBe(user._id.toString());
    });

    test("Get Comments by Post ID", async () => {
        for (const comment of commentsList.slice(0, 2)) {
            const res = await request(app)
            .post("/comments")
            .set("Authorization", "Bearer " + user.token)
            .send({ content: comment.content, postId });

            expect(res.status).toBe(201);
            expect(res.body.content).toBe(comment.content);
            expect(res.body.postId.toString()).toBe(postId.toString());
            expect(res.body.sender.toString()).toBe(user._id.toString());
        }

        const response = await request(app).get("/post/" + postId + "/comments");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].postId.toString()).toBe(postId.toString());
    });

    test("Delete Post", async () => {
        const response = await request(app).delete("/post/" + postId).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(postId);
    });

    test("Get Deleted Post should return 404", async () => {
        const response = await request(app).get("/post/" + postId);
        expect(response.status).toBe(404);
    });
});