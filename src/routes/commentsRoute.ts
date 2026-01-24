//routes/commentsRoute.ts
import { Router } from 'express';
import commentController from '../controllers/commentController';
import { authenticate } from '../middleware/authMiddleware';
const router = Router();

router.get('/', commentController.getCommentsByPostId);
router.get('/:id', commentController.getCommentById);
router.post('/', authenticate, commentController.createComment);
router.delete('/:id', authenticate, commentController.deleteComment);
router.put('/:id', authenticate, commentController.updateComment);

export default router;