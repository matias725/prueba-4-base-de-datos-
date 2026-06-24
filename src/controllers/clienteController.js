import { Cliente } from '../models/Cliente.js';

// ──────────────────────────────────────────────
// CRUD de Clientes
// ──────────────────────────────────────────────

/**
 * GET /api/clientes
 * Retorna todos los clientes activos con paginación opcional.
 * Query params: page (default 1), limit (default 20)
 */
export const getClientes = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [clientes, total] = await Promise.all([
      Cliente.find({ activo: true }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Cliente.countDocuments({ activo: true }),
    ]);

    res.json({ success: true, total, page, data: clientes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/clientes/:id
 * Retorna un cliente por su ID.
 */
export const getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, data: cliente });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/clientes
 * Crea un nuevo cliente. Requiere: nombre, email. Opcional: telefono, direccion.
 */
export const createCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json({ success: true, message: 'Cliente creado correctamente', data: cliente });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'El email ya está registrado' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/clientes/:id
 * Actualiza los datos de un cliente existente.
 */
export const updateCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // retorna el documento actualizado
      runValidators: true, // ejecuta validaciones del schema
    });
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, message: 'Cliente actualizado correctamente', data: cliente });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/clientes/:id
 * Desactiva un cliente (soft delete) para preservar historial de pedidos.
 */
export const deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
