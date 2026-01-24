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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany();
}));
afterAll((done) => {
    done();
});
describe("Test Auth Suite", () => {
    test("Test Registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "test@test.com";
        const password = "testpass";
        const response = yield (0, supertest_1.default)(app).post("/auth/register")
            .send({ "email": email, "password": password });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "test@test.com";
        const password = "testpass";
        const response = yield (0, supertest_1.default)(app).post("/auth/login")
            .send({ "email": email, "password": password });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    }));
});
//# sourceMappingURL=auth.test.js.map