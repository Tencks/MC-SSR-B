const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const parametrosRoutes = require('./routes/parametros.routes');
const employedsRoutes = require('./routes/employeds.routes');
const usersRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const ventaRoutes = require('./routes/venta.routes');
const productsRoutes = require('./routes/product.routes');


const app = express();
const path = require('path');

//Enviroment Variables
app.set('port', process.env.PORT || 3000)

app.use(cors());
app.use(morgan('dev'));
//permite recibir datos en formato json
app.use(express.json());
//permite recibir datos desde un formulario correctamente
app.use(express.urlencoded({extended:false}));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes ENDPOINTS
app.use("/api/auth", authRoutes );
app.use("/api/parametros", parametrosRoutes);
app.use("/api/employes", employedsRoutes);
app.use("/api/users", usersRoutes );
app.use("/api/products", productsRoutes)
app.use("/api/clientes", clienteRoutes );
app.use("/api/ventas", ventaRoutes );


module.exports = app;