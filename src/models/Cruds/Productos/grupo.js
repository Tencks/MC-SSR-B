const { Schema, model } = require('mongoose');

const grupoProductSchema = new Schema({
    codGrupo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true, unique:true, trim: true },
    prefijo: { type: String, trim: true },
    bonif: { type: Number, trim: true },
    comision: { type: Number, trim: true },
    editable: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    subgrupos:[{
        type: Schema.Types.ObjectId,
        ref: 'subGrupoProduct',
    }],
    // Agregar la referencia al usuario que lo creó
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Asegúrate de que 'User' sea el nombre correcto de tu modelo de usuario
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Asegúrate de que 'User' sea el nombre correcto de tu modelo de usuario
    }
    }, 
    {
    timestamps: true,
    versionKey: false
});

module.exports = model('grupoProduct', grupoProductSchema );