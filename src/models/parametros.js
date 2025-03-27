const { Schema, model } = require('mongoose');

const ParametrosSchema = new Schema({
    name:{ type: String, required: true, trim: true },
    backgroundColor: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    textColor: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    backgroundNavbar: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    backgroundCard:{
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    language: {
        name: { type: String, required: true, trim: true },
        code: { type: String, required: true, trim: true }
    },
    dark_mode: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('Parametros', ParametrosSchema);