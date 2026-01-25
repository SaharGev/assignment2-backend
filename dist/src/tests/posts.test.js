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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const postModel_1 = __importDefault(require("../model/postModel"));
const commentModel_1 = __importDefault(require("../model/commentModel"));
let app;
let postId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield postModel_1.default.deleteMany();
    yield commentModel_1.default.deleteMany();
}));
afterAll((done) => {
    done();
});
const postsList = [
    { title: "post 1", content: "content 1", sender: 111 },
    { title: "post 2", content: "content 2", sender: 222 },
    { title: "post 3", content: "content 3", sender: 111 },
];
const commentsList = [
    { content: "comment 1", sender: 111 },
    { content: "comment 2", sender: 222 },
];
describe("Posts Test Suite", () => {
    test("Initial empty posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    test("Create Post", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const post of postsList) {
            const response = yield (0, supertest_1.default)(app).post("/post").send(post);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(post.title);
            expect(response.body.content).toBe(post.content);
            expect(response.body.sender).toBe(post.sender);
        }
    }));
    test("Get All Posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(postsList.length);
    }));
    test("Get Posts by Sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post?sender=" + postsList[0].sender);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].title).toBe(postsList[0].title);
        postId = response.body[0]._id;
        expect(postId).toBeDefined();
    }));
    test("Get Post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post/" + postId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(postId);
        expect(response.body.title).toBe(postsList[0].title);
        expect(response.body.content).toBe(postsList[0].content);
        expect(response.body.sender).toBe(postsList[0].sender);
    }));
    test("Update Post", () => __awaiter(void 0, void 0, void 0, function* () {
        postsList[0].title = "updated title";
        postsList[0].content = "updated content";
        postsList[0].sender = 333;
        const response = yield (0, supertest_1.default)(app).put("/post/" + postId).send(postsList[0]);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(postId);
        expect(response.body.title).toBe(postsList[0].title);
        expect(response.body.content).toBe(postsList[0].content);
        expect(response.body.sender).toBe(postsList[0].sender);
    }));
    test("Get Comments by Post ID", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const comment of commentsList) {
            const res = yield (0, supertest_1.default)(app).post("/comments").send(Object.assign(Object.assign({}, comment), { postId }));
            expect(res.status).toBe(201);
            expect(res.body.content).toBe(comment.content);
            expect(res.body.postId).toBe(postId);
        }
        const response = yield (0, supertest_1.default)(app).get("/post/" + postId + "/comments");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].postId).toBe(postId);
    }));
    test("Delete Post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/post/" + postId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("Get Deleted Post should return 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post/" + postId);
        expect(response.status).toBe(404);
    }));
});
//# sourceMappingURL=posts.test.js.map