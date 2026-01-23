"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/commentRoute.ts
const express_1 = require("express");
const commentController_1 = __importDefault(require("../controllers/commentController"));
const router = (0, express_1.Router)();
router.get('/', commentController_1.default.getCommentsByPostId);
router.get('/:id', commentController_1.default.getCommentById);
router.post('/', commentController_1.default.createComment);
router.delete('/:id', commentController_1.default.deleteComment);
router.put('/:id', commentController_1.default.updateComment);
exports.default = router;
//# sourceMappingURL=commentsRoute.js.map