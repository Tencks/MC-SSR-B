const { Router } = require('express');
const authController = require('../controllers/Auth/auth.controller');


const router = Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

module.exports = router;


