import mongoose from 'mongoose';

/**
 * Modelo Cliente — almacena información de clientes de ComercioTech.
 * Incluye subdocumento de dirección y validación de esquema.
 */
const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido'],
    },
    telefono: {
      type: String,
      trim: true,
      match: [/^[\d\s\+\-\(\)]{7,20}$/, 'Formato de teléfono inválido'],
    },
    // Subdocumento embebido: dirección completa del cliente
    direccion: {
      calle: { type: String, trim: true },
      ciudad: { type: String, trim: true },
      region: { type: String, trim: true },
      codigoPostal: { type: String, trim: true },
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
    versionKey: false,
  }
);

export const Cliente = mongoose.model('Cliente', clienteSchema);
