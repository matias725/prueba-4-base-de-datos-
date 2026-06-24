import { Pedido } from '../models/Pedido.js';
import { Producto } from '../models/Producto.js';
import { Cliente } from '../models/Cliente.js';

// ──────────────────────────────────────────────
// CRUD de Pedidos
// ──────────────────────────────────────────────

export const getPedidos = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const pedidos = await Pedido.find()
      .populate('clienteId', 'nombre email') // trae solo nombre e email del cliente
      .populate('items.productoId', 'nombre') // trae nombre del producto
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Pedido.countDocuments();
    res.json({ success: true, total, page, data: pedidos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('clienteId', 'nombre email telefono')
      .populate('items.productoId', 'nombre precio');
    if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    res.json({ success: true, data: pedido });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/pedidos
 * Crea un pedido. Valida que el cliente y cada producto existan.
 * Calcula subtotales y total automáticamente (via pre-save hook del modelo).
 */
export const createPedido = async (req, res) => {
  try {
    const { clienteId, items, direccionEntrega, notas } = req.body;

    // Validar que el cliente existe
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });

    // Validar y enriquecer cada ítem con nombre y precio del producto
    const itemsEnriquecidos = await Promise.all(
      items.map(async (item) => {
        const producto = await Producto.findById(item.productoId);
        if (!producto) throw new Error(`Producto ${item.productoId} no encontrado`);
        if (producto.stock < item.cantidad) throw new Error(`Stock insuficiente para "${producto.nombre}"`);
        return {
          productoId: producto._id,
          nombre: producto.nombre,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
        };
      })
    );

    const pedido = await Pedido.create({ clienteId, items: itemsEnriquecidos, direccionEntrega, notas });
    res.status(201).json({ success: true, message: 'Pedido creado correctamente', data: pedido });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/pedidos/:id
 * Actualiza el estado de un pedido. Solo admin/operador pueden modificarlo.
 */
export const updatePedido = async (req, res) => {
  try {
    const { estado, notas, direccionEntrega } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado, notas, direccionEntrega },
      { new: true, runValidators: true }
    );
    if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    res.json({ success: true, message: 'Pedido actualizado correctamente', data: pedido });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/pedidos/:id
 * Cancela un pedido cambiando su estado a "cancelado".
 */
export const deletePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelado' },
      { new: true }
    );
    if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    res.json({ success: true, message: 'Pedido cancelado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
