const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const parametrosRoutes = require('./routes/parametros.routes');
const employedsRoutes = require('./routes/Otros/employeds.routes');
const usersRoutes = require('./routes/Auth/user.routes');
const authRoutes = require('./routes/Auth/auth.routes');
const clienteRoutes = require('./routes/Cruds/Clientes/cliente.routes');
const ventaRoutes = require('./routes/Otros/venta.routes');
const productsRoutes = require('./routes/Cruds/Productos/product.routes');
const grupoProductos = require('./routes/Cruds/Productos/grupoProduct.route');
const subGrupoProductos = require('./routes/Cruds/Productos/subGrupoProduct.route');


const app = express();
const path = require('path');

//Enviroment Variables
app.set('port', process.env.PORT || 3000)

app.use(cors());
// Configuración CORS más específica
// app.use(cors({
//     origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));

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
app.use("/api/products", productsRoutes);
app.use("/api/produdctos/grupos", grupoProductos);
app.use("/api/prodcuctos/subgrupos", subGrupoProductos);
app.use("/api/clientes", clienteRoutes );
app.use("/api/ventas", ventaRoutes );




// Add a test route to verify the server is working
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to MagicEXE API' });
});

// Add error handling middleware
app.use((req, res, next) => {
    res.status(404).json({
        message: `Route ${req.url} Not found`,
        status: 404
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: err.message
    });
});



module.exports = app;