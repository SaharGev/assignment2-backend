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
const commentModel_1 = __importDefault(require("../model/commentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all comments by Post ID
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.query.postId;
    try {
        let comments;
        if (postId && mongoose_1.default.Types.ObjectId.isValid(postId)) {
            comments = yield commentModel_1.default.find({ postId: postId });
        }
        else {
            comments = yield commentModel_1.default.find();
        }
        res.status(200).json(comments);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Get comment by ID
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const comment = yield commentModel_1.default.findById(id);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }
        res.json(comment);
    }
    catch (err) {
        res.status(500).send('Error retrieving comment');
    }
});
// Create a new comment
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = req.body;
    try {
        const newComment = yield commentModel_1.default.create(comment);
        res.status(201).json(newComment);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Delete a comment 
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deleted = yield commentModel_1.default.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).send('Comment not found');
        // res.send('Comment deleted');
        res.status(200).json(deleted);
    }
    catch (err) {
        res.status(500).send('Error deleting comment');
    }
});
//Update a comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const updatedComment = yield commentModel_1.default.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedComment) {
            return res.status(404).send('Comment not found');
        }
        res.json(updatedComment);
    }
    catch (err) {
        res.status(500).send('Error updating comment');
    }
});
exports.default = {
    createComment,
    getCommentById,
    deleteComment,
    updateComment,
    getCommentsByPostId
};
//# sourceMappingURL=commentController.js.map