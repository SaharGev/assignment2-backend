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
let app;
let userId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany({});
}));
afterAll((done) => {
    done();
});
const usersList = [
    { username: "user1", email: "user1@test.com", password: "123456" },
    { username: "user2", email: "user2@test.com", password: "123456" },
    { username: "user3", email: "user3@test.com", password: "123456" },
];
describe("Users Test Suite", () => {
    test("Initial empty users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    test("Create users", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const user of usersList) {
            const response = yield (0, supertest_1.default)(app)
                .post("/users")
                .send(user);
            expect(response.status).toBe(201);
            expect(response.body.username).toBe(user.username);
            expect(response.body.email).toBe(user.email);
        }
    }));
    test("Get All Users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(usersList.length);
    }));
    test("Get User by username", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users?username=" + usersList[0].username);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].username).toBe(usersList[0].username);
        userId = response.body[0]._id;
        expect(userId).toBeDefined();
    }));
    test("Get User by email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users?email=" + usersList[1].email);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].email).toBe(usersList[1].email);
    }));
    test("Get User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users/" + userId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.username).toBe(usersList[0].username);
        expect(response.body.email).toBe(usersList[0].email);
    }));
    test("Update User", () => __awaiter(void 0, void 0, void 0, function* () {
        usersList[0].username = "updatedUser1";
        usersList[0].email = "updatedUser1@test.com";
        const response = yield (0, supertest_1.default)(app)
            .put("/users/" + userId)
            .send(usersList[0]);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.username).toBe(usersList[0].username);
        expect(response.body.email).toBe(usersList[0].email);
    }));
    test("Delete User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/users/" + userId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
    }));
    test("Get Deleted User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users/" + userId);
        expect(response.status).toBe(404);
    }));
});
//# sourceMappingURL=users.test.js.map