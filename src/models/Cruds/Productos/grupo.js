const { Schema, model } = require('mongoose');

const grupoProductSchema = new Schema({
    codGrupo: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true, unique:true, trim: true },
    prefijo: { type: String, trim: true },
    bonif: { type: Number, trim: true },
    comision: { type: Number, trim: true },
    editable: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    }, 
    {
    timestamps: true,
    versionKey: false
});

module.exports = model('grupoProduct', grupoProductSchema );