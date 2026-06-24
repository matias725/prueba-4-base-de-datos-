import mongoose from 'mongoose';

/**
 * Modelo Producto — catálogo de productos de ComercioTech.
 * Incluye arreglo de etiquetas y subdocumento de especificaciones técnicas.
 */
const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxlength: [150, 'El nombre no puede superar 150 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [1000, 'La descripción no puede superar 1000 caracteres'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: ['electronica', 'ropa', 'hogar', 'alimentos', 'deportes', 'otros'],
    },
    imagen: {
      type: String,
      trim: true,
    },
    // Arreglo de etiquetas para búsqueda y filtrado
    etiquetas: [{ type: String, trim: true }],
    // Subdocumento para especificaciones adicionales del producto
    especificaciones: {
      peso: { type: Number },       // en kg
      dimensiones: { type: String },
      garantiaMeses: { type: Number },
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Producto = mongoose.model('Producto', productoSchema);
