const { Router } = require('express');
const grupoController = require('../../../controllers/Cruds/Productos/grupoProduct.controller');
const { verifyToken } = require('../../../utils/auth.middleware');

const router = Router();

router.use(verifyToken);

router.post('/', grupoController.createGrupo);
router.get('/', grupoController.getGrupos);
router.get('/:id', grupoController.getGrupo);
router.put('/:id', grupoController.updateGrupo);
router.delete('/:id', grupoController.deleteGrupo);

router.get('/codigo/:codGrupo', grupoController.getGrupoByCod);


module.exports = router;