
const employedCtr= {}

const Employee = require('../models/Employed');


employedCtr.createEmploye = async (req, res) => {
    //aca agregamos los campos del body a newEmployee
    const newEmployee = new Employee(req.body)
    //aca guardamos el nuevo empleado con esos datos
    await newEmployee.save()
    res.send({message: `Empleado ${req.body.name} creado correctamente`})
};
employedCtr.getEmploye = async (req, res) => {
    console.log(req.params);
    //Un método es findOne() que devuelve un documento que cumple con los criterios de búsqueda especificados.
    //Employee.findOne({_id: req.params.id})
    
    //esté otro método findById() que devuelve un documento que tenga el mismo _id que el valor especificado.
    const employee = await Employee.findById(req.params.id);

    res.send(employee);
};
employedCtr.editEmploye = async (req, res) => {
     await Employee.findByIdAndUpdate(req.params.id, req.body );
    res.json({message:`Hemos actualizado el empleado `});
};
employedCtr.deleteEmploye =  async (req, res) => {
    const employeeDeleed = await Employee.findByIdAndDelete(req.params.id);
    res.json({message: 'Empleado eliminado', employeeDeleed})
};
employedCtr.getEmployes = async (req, res) => {
    const employes = await Employee.find()
    res.json(employes);
};




module.exports = employedCtr