"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/postRoutes.ts
const express_1 = require("express");
const postControllers_1 = __importDefault(require("../controllers/postControllers"));
const router = (0, express_1.Router)();
router.get('/', postControllers_1.default.getAllPosts);
router.get('/:id', postControllers_1.default.getPostById);
router.post('/', postControllers_1.default.createNewPost);
router.put('/:id', postControllers_1.default.updatePost);
router.get('/:postId/comments', postControllers_1.default.getCommentsByPostId);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map