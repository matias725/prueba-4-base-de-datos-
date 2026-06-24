import { Router } from 'express';
import { getTransacciones, getTransaccionById, createTransaccion, updateTransaccion, deleteTransaccion } from '../controllers/transaccionController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validateId } from '../middleware/validateId.js';

const router = Router();

router.use(protect);

router.get('/', getTransacciones);
router.get('/:id', validateId, getTransaccionById);
router.post('/', restrictTo('admin', 'operador'), createTransaccion);
router.put('/:id', validateId, restrictTo('admin', 'operador'), updateTransaccion);
router.delete('/:id', validateId, restrictTo('admin'), deleteTransaccion);

export default router;
