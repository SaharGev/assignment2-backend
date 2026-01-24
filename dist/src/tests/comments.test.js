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
// src/tests/comments.test.ts
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const commentModel_1 = __importDefault(require("../model/commentModel"));
const postModel_1 = __importDefault(require("../model/postModel"));
const utils_1 = require("./utils");
let app;
let commentId = "";
let postId = "";
let user;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield commentModel_1.default.deleteMany();
    yield postModel_1.default.deleteMany();
    user = yield (0, utils_1.getLogedInUser)(app);
    // Create a post to associate comments with
    const postRes = yield (0, supertest_1.default)(app)
        .post("/post")
        .set("Authorization", "Bearer " + user.token)
        .send(utils_1.postsList[0]);
    expect(postRes.status).toBe(201);
    postId = postRes.body._id;
}));
afterAll((done) => {
    done();
});
describe("Sample Test Suite", () => {
    test("Initial empty comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    test("Create Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const comment of utils_1.commentsList) {
            const response = yield (0, supertest_1.default)(app)
                .post("/comments")
                .set("Authorization", "Bearer " + user.token)
                .send({ content: comment.content, postId });
            expect(response.status).toBe(201);
            expect(response.body.content).toBe(comment.content);
            expect(response.body.postId.toString()).toBe(postId.toString());
            expect(response.body).toHaveProperty("sender");
            expect(response.body.sender.toString()).toBe(user._id.toString());
        }
    }));
    test("Get All Comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(utils_1.commentsList.length);
    }));
    test("Get Comments by postId", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?postId=" + postId);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(utils_1.commentsList.length);
        expect(response.body[0].postId.toString()).toBe(postId.toString());
        commentId = response.body[0]._id;
        expect(commentId).toBeDefined();
    }));
    test("Get Comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(commentId);
        expect(response.body.postId.toString()).toBe(postId.toString());
        expect(response.body).toHaveProperty("sender");
        expect(response.body.sender.toString()).toBe(user._id.toString());
    }));
    test("Update Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const updated = { content: "This is an updated comment" };
        const response = yield (0, supertest_1.default)(app)
            .put("/comments/" + commentId)
            .set("Authorization", "Bearer " + user.token)
            .send(updated);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(commentId);
        expect(response.body.content).toBe(updated.content);
        expect(response.body.postId.toString()).toBe(postId.toString());
        expect(response.body).toHaveProperty("sender");
        expect(response.body.sender.toString()).toBe(user._id.toString());
    }));
    test("Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/comments/" + commentId)
            .set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(commentId);
        const getResponse = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(getResponse.status).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map