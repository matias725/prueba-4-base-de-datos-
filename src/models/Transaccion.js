import mongoose from 'mongoose';

/**
 * Modelo Transaccion — historial de pagos asociados a pedidos.
 * Cada transacción referencia un pedido y registra el método y estado del pago.
 */
const transaccionSchema = new mongoose.Schema(
  {
    pedidoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pedido',
      required: [true, 'El pedido es obligatorio'],
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
    },
    metodoPago: {
      type: String,
      required: [true, 'El método de pago es obligatorio'],
      enum: ['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo', 'webpay'],
    },
    estado: {
      type: String,
      enum: ['pendiente', 'completada', 'fallida', 'reembolsada'],
      default: 'pendiente',
    },
    // Subdocumento con detalles adicionales de la transacción
    detalles: {
      codigoAutorizacion: { type: String, trim: true },
      entidadBancaria: { type: String, trim: true },
      ultimos4Digitos: { type: String, maxlength: 4 },
    },
    fechaPago: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaccion = mongoose.model('Transaccion', transaccionSchema);
