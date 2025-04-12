const { Schema, model } = require('mongoose');

const ParametrosSchema = new Schema({
    name:{ type: String, required: true, trim: true },
    backgroundColor: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    backgroundColor2: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    backgroundColor3: {
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
    backgroundCard2:{
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    backgroundCard3:{
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    textColor: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    textColor2: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    textColor3: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    borderColor: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    borderColor2: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    focusColor: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    btnColor: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    btnColor2: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    btnBackgroundColor: {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
    },
    btnBackgroundColor2: {
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