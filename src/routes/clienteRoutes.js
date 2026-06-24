import { Router } from 'express';
import { getClientes, getClienteById, createCliente, updateCliente, deleteCliente } from '../controllers/clienteController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validateId } from '../middleware/validateId.js';

const router = Router();

router.use(protect);

router.get('/', getClientes);
router.get('/:id', validateId, getClienteById);
router.post('/', restrictTo('admin', 'operador'), createCliente);
router.put('/:id', validateId, restrictTo('admin', 'operador'), updateCliente);
router.delete('/:id', validateId, restrictTo('admin'), deleteCliente);

export default router;
