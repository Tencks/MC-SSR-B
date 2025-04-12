const { Router } = require('express');
const UserController = require('../controllers/Auth/user.controller');
const { verifyToken } = require('../utils/auth.middleware');
const uploadAvatar = require('../utils/uploadAvatar.middleware');

const router = Router();

router.use(verifyToken);

// /api/users
router.get('/', UserController.getUsers);

router.get('/:id', UserController.getUser);

router.post('/', UserController.createUser);

// Agregar ruta para actualizar avatar
router.post('/:id/avatar', uploadAvatar.single('avatar'), UserController.updateAvatar);

router.put('/:id', UserController.editUser);

router.delete('/:id', UserController.deleteUser);

module.exports = router;