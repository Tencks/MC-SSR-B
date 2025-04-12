const { Router } = require('express');
const ventaController = require('../../controllers/Otros/venta.controller');
const { verifyToken } = require('../../utils/auth.middleware');

const router = Router();

router.use(verifyToken);

// Rutas básicas de CRUD
router.post('/', ventaController.createVenta);
router.get('/', ventaController.getVentas);
router.get('/:id', ventaController.getVenta);
router.put('/:id', ventaController.updateVenta);
router.delete('/:id', ventaController.deleteVenta);

// Rutas para manejo de estados
router.put('/:id/estado-pago', ventaController.updateEstadoPago);
router.put('/:id/cancelar', ventaController.cancelarVenta);

// Ruta para historial de eliminaciones
router.get('/deletion-history', ventaController.getDeletionHistory);

module.exports = router;