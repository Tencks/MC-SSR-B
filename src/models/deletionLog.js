const { Schema, model } = require('mongoose');

const DeletionLogSchema = new Schema({
    documentType: { type: String, required: true }, // 'venta', 'producto', etc.
    documentId: { type: Schema.Types.ObjectId, required: true },
    documentNumber: { type: String }, // número de venta, código de producto, etc.
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    additionalInfo: { type: Schema.Types.Mixed }, // datos adicionales del documento
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('DeletionLog', DeletionLogSchema);