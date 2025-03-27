const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const parametrosRoutes = require('./routes/parametros.routes');
const employedsRoutes = require('./routes/employeds.routes');

const app = express();

//Enviroment Variables
app.set('port', process.env.PORT || 3000)

app.use(cors());
app.use(morgan('dev'));
//permite recibir datos en formato json
app.use(express.json());
//permite recibir datos desde un formulario correctamente
app.use(express.urlencoded({extended:false}));

//Routes ENDPOINTS
app.use("/api/parametros", parametrosRoutes);
app.use("/api/employes", employedsRoutes);

module.exports = app;