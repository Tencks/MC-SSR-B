const { Router } = require('express');
const router = Router();

const employedsCtr = require('../controllers/Otros/employed.controller');

// /api/employes
router.get('/',  employedsCtr.getEmployes);

router.post('/',  employedsCtr.createEmploye);

router.get('/:id',  employedsCtr.getEmploye);

router.put('/:id',  employedsCtr.editEmploye);

router.delete('/:id',  employedsCtr.deleteEmploye);




module.exports = router;