const { Schema, model, version } = require('mongoose');

const EmployeScheme = new Schema({
    name:{type:String, required:true},
    position:{type:String, required:true},
    office:{type:String, required:true},
    salary:{type:Number, required:true},
},{
    // timestamps agregear fecha de creacion y actualizacion al schema en este caso al empleado
    timestamps:true,
    versionKey:false,
});

module.exports = model('Employee', EmployeScheme);