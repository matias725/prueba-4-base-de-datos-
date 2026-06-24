import mongoose from 'mongoose';

/**
 * Modelo Pedido — registra pedidos de clientes.
 * Contiene arreglo de subdocumentos con los productos incluidos en cada pedido.
 */

// Subdocumento embebido: cada ítem del pedido con su cantidad y precio al momento de compra
const itemPedidoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El producto es obligatorio'],
    },
    nombre: { type: String, required: true },   // snapshot del nombre al momento de compra
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
    },
    precioUnitario: {
      type: Number,
      required: [true, 'El precio unitario es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    subtotal: { type: Number },
  },
  { _id: false }
);

const pedidoSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El cliente es obligatorio'],
    },
    // Arreglo de ítems — cada uno es un subdocumento
    items: {
      type: [itemPedidoSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'El pedido debe tener al menos un producto',
      },
    },
    total: {
      type: Number,
      min: [0, 'El total no puede ser negativo'],
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
      default: 'pendiente',
    },
    direccionEntrega: {
      calle: String,
      ciudad: String,
      region: String,
    },
    notas: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Calcula el subtotal de cada ítem y el total del pedido antes de guardar
pedidoSchema.pre('save', function (next) {
  this.items.forEach((item) => {
    item.subtotal = item.cantidad * item.precioUnitario;
  });
  this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  next();
});

export const Pedido = mongoose.model('Pedido', pedidoSchema);
