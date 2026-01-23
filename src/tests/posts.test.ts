import request from "supertest";
import initApp from "../index";
import postModel from "../model/postModel";
import commentModel from "../model/commentModel";
import e, { Express } from "express";

let app: Express;
let postId = "";

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
  await commentModel.deleteMany();
});

afterAll((done) => {
    done();
});

type PostData = { title: string, content: string, sender: number, _id?: string };

const postsList: PostData[] = [
    { title: "post 1", content: "content 1", sender: 111 },
    { title: "post 2", content: "content 2", sender: 222 },
    { title: "post 3", content: "content 3", sender: 111 },
];

type CommentData = { content: string; postId: string; sender: number; _id?: string };

const commentsList: Omit<CommentData, "postId">[] = [
  { content: "comment 1", sender: 111 },
  { content: "comment 2", sender: 222 },
];

describe("Posts Test Suite", () => {
    test("Initial empty posts", async () => {
        const response = await request(app).get("/post");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("Create Post", async () => {
        for (const post of postsList) {
            const response = await request(app).post("/post").send(post);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(post.title);
            expect(response.body.content).toBe(post.content);
            expect(response.body.sender).toBe(post.sender);
        }
    });

    test("Get All Posts", async () => {
        const response = await request(app).get("/post");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(postsList.length);
    });

    test("Get Posts by Sender", async () => {
        const response = await request(app).get("/post?sender=" + postsList[0].sender);
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
        expect(response.body.sender).toBe(postsList[0].sender);
    });

    test("Update Post", async () => {
        postsList[0].title = "updated title";
        postsList[0].content = "updated content";
        postsList[0].sender = 333;

        const response = await request(app).put("/post/" + postId).send(postsList[0]);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(postId);
        expect(response.body.title).toBe(postsList[0].title);
        expect(response.body.content).toBe(postsList[0].content);
        expect(response.body.sender).toBe(postsList[0].sender);
    });

    test("Get Comments by Post ID", async () => {
        for (const comment of commentsList) {
            const res = await request(app).post("/comments").send({ ...comment, postId });
            expect(res.status).toBe(201);
            expect(res.body.content).toBe(comment.content);
            expect(res.body.postId).toBe(postId);
        }
        const response = await request(app).get("/post/" + postId + "/comments");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].postId).toBe(postId);
    });

    test("Delete Post", async () => {
        const response = await request(app).delete("/post/" + postId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(postId);
    });

    test("Get Deleted Post should return 404", async () => {
        const response = await request(app).get("/post/" + postId);
        expect(response.status).toBe(404);
    });
});