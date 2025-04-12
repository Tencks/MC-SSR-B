const { Router } = require('express');
const subGrupoController = require('../../../controllers/Cruds/Productos/subGrupoProduct.controller');
const { verifyToken } = require('../../../utils/auth.middleware');

const router = Router();

// router.use(verifyToken);

router.post('/', subGrupoController.createSubGrupo);
router.get('/', subGrupoController.getSubGrupos);
// router.get('/:id', subGrupoController.getGrupo);
router.put('/:id', subGrupoController.updateSubGrupo);
router.delete('/:id', subGrupoController.deleteSubGrupo);

router.get('/codigo/:codSubGrupo', subGrupoController.getSubGrupoByCod);


module.exports = router;