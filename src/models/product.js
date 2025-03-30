const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    cod_producto: { type: String, required: true, unique: true },
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    imagen: { type: String },
    precio: { type: Number, required: true },
    porcentajeGanancia: { type: Number, default: 0 },
    alicuotaIva: { 
        type: String, 
        enum: ['0%', '10.5%', '21%'],
        default: '21%',
        required: true 
    },
    precioConIva: { type: Number },
    unidadMedida: {
        type: String,
        enum: ['LT', 'KG', 'K', 'MT', 'BOLSAS', 'FRASCO', 'ML', 'TN', 'UNIDAD', 'OTRO'],
        required: true
    },
    grupo: { type: String, required: true },
    subgrupo: { type: String, required: true },
    stock: { type: Number, default: 0 },
    stockMinimo: { type: Number, default: 5 },
    categoria: { type: String, required: true },
    marca: { type: String, required: true },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    versionKey: false
});

// Generar código de producto automático
ProductSchema.pre('save', async function(next) {
    if (!this.cod_producto) {
        const count = await this.constructor.countDocuments();
        this.cod_producto = `PROD-${String(count + 1).padStart(6, '0')}`;
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