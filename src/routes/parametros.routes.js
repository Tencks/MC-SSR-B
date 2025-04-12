const { Router } = require('express');
const parametrosController = require('../controllers/Parametros/parametros.controller');

const router = Router();

// /api/parametros
router.get('/', parametrosController.getParametros);

router.get('/:id', parametrosController.getParametro);

router.post('/', parametrosController.createParametro);

router.put('/:id', parametrosController.editParametro);

router.delete('/:id', parametrosController.deleteParametro);

module.exports = router;