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
const userModel_1 = __importDefault(require("../model/userModel"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.query.username;
        const email = req.query.email;
        if (username) {
            const users = yield userModel_1.default.find({ username: username });
            return res.status(200).json(users);
        }
        else if (email) {
            const users = yield userModel_1.default.find({ email: email });
            return res.status(200).json(users);
        }
        else {
            const users = yield userModel_1.default.find();
            res.status(200).json(users);
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield userModel_1.default.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).send('Error retrieving user');
    }
});
/*
const createUser = async (req: Request, res: Response) => {
    const user = req.body;
    try {
        const newUser = await userModel.create(user);
        res.status(201).json(newUser);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
*/
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    }
    catch (err) {
        res.status(500).send('Error updating user');
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedUser = yield userModel_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(deletedUser);
    }
    catch (err) {
        res.status(500).send('Error deleting user');
    }
});
exports.default = {
    getAllUsers,
    getUserById,
    //createUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=userController.js.map