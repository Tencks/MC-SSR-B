const { Router } = require('express');
const subGrupoController = require('../../../controllers/Cruds/Productos/subGrupoProduct.controller');
const { verifyToken } = require('../../../utils/auth.middleware');

const router = Router();

router.use(verifyToken);

router.post('/', subGrupoController.createSubGrupo);
router.get('/', subGrupoController.getSubGrupos);
router.get('/:id', subGrupoController.getSubGrupo);
router.put('/:id', subGrupoController.updateSubGrupo);
router.delete('/:id', subGrupoController.deleteSubGrupo);

router.get('/codigo/:codSubGrupo', subGrupoController.getSubGrupoByCod);
router.get('/grupo/:idGrupo', subGrupoController.getSubGruposByGrupo);

router.post('/associate',  subGrupoController.associateSubgrupoWithGrupo);
router.post('/disassociate', subGrupoController.disassociateSubgrupoFromGrupo);


module.exports = router;