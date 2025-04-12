const { Schema, model } = require('mongoose');

const ClienteSchema = new Schema({
    codCliente: { type: String, required: true, unique: true },
    fantasia: { type: String, trim: true },
    nombre: { type: String, required: true, trim: true },
    grupo: { type: String, default: 'NO ESPECIFICA', trim: true },
    subgrupo: { type: String, trim: true },
    direccion: {
        _id: false,
        type: new Schema({
            calle: { type: String, trim: true, default: '' },
            numero: { type: String, trim: true, default: '' },
            piso: { type: String, trim: true, default: '' },
            departamento: { type: String, trim: true, default: '' },
            localidad: { type: String, trim: true, default: '' },
            provincia: { type: String, trim: true, default: '' },
            pais: { type: String, trim: true, default: '' }
        })
    },
    telefonos: {
        _id: false,
        type: new Schema({
            principal: { type: String, trim: true, default: '' },
            otros: { type: String, trim: true, default: '' },
            celular: { type: String, trim: true, default: '' }
        })
    },
    sitioWeb: { type: String, trim: true },
    email: { type: String, trim: true },
    documentacion: {
        _id: false,
        type: new Schema({
            tipoDocumento: { type: String, enum: ['DNI', 'CUIT', 'CUIL', 'Pasaporte'], default: 'DNI' },
            numeroDocumento: { type: String, required: true },
            cuit: { type: String, trim: true, default: '' },
            vto: { type: Date }
        })
    },
    comercial: {
        _id: false,
        type: new Schema({
            categoriaIIBB: { type: String, trim: true, default: '' },
            vendedor: { type: String, trim: true, default: '' },
            descuento1: { type: Number, default: 0 },
            descuento2: { type: Number, default: 0 },
            ctaContable: { type: String, trim: true, default: '' },
            zona: { type: String, trim: true, default: '' },
            recargo: { type: String, trim: true, default: '' },
            transporte: { type: String, trim: true, default: '' },
            lugarEntrega: { type: String, trim: true, default: '' },
            listaPrecio: { type: String, trim: true, default: '' },
            condicionPago: { type: String, trim: true, default: '' },
            limiteCredito: { type: Number, default: 0 }
        })
    },
    fiscal: {
        _id: false,
        type: new Schema({
            condicionIVA: { type: String, enum: ['Responsable Inscripto', 'Consumidor Final', 'Monotributista', 'Exento'], default: 'Consumidor Final' },
            exentoIVA: { type: Boolean, default: false },
            percepIVA: { type: String, trim: true, default: '' },
            agenteRetencion: { type: Boolean, default: false },
            revendedor: { type: Boolean, default: false }
        })
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