const { Router } = require('express');
const clienteController = require('../controllers/cliente.controller');
const { verifyToken } = require('../utils/auth.middleware');

const router = Router();

// Proteger todas las rutas con autenticación
// router.use(verifyToken);

// Rutas CRUD básicas
router.post('/', clienteController.createCliente);
// // Modificar esta ruta para manejar tanto listado como búsqueda
router.get('/', clienteController.getClientes);
// router.get('/', clienteController.searchClientes); // Nueva función para búsqueda
router.get('/:id', clienteController.getCliente);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

// router.get('/codigo/:codCliente', clienteController.getClienteByCod);
router.get('/codigo/:codCliente', clienteController.getClientesByCodCliente);


module.exports = router;


// Ejemplos de llamadas a la misma ruta GET con diferentes filtros:

// Obtener todos los clientes
// GET /api/clientes

// Filtrar por tipo de IVA
// GET /api/clientes?ivaType=Responsable%20Inscripto

// Búsqueda por término
// GET /api/clientes?search=Juan

// Filtros combinados
// GET /api/clientes?ivaType=Consumidor%20Final&documentType=DNI&page=2&limit=20

// Ordenamiento
// GET /api/clientes?sortBy=name&order=asc

// Paginación
// GET /api/clientes?page=1&limit=10