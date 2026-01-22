//routes/commentsRoute.ts
import { Router } from 'express';
import commentController from '../controllers/commentController';
const router = Router();

router.get('/', commentController.getCommentsByPostId);
router.get('/:id', commentController.getCommentById);
router.post('/', commentController.createComment);
router.delete('/:id', commentController.deleteComment);
router.put('/:id', commentController.updateComment);


export default router;