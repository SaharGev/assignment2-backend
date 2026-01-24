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
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendError = (code, message, res) => {
    return res.status(code).send({ message });
};
const genetateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "default_secret";
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || "3600"); // seconds
    const token = jsonwebtoken_1.default.sign({ _id: userId }, secret, { expiresIn: expiresIn });
    const refreshExpiresIn = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || "1440"); // seconds
    const rand = Math.floor(Math.random() * 1000);
    const refreshToken = jsonwebtoken_1.default.sign({ _id: userId, rand: rand }, secret, { expiresIn: refreshExpiresIn });
    return { token, refreshToken };
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (!username || !email || !password) {
        return sendError(400, "Username, email and password are required", res);
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield userModel_1.default.create({ "username": username, "email": email, "password": hashedPassword });
        const token = genetateToken(user._id.toString());
        user.refreshTokens.push(token.refreshToken);
        yield user.save();
        return res.status(201).json(Object.assign({ _id: user._id }, token));
    }
    catch (err) {
        return sendError(500, "Internal server error", res);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return sendError(400, "Email and password are required", res);
    }
    try {
        const user = yield userModel_1.default.findOne({ email: email });
        if (!user) {
            return sendError(401, "Invalid email or password 1", res);
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return sendError(401, "Invalid email or password 2", res);
        }
        const token = genetateToken(user._id.toString());
        user.refreshTokens.push(token.refreshToken);
        yield user.save();
        return res.status(200).json(Object.assign({ _id: user._id }, token));
    }
    catch (err) {
        return sendError(500, "Internal server error", res);
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return sendError(400, "Refresh token is required", res);
    }
    const secret = process.env.JWT_SECRET || "default_secret";
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secret);
        const user = yield userModel_1.default.findById(decoded._id);
        if (!user) {
            return sendError(401, "Invalid refresh token", res);
        }
        if (!user.refreshTokens.includes(refreshToken)) {
            user.refreshTokens = [];
            yield user.save();
            return sendError(401, "Invalid refresh token", res);
        }
        const token = genetateToken(user._id.toString());
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        user.refreshTokens.push(token.refreshToken);
        yield user.save();
        return res.status(200).json(token);
    }
    catch (err) {
        return sendError(401, "Internal server error", res);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return sendError(400, "Refresh token is required", res);
    }
    const secret = process.env.JWT_SECRET || "default_secret";
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secret);
        const user = yield userModel_1.default.findById(decoded._id);
        if (!user) {
            return sendError(401, "Invalid refresh token", res);
        }
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        yield user.save();
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        return sendError(401, "Internal server error", res);
    }
});
exports.default = {
    register,
    login,
    refreshToken,
    logout
};
//# sourceMappingURL=authController.js.map