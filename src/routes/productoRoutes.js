import { Router } from 'express';
import { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } from '../controllers/productoController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validateId } from '../middleware/validateId.js';

const router = Router();

router.use(protect);

router.get('/', getProductos);
router.get('/:id', validateId, getProductoById);
router.post('/', restrictTo('admin', 'operador'), createProducto);
router.put('/:id', validateId, restrictTo('admin', 'operador'), updateProducto);
router.delete('/:id', validateId, restrictTo('admin'), deleteProducto);

export default router;
