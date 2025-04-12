const { Schema, model } = require('mongoose');

const subgrupoProductSchema = new Schema({
    codSubGrupo: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true, unique:true, trim: true },
    prefijo: { type: String, trim: true },
    bonif: { type: Number, trim: true },
    comision: { type: Number, trim: true },
    editable: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    grupo:{
        type: Schema.Types.ObjectId,
        ref: 'grupoProduct',
        required: true
    }
    }, {
    timestamps: true,
    versionKey: false
});

module.exports = model('subGrupoProduct', subgrupoProductSchema );