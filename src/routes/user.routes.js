const { Router } = require('express');
const UserController = require('../controllers/user.controller');

const router = Router();

// /api/users
router.get('/', UserController.getUsers);

router.get('/:id', UserController.getUser);

router.post('/', UserController.createUser);

router.put('/:id', UserController.editUser);

router.delete('/:id', UserController.deleteUser);

module.exports = router;