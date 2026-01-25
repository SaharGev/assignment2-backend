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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.query.username;
        const email = req.query.email;
        if (username) {
            const users = yield userModel_1.default.find({ username: username }).select("-password -refreshTokens");
            return res.status(200).json(users);
        }
        else if (email) {
            const users = yield userModel_1.default.find({ email: email }).select("-password -refreshTokens");
            return res.status(200).json(users);
        }
        else {
            const users = yield userModel_1.default.find().select("-password -refreshTokens");
            return res.status(200).json(users);
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield userModel_1.default.findById(id).select("-password -refreshTokens");
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).send('Error retrieving user');
    }
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email and password are required" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield userModel_1.default.create({
            username,
            email,
            password: hashedPassword,
            refreshTokens: [],
        });
        return res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = Object.assign({}, req.body);
    delete updatedData.refreshTokens;
    try {
        if (updatedData.password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            updatedData.password = yield bcrypt_1.default.hash(updatedData.password, salt);
        }
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, updatedData, { new: true }).select("-password -refreshTokens");
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.json(updatedUser);
    }
    catch (err) {
        res.status(500).send("Error updating user");
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedUser = yield userModel_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({
            _id: deletedUser._id,
            username: deletedUser.username,
            email: deletedUser.email,
        });
    }
    catch (err) {
        res.status(500).send('Error deleting user');
    }
});
exports.default = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=userController.js.map