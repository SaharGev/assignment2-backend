// src/tests/comments.test.ts
import request from "supertest";
import initApp from "../index";
import commentModel from "../model/commentModel";
import { Express } from "express";

let app: Express;
let commentId = "";

beforeAll(async () => {
  app = await initApp();
  await commentModel.deleteMany();
});

afterAll((done) => {
  done();
});

type CommentData = { content: string, postId: string, sender: number, _id?: string };

const commentsList: CommentData[] = [
  { content: "this is my comment", postId: "69500387b6ed5272b29c4730", sender: 22222 },
  { content: "this is my second comment", postId: "69500387b6ed5272b29c4730", sender: 11111 },
  { content: "this is my third comment", postId: "69500387b6ed5272b29c4730", sender: 33333 },
  { content: "this is my fourth comment", postId: "69500387b6ed5272b29c4730", sender: 33333 },
];

describe("Sample Test Suite", () => {

  test("Create Comment", async () => {
    for (const comment of commentsList) {
      const response = await request(app).post("/comments").send(comment);
      expect(response.status).toBe(201);
      expect(response.body.content).toBe(comment.content);
      expect(response.body.postId).toBe(comment.postId);
    }
  });

  test("Get All Comments", async () => {
    const response = await request(app).get("/comments");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(commentsList.length);
  });

  test("Get Comments by postId", async () => {
    const response = await request(app).get(
      "/comments?postId=" + commentsList[0].postId
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    expect(response.body[0].content).toBe(commentsList[0].content);
    commentId = response.body[0]._id;
  });

  test("Get Comment by ID", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(commentsList[0].content);
    expect(response.body.postId).toBe(commentsList[0].postId);
    expect(response.body._id).toBe(commentId);
  });

  test("Update Comment", async () => {
    commentsList[0].content = "This is an updated comment";
    commentsList[0].postId = "69500387b6ed5272b29c4730";
    const response = await request(app)
      .put("/comments/" + commentId)
      .send(commentsList[0]);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(commentsList[0].content);
    expect(response.body.postId).toBe(commentsList[0].postId);
    expect(response.body._id).toBe(commentId);
  });

  test("Delete Comment", async () => {
    const response = await request(app).delete("/comments/" + commentId);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(commentId);

    const getResponse = await request(app).get("/comments/" + commentId);
    expect(getResponse.status).toBe(404);
  });
});
