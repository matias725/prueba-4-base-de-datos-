import { Router } from 'express';
import { getPedidos, getPedidoById, createPedido, updatePedido, deletePedido } from '../controllers/pedidoController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validateId } from '../middleware/validateId.js';

const router = Router();

router.use(protect);

router.get('/', getPedidos);
router.get('/:id', validateId, getPedidoById);
router.post('/', restrictTo('admin', 'operador'), createPedido);
router.put('/:id', validateId, restrictTo('admin', 'operador'), updatePedido);
router.delete('/:id', validateId, restrictTo('admin', 'operador'), deletePedido);

export default router;
