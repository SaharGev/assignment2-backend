//routes/usersRoute.ts
import express from 'express';
import userController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

//router.post('/', userController.createUser);
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

export default router;
