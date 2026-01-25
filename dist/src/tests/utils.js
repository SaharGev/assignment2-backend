"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsList = exports.postsList = exports.getLogedInUser = exports.usersList = void 0;
const supertest_1 = __importDefault(require("supertest"));
exports.usersList = [
    { username: "user1", email: "user1@test.com", password: "123456" },
    { username: "user2", email: "user2@test.com", password: "123456" },
    { username: "user3", email: "user3@test.com", password: "123456" },
];
const getLogedInUser = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = { username: "authUser1", email: "test@test.com", password: "testpass" };
    const username = authUser.username;
    const email = authUser.email;
    const password = authUser.password;
    let response = yield (0, supertest_1.default)(app).post("/auth/register").send({ username, email, password });
    if (response.status !== 201) {
        response = yield (0, supertest_1.default)(app).post("/auth/login").send({ email, password });
    }
    const logedUser = {
        _id: response.body._id,
        token: response.body.token,
        refreshToken: response.body.refreshToken,
        username,
        email,
        password
    };
    return logedUser;
});
exports.getLogedInUser = getLogedInUser;
exports.postsList = [
    { title: "post 1", content: "content 1" },
    { title: "post 2", content: "content 2" },
    { title: "post 3", content: "content 3" },
];
exports.commentsList = [
    { content: "comment 1" },
    { content: "comment 2" },
    { content: "comment 3" },
];
