const { Schema, model } = require('mongoose');

const ClienteSchema = new Schema({
    cod_cliente: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    name_fantasy: { type: String, trim: true },
    email: { type: String, unique: true, trim: true },
    phone: { type: String, trim: true },
    address: {
        street: { type: String, trim: true },
        number: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true }
    },
    documentType: { type: String, enum: ['DNI', 'CUIT', 'CUIL'], required: true },
    documentNumber: { type: String, required: true, unique: true },
    ivaType: { 
        type: String, 
        enum: ['Responsable Inscripto', 'Consumidor Final', 'Excento'],
        default: 'Consumidor Final'
    },
    active: { type: Boolean, default: true },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    versionKey: false
});

// Generate automatic cod_cliente before saving
ClienteSchema.pre('save', async function(next) {
    if (!this.cod_cliente) {
        const count = await this.constructor.countDocuments();
        this.cod_cliente = `CLI - ${String(count + 1).padStart(6, '0')}`;
    }
    // Set name_fantasy equal to name if not provided
    if (!this.name_fantasy) {
        this.name_fantasy = this.name;
    }
    next();
});

module.exports = model('Cliente', ClienteSchema);