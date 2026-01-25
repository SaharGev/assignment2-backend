"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/usersRoute.ts
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authenticate, userController_1.default.createUser);
router.get('/', authMiddleware_1.authenticate, userController_1.default.getAllUsers);
router.get('/:id', authMiddleware_1.authenticate, userController_1.default.getUserById);
router.put('/:id', authMiddleware_1.authenticate, userController_1.default.updateUser);
router.delete('/:id', authMiddleware_1.authenticate, userController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=usersRoute.js.map