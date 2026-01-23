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
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sender = req.query.sender;
        if (sender) {
            const posts = yield postModel_1.default.find({ sender: sender });
            return res.json(posts);
        }
        else {
            const posts = yield postModel_1.default.find();
            res.json(posts);
        }
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
    const post = req.body;
    console.log(post);
    try {
        const newPost = yield postModel_1.default.create(post);
        res.status(201).json(newPost);
    }
    catch (err) {
        res.status(500).send('Error creating post');
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
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
exports.default = {
    getAllPosts,
    getPostById,
    createNewPost,
    updatePost,
    getCommentsByPostId
};
//# sourceMappingURL=postControllers.js.map