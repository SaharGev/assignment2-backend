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
const utils_1 = require("./utils");
let app;
let userId = "";
let user;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany({});
    user = yield (0, utils_1.getLogedInUser)(app);
}));
afterAll((done) => {
    done();
});
describe("Users Test Suite", () => {
    test("Initial empty users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users").set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1); // because getLogedInUser creates one user
    }));
    test("Create users", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const newUser of utils_1.usersList) {
            const response = yield (0, supertest_1.default)(app)
                .post("/users")
                .set("Authorization", "Bearer " + user.token)
                .send(newUser);
            expect(response.status).toBe(201);
            expect(response.body.username).toBe(newUser.username);
            expect(response.body.email).toBe(newUser.email);
        }
    }));
    test("Get All Users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users").set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(utils_1.usersList.length + 1); // +1 for the logged in user
    }));
    test("Get User by username", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users?username=" + utils_1.usersList[0].username).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].username).toBe(utils_1.usersList[0].username);
        userId = response.body[0]._id;
        expect(userId).toBeDefined();
    }));
    test("Get User by email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users?email=" + utils_1.usersList[1].email).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].email).toBe(utils_1.usersList[1].email);
    }));
    test("Get User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users/" + userId).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.username).toBe(utils_1.usersList[0].username);
        expect(response.body.email).toBe(utils_1.usersList[0].email);
    }));
    test("Update User", () => __awaiter(void 0, void 0, void 0, function* () {
        utils_1.usersList[0].username = "updatedUser1";
        utils_1.usersList[0].email = "updatedUser1@test.com";
        const newPassword = "newPass123";
        const response = yield (0, supertest_1.default)(app)
            .put("/users/" + userId)
            .set("Authorization", "Bearer " + user.token)
            .send(Object.assign(Object.assign({}, utils_1.usersList[0]), { password: newPassword }));
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.username).toBe(utils_1.usersList[0].username);
        expect(response.body.email).toBe(utils_1.usersList[0].email);
        expect(response.body.password).not.toBe(newPassword);
    }));
    test("Delete User", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = (yield (0, supertest_1.default)(app).delete("/users/" + userId).set("Authorization", "Bearer " + user.token));
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
    }));
    test("Get Deleted User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users/" + userId).set("Authorization", "Bearer " + user.token);
        expect(response.status).toBe(404);
    }));
});
//# sourceMappingURL=users.test.js.map