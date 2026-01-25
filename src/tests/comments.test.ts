// src/tests/comments.test.ts
import request from "supertest";
import initApp from "../index";
import commentModel from "../model/commentModel";
import postModel from "../model/postModel";
import { Express } from "express";
import { commentsList, getLogedInUser, postsList, UserData } from "./utils";

let app: Express;
let commentId = "";
let postId = "";
let user: UserData

beforeAll(async () => {
  app = await initApp();
  await commentModel.deleteMany();
  await postModel.deleteMany();
  user = await getLogedInUser(app);

  // Create a post to associate comments with
  const postRes = await request(app)
    .post("/post")
    .set("Authorization", "Bearer " + user.token)
    .send(postsList[0]);
  expect(postRes.status).toBe(201);
  postId = postRes.body._id;
});

afterAll((done) => {
  done();
});


describe("Sample Test Suite", () => {
  test("Initial empty comments", async () => {
    const response = await request(app).get("/comments");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Create Comment", async () => {
    for (const comment of commentsList) {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + user.token)
        .send({ content: comment.content, postId });

      expect(response.status).toBe(201);
      expect(response.body.content).toBe(comment.content);
      expect(response.body.postId.toString()).toBe(postId.toString());
      expect(response.body).toHaveProperty("sender");
      expect(response.body.sender.toString()).toBe(user._id.toString());
    }
  });

  test("Get All Comments", async () => {
    const response = await request(app).get("/comments");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(commentsList.length);
  });

  test("Get Comments by postId", async () => {
    const response = await request(app).get("/comments?postId=" + postId);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(commentsList.length);
    expect(response.body[0].postId.toString()).toBe(postId.toString());

    commentId = response.body[0]._id;
    expect(commentId).toBeDefined();
  });

  test("Get Comment by ID", async () => {
    const response = await request(app).get("/comments/" + commentId);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(commentId);
    expect(response.body.postId.toString()).toBe(postId.toString());
    expect(response.body).toHaveProperty("sender");
    expect(response.body.sender.toString()).toBe(user._id.toString());
  });

  test("Update Comment", async () => {
    const updated = { content: "This is an updated comment"};

    const response = await request(app)
      .put("/comments/" + commentId)
      .set("Authorization", "Bearer " + user.token)
      .send(updated);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(commentId);
    expect(response.body.content).toBe(updated.content);
    expect(response.body.postId.toString()).toBe(postId.toString());
    expect(response.body).toHaveProperty("sender");
    expect(response.body.sender.toString()).toBe(user._id.toString());
  });

  test("Delete Comment", async () => {
    const response = await request(app)
      .delete("/comments/" + commentId)
      .set("Authorization", "Bearer " + user.token);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(commentId);

    const getResponse = await request(app).get("/comments/" + commentId);
    expect(getResponse.status).toBe(404);
  });
});
