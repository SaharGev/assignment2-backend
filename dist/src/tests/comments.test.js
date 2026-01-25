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
const utils_1 = require("./utils");
let app;
let commentId = "";
let user;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield commentModel_1.default.deleteMany();
    user = yield (0, utils_1.getLogedInUser)(app);
}));
afterAll((done) => {
    done();
});
describe("Sample Test Suite", () => {
    test("Create Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const comment of utils_1.commentsList) {
            const response = yield (0, supertest_1.default)(app).post("/comments").set("Authorization", "Bearer " + user.token).send(comment);
            expect(response.status).toBe(201);
            expect(response.body.content).toBe(comment.content);
            expect(response.body.postId).toBe(comment.postId);
        }
    }));
    test("Get All Comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(utils_1.commentsList.length);
    }));
    test("Get Comments by postId", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?postId=" + utils_1.commentsList[0].postId);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(4);
        expect(response.body[0].content).toBe(utils_1.commentsList[0].content);
        commentId = response.body[0]._id;
    }));
    test("Get Comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.status).toBe(200);
        expect(response.body.content).toBe(utils_1.commentsList[0].content);
        expect(response.body.postId).toBe(utils_1.commentsList[0].postId);
        expect(response.body._id).toBe(commentId);
    }));
    test("Update Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        utils_1.commentsList[0].content = "This is an updated comment";
        utils_1.commentsList[0].postId = "69500387b6ed5272b29c4730";
        const response = yield (0, supertest_1.default)(app)
            .put("/comments/" + commentId)
            .set("Authorization", "Bearer " + user.token)
            .send(utils_1.commentsList[0]);
        expect(response.status).toBe(200);
        expect(response.body.content).toBe(utils_1.commentsList[0].content);
        expect(response.body.postId).toBe(utils_1.commentsList[0].postId);
        expect(response.body._id).toBe(commentId);
    }));
    test("Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = (yield (0, supertest_1.default)(app).delete("/comments/" + commentId).set("Authorization", "Bearer " + user.token));
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(commentId);
        const getResponse = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(getResponse.status).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map