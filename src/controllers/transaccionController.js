import { Transaccion } from '../models/Transaccion.js';
import { Pedido } from '../models/Pedido.js';

// ──────────────────────────────────────────────
// CRUD de Transacciones
// ──────────────────────────────────────────────

export const getTransacciones = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [transacciones, total] = await Promise.all([
      Transaccion.find()
        .populate('pedidoId', 'estado total')
        .skip(skip)
        .limit(limit)
        .sort({ fechaPago: -1 }),
      Transaccion.countDocuments(),
    ]);

    res.json({ success: true, total, page, data: transacciones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransaccionById = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id)
      .populate({ path: 'pedidoId', populate: { path: 'clienteId', select: 'nombre email' } });
    if (!transaccion) return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
    res.json({ success: true, data: transaccion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/transacciones
 * Registra una transacción de pago asociada a un pedido.
 * Valida que el pedido exista antes de registrar el pago.
 */
export const createTransaccion = async (req, res) => {
  try {
    const { pedidoId, monto, metodoPago, detalles } = req.body;

    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });

    const transaccion = await Transaccion.create({ pedidoId, monto, metodoPago, detalles });

    // Actualiza el pedido a "confirmado" si el pago fue exitoso
    if (transaccion.estado === 'completada') {
      await Pedido.findByIdAndUpdate(pedidoId, { estado: 'confirmado' });
    }

    res.status(201).json({ success: true, message: 'Transacción registrada correctamente', data: transaccion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/transacciones/:id
 * Actualiza el estado de una transacción (ej: de pendiente a completada).
 */
export const updateTransaccion = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!transaccion) return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
    res.json({ success: true, message: 'Transacción actualizada correctamente', data: transaccion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/transacciones/:id
 * Marca la transacción como reembolsada en lugar de eliminarla físicamente.
 */
export const deleteTransaccion = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByIdAndUpdate(
      req.params.id,
      { estado: 'reembolsada' },
      { new: true }
    );
    if (!transaccion) return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
    res.json({ success: true, message: 'Transacción reembolsada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
