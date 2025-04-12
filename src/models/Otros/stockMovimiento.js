const { Schema, model } = require('mongoose');

const StockMovimientoSchema = new Schema({
    producto: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    tipoMovimiento: { 
        type: String, 
        enum: ['entrada', 'salida', 'ajuste', 'venta', 'devolucion'],
        required: true 
    },
    cantidad: { type: Number, required: true },
    stockAnterior: { type: Number, required: true },
    stockNuevo: { type: Number, required: true },
    documento: {
        tipo: { type: String, enum: ['venta', 'compra', 'ajuste'] },
        numero: { type: String },
        id: { type: Schema.Types.ObjectId }
    },
    observaciones: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    versionKey: false
});