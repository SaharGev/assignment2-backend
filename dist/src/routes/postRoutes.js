"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/postRoutes.ts
const express_1 = require("express");
const postControllers_1 = __importDefault(require("../controllers/postControllers"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', postControllers_1.default.getAllPosts);
router.get('/:postId/comments', postControllers_1.default.getCommentsByPostId);
router.get('/:id', postControllers_1.default.getPostById);
router.post('/', authMiddleware_1.authenticate, postControllers_1.default.createNewPost);
router.put('/:id', authMiddleware_1.authenticate, postControllers_1.default.updatePost);
router.delete('/:id', authMiddleware_1.authenticate, postControllers_1.default.deletePost);
exports.default = router;
