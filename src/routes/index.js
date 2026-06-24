import { Router } from 'express';
import os from 'os';
import authRoutes from './authRoutes.js';
import clienteRoutes from './clienteRoutes.js';
import productoRoutes from './productoRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import transaccionRoutes from './transaccionRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.get('/health', (req, res) =>
  res.json({ success: true, message: 'ComercioTech API funcionando correctamente', timestamp: new Date() })
);

// Información del servidor para el frontend
router.get('/server-info', (req, res) => {
  const interfaces = os.networkInterfaces();
  let privateIp = 'N/A';
  for (const iface of Object.values(interfaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) { privateIp = alias.address; break; }
    }
    if (privateIp !== 'N/A') break;
  }
  res.json({ success: true, hostname: os.hostname(), privateIp });
});

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/clientes', clienteRoutes);
router.use('/productos', productoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/transacciones', transaccionRoutes);

export default router;
