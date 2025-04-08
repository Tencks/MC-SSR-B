const { Schema, model } = require('mongoose');

const ClienteSchema = new Schema({
    codCliente: { type: String, required: true, unique: true },
    fantasia: { type: String, trim: true },
    nombre: { type: String, required: true, trim: true },
    grupo: { type: String, default: 'NO ESPECIFICA', trim: true },
    subgrupo: { type: String, trim: true },
    direccion: {
        calle: { type: String, trim: true },
        numero: { type: String, trim: true },
        piso: { type: String, trim: true },
        departamento: { type: String, trim: true },
        localidad: { type: String, trim: true },
        provincia: { type: String, trim: true },
        pais: { type: String, trim: true }
    },
    telefonos: {
        principal: { type: String, trim: true },
        otros: { type: String, trim: true },
        celular: { type: String, trim: true }
    },
    sitioWeb: { type: String, trim: true },
    email: { type: String, trim: true },
    documentacion: {
        tipoDocumento: { type: String, enum: ['DNI', 'CUIT', 'CUIL', 'Pasaporte'] },
        numeroDocumento: { type: String, required: true },
        cuit: { type: String, trim: true },
        vto: { type: Date }
    },
    comercial: {
        categoriaIIBB: { type: String, trim: true },
        vendedor: { type: String, trim: true },
        descuento1: { type: Number, default: 0 },
        descuento2: { type: Number, default: 0 },
        ctaContable: { type: String, trim: true },
        zona: { type: String, trim: true },
        recargo: { type: String, trim: true },
        transporte: { type: String, trim: true },
        lugarEntrega: { type: String, trim: true },
        listaPrecio: { type: String, trim: true },
        condicionPago: { type: String, trim: true },
        limiteCredito: { type: Number, default: 0 }
    },
    fiscal: {
        condicionIVA: { type: String, enum: ['Responsable Inscripto', 'Consumidor Final', 'Monotributista', 'Exento'], default: 'Consumidor Final' },
        exentoIVA: { type: Boolean, default: false },
        percepIVA: { type: String, trim: true },
        agenteRetencion: { type: Boolean, default: false },
        revendedor: { type: Boolean, default: false }
    },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    versionKey: false
});

// Generar código automático antes de guardar
ClienteSchema.pre('save', async function(next) {
    if (!this.codCliente) {
        const count = await this.constructor.countDocuments();
        this.codCliente = `CLI${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

module.exports = model('Cliente', ClienteSchema);