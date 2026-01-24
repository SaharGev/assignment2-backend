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
const userModel_1 = __importDefault(require("../model/userModel"));
const postModel_1 = __importDefault(require("../model/postModel"));
const utils_1 = require("./utils");
let app;
let user;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany();
    yield postModel_1.default.deleteMany();
    user = yield (0, utils_1.getLogedInUser)(app);
}));
afterAll((done) => {
    done();
});
describe("Test Auth Suite", () => {
    test("Test create post without token fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const postData = utils_1.postsList[0];
        const response = yield (0, supertest_1.default)(app).post("/post").send(postData);
        expect(response.status).toBe(401);
    }));
    test("Test Registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const username = "authUser_" + Date.now();
        const email = `auth_${Date.now()}@test.com`;
        const password = "testpass";
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            username,
            email,
            password,
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
    }));
    test("Test Registration missing fields fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const cases = [
            { body: { email: "a@test.com", password: "123456" }, missing: "username" },
            { body: { username: "u1", password: "123456" }, missing: "email" },
            { body: { username: "u1", email: "a@test.com" }, missing: "password" },
        ];
        for (const c of cases) {
            const response = yield (0, supertest_1.default)(app).post("/auth/register").send(c.body);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toBe("Username, email and password are required");
        }
    }));
    test("Test create post with token succeeds", () => __awaiter(void 0, void 0, void 0, function* () {
        const postData = utils_1.postsList[0];
        const response = yield (0, supertest_1.default)(app)
            .post("/post")
            .set("Authorization", "Bearer " + user.token)
            .send(postData);
        expect(response.status).toBe(201);
    }));
    test("Test create a post with compromised token fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const postData = utils_1.postsList[1];
        const compromisedToken = user.token + "a"; // alter the token
        const response = yield (0, supertest_1.default)(app)
            .post("/post")
            .set("Authorization", "Bearer " + compromisedToken)
            .send(postData);
        expect(response.status).toBe(401);
    }));
    test("Test Login missing fields fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const cases = [
            { body: { password: "123456" }, missing: "email" },
            { body: { email: "test@test.com" }, missing: "password" },
        ];
        for (const c of cases) {
            const response = yield (0, supertest_1.default)(app).post("/auth/login").send(c.body);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toBe("Email and password are required");
        }
    }));
    test("Test Login with invalid credentials fails", () => __awaiter(void 0, void 0, void 0, function* () {
        // 1) email not found
        const res1 = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: "notexist@test.com",
            password: "123456",
        });
        expect(res1.status).toBe(401);
        expect(res1.body).toHaveProperty("message");
        // 2) wrong password for existing email
        const res2 = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: user.email,
            password: "wrongPassword",
        });
        expect(res2.status).toBe(401);
        expect(res2.body).toHaveProperty("message");
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = user.email;
        const password = user.password;
        const response = yield (0, supertest_1.default)(app).post("/auth/login")
            .send({ "email": email, "password": password });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        // update tokens for next tests
        user.token = response.body.token;
        user.refreshToken = response.body.refreshToken;
    }));
    test("Test Refresh Token works", () => __awaiter(void 0, void 0, void 0, function* () {
        const refreshResponse = yield (0, supertest_1.default)(app).post("/auth/refresh")
            .send({ "refreshToken": user.refreshToken });
        expect(refreshResponse.status).toBe(200);
        expect(refreshResponse.body).toHaveProperty("token");
        expect(refreshResponse.body).toHaveProperty("refreshToken");
        // update tokens for next tests
        user.token = refreshResponse.body.token;
        user.refreshToken = refreshResponse.body.refreshToken;
        // try to create post again with the new token
        const postData = utils_1.postsList[2];
        const response = yield (0, supertest_1.default)(app)
            .post("/post")
            .set("Authorization", "Bearer " + user.token)
            .send(postData);
        expect(response.status).toBe(201);
    }));
    test("Test double use of refresh token fails", () => __awaiter(void 0, void 0, void 0, function* () {
        // first use of refresh token
        const firstResponse1 = yield (0, supertest_1.default)(app).post("/auth/refresh")
            .send({ refreshToken: user.refreshToken });
        expect(firstResponse1.status).toBe(200);
        expect(firstResponse1.body).toHaveProperty("token");
        expect(firstResponse1.body).toHaveProperty("refreshToken");
        const newRefreshToken = firstResponse1.body.refreshToken;
        // second use of the OLD refresh token - should fail
        const secondResponse = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: user.refreshToken,
        });
        expect(secondResponse.status).toBe(401);
        // try to use the NEW refresh token - should also fail (because list is cleared)
        const refreshResponse3 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: newRefreshToken,
        });
        expect(refreshResponse3.status).toBe(401);
    }));
    test("Test Logout without refresh token fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Refresh token is required");
    }));
    test("Test Logout invalidates refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const logoutResponse = yield (0, supertest_1.default)(app).post("/auth/logout")
            .send({ refreshToken: user.refreshToken });
        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.body).toHaveProperty("message");
        // try to use the same refresh token again - should fail
        const refreshResponse = yield (0, supertest_1.default)(app).post("/auth/refresh")
            .send({ "refreshToken": user.refreshToken });
        expect(refreshResponse.status).toBe(401);
    }));
});
//# sourceMappingURL=auth.test.js.map