const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    codProducto: { type: String, required: true, unique: true },
    codBarra: { type: String },
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    imagen: { type: String },
    precio: { type: Number, required: true },
    porcentajeGanancia: { type: Number, default: 0 },
    alicuotaIva: { 
        type: String, 
        enum: ['0%', '10.5%', '21%'],
        default: '21%',
        
    },
    precioConIva: { type: Number },
    unidadMedida: {
        type: String,
        enum: ['LT', 'KG', 'K', 'MT', 'BOLSAS', 'FRASCO', 'ML', 'TN', 'UNIDAD', 'OTRO'],
        // required: true,
        default: 'UNIDAD'
    },
    grupo: { 
        type: Schema.Types.ObjectId,
        ref:'grupoProduct',
        required: true
    },
    subgrupo: { 
        type: Schema.Types.ObjectId,
        ref:'subGrupoProduct',
     },
    stockActual: { type: Number, default: 0 },
    stockMinimo: { type: Number, default: 5 },
    stockMaximo: { type: Number },
    categoria: { type: String },
    marca: { type: String, default: 'NO ESPECIFICADO'  },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
    modelo: { type: String },
    viaCompra: { 
        type: String,
        enum: ['De Ventas y Compras', 'Compra Externa'],
        default: 'De Ventas y Compras'
    },
    tipoCompra: {
        type: String,
        enum: ['Compra Externa', 'Compra Interna'],
        default: 'Compra Externa'
    },
    facturaPor: {
        type: String,
        enum: ['Unidad','Kilos'],
        default: 'Unidad'
    },
    peso: { type: Number, default: 0 },
    unidadBulto: { type: Number, default: 1 },
    conversion: { type: Number, default: 1 },
    cliente: { type: Schema.Types.ObjectId, ref: 'Client' },
    ctaContableVta: { type: String },
    ctaContableCpa: { type: String },
    especificacionesTecnicas: {
        nomenclador: { type: String },
        especificacionIngenieria: { type: String },
        numerador: { type: String }
    },
    serializado: { type: Boolean, default: false },
    requiereAutorizacion: { type: Boolean, default: false },
    editable: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false
});

// Generar código de producto automático
ProductSchema.pre('save', async function(next) {
    if (!this.codProducto) {
        const count = await this.constructor.countDocuments();
        this.codProducto = `PROD-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Calcular precio con IVA y ganancia antes de guardar
ProductSchema.pre('save', function(next) {
    let precioBase = this.precio;
    
    // Aplicar porcentaje de ganancia si existe
    if (this.porcentajeGanancia > 0) {
        precioBase += (precioBase * (this.porcentajeGanancia / 100));
    }

    // Aplicar IVA según alícuota
    const ivaRate = parseFloat(this.alicuotaIva) / 100;
    this.precioConIva = precioBase + (precioBase * ivaRate);

    next();
});

module.exports = model('Product', ProductSchema);