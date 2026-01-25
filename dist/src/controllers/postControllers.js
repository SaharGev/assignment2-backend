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
const postModel_1 = __importDefault(require("../model/postModel"));
const commentModel_1 = __importDefault(require("../model/commentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = req.query.sender;
        if (sender && mongoose_1.default.Types.ObjectId.isValid(sender)) {
            const posts = yield postModel_1.default.find({ sender });
            return res.status(200).json(posts);
        }
        const posts = yield postModel_1.default.find();
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield postModel_1.default.findById(id);
        if (!post) {
            return res.status(404).send('post not found');
        }
        res.json(post);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('error getting post by id');
    }
});
const createNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        const newPost = yield postModel_1.default.create({
            title,
            content,
            sender: userId,
        });
        res.status(201).json(newPost);
    }
    catch (err) {
        res.status(500).send("Error creating post");
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = Object.assign({}, req.body);
    delete updatedData.sender;
    try {
        const updatedPost = yield postModel_1.default.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedPost) {
            return res.status(404).send('Post not found');
        }
        res.json(updatedPost);
    }
    catch (err) {
        res.status(500).send('Error updating post');
    }
});
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const comments = yield commentModel_1.default.find({ postId: postId });
        res.status(200).json(comments);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedPost = yield postModel_1.default.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).send('Post not found');
        }
        res.json(deletedPost);
    }
    catch (err) {
        res.status(500).send('Error deleting post');
    }
});
exports.default = {
    getAllPosts,
    getPostById,
    createNewPost,
    updatePost,
    getCommentsByPostId,
    deletePost
};
//# sourceMappingURL=postControllers.js.map