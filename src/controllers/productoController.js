import { Producto } from '../models/Producto.js';

// ──────────────────────────────────────────────
// CRUD de Productos
// ──────────────────────────────────────────────

export const getProductos = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    // Filtro opcional por categoría
    const filtro = { activo: true };
    if (req.query.categoria) filtro.categoria = req.query.categoria;

    const [productos, total] = await Promise.all([
      Producto.find(filtro).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Producto.countDocuments(filtro),
    ]);

    res.json({ success: true, total, page, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/productos
 * Crea un nuevo producto. Requiere: nombre, precio, stock, categoria.
 */
export const createProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json({ success: true, message: 'Producto creado correctamente', data: producto });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/productos/:id
 * Actualiza un producto. Permite modificar stock, precio, descripción, etc.
 */
export const updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, message: 'Producto actualizado correctamente', data: producto });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/productos/:id
 * Soft delete: desactiva el producto sin eliminarlo de la base de datos.
 */
export const deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
