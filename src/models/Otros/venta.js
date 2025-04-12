const { Schema, model } = require('mongoose');

const VentaItemSchema = new Schema({
    producto: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    cod_producto: { type: String, required: true },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true },
    descuento: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    alicuotaIva: { type: String, enum: ['0%', '10.5%', '21%'], required: true  },
});

const VentaSchema = new Schema({
    puntoVenta: { type: String, default: '00001' },
    numeroVenta: { type: String, required: true, unique: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    items: [VentaItemSchema],
    subtotal: { type: Number, required: true },
    iva: { type: Number, required: true },
    descuentoTotal: { type: Number, default: 0 },
    total: { type: Number, required: true },
    metodoPago: { 
        type: String, 
        enum: ['efectivo', 'cuenta corriente'],
        default: 'efectivo',
        required: true 
    },
    estadoPago: {
        type: String,
        enum: ['pendiente', 'pagado', 'parcial', 'cancelado'],
        default: 'pendiente'
    },
    vendedor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    estado: {
        type: String,
        enum: ['borrador', 'completada', 'cancelada'],
        default: 'borrador'
    },
    observaciones: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

// Generar número de venta automático
VentaSchema.pre('save', async function(next) {
    if (!this.numeroVenta) {
        const count = await this.constructor.countDocuments();
        const numeroSecuencial = String(count + 1).padStart(8, '0');
        this.numeroVenta = `${this.puntoVenta}-${numeroSecuencial}`;
    }
    next();
});

module.exports = model('Venta', VentaSchema);