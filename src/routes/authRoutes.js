import { Router } from 'express';
import { register, login, me, getUsuarios, deleteUsuario } from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.get('/usuarios', protect, restrictTo('admin'), getUsuarios);
router.delete('/usuarios/:id', protect, restrictTo('admin'), deleteUsuario);

export default router;
