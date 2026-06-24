import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Modelo Usuario — acceso a la aplicación con roles diferenciados.
 * Las contraseñas se almacenan hasheadas con bcrypt, nunca en texto plano.
 */
const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // no se retorna en queries por defecto
    },
    rol: {
      type: String,
      enum: ['admin', 'operador', 'lector', 'usuario'],
      default: 'usuario',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hashea la contraseña antes de guardar si fue modificada
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compara contraseña ingresada con el hash almacenado
usuarioSchema.methods.compararPassword = async function (candidato) {
  return bcrypt.compare(candidato, this.password);
};

export const Usuario = mongoose.model('Usuario', usuarioSchema);
