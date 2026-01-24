import request from "supertest";
import { Express } from "express";

export type UserData = {
  username: string;
  email: string;
  password: string;
  _id: string;
  token: string;
  refreshToken: string;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
};


export const usersList: RegisterData[] = [
  { username: "user1", email: "user1@test.com", password: "123456" },
  { username: "user2", email: "user2@test.com", password: "123456" },
  { username: "user3", email: "user3@test.com", password: "123456" },
];

export const getLogedInUser = async (app: Express): Promise<UserData> => {
    const authUser = { username: "authUser1", email: "test@test.com", password: "testpass" };
    const username = authUser.username;
    const email = authUser.email;
    const password = authUser.password;
    let response = await request(app).post("/auth/register").send({ username, email, password });
    if (response.status !== 201) {
        response = await request(app).post("/auth/login").send({ email, password });
    }
    const logedUser: UserData = {
        _id: response.body._id,
        token: response.body.token,
        refreshToken: response.body.refreshToken,
        username,
        email,
        password
    };
    return logedUser;
};

export type PostData = {title: string; content: string; sender: number; _id?: string };

export const postsList: PostData[] = [
  { title: "post 1", content: "content 1", sender: 111 },
  { title: "post 2", content: "content 2", sender: 222 },
  { title: "post 3", content: "content 3", sender: 111 },
];

export type CommentData = { content: string, postId: string, sender: number, _id?: string };

export const commentsList: CommentData[] = [
  { content: "this is my comment", postId: "69500387b6ed5272b29c4730", sender: 22222 },
  { content: "this is my second comment", postId: "69500387b6ed5272b29c4730", sender: 11111 },
  { content: "this is my third comment", postId: "69500387b6ed5272b29c4730", sender: 33333 },
  { content: "this is my fourth comment", postId: "69500387b6ed5272b29c4730", sender: 33333 },
];