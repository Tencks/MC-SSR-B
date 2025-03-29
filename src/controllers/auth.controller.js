const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/auth.middleware');

class AuthController {
    async register(req, res) {
        try {
            const { email } = req.body;
            
            // Verificar si el usuario ya existe
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }

            // Crear nuevo usuario
            const user = new User(req.body);
            await user.save();

            // Generar token
            const token = jwt.sign({ id: user._id }, JWT_SECRET, {
                expiresIn: 86400 // 24 horas
            });

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el registro', error });
        }
    }

    async login(req, res) {
        try {
            const { email, name, password } = req.body;

            // Buscar usuario por email o nombre
            const user = await User.findOne({
                $or: [
                    { email: email || '' },
                    { name: name || '' }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Generar access token (corta duración)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '1h' // 1 hora
        });

        // Generar refresh token (larga duración)
        const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '7d' // 7 días
        });

            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el login', error });
        }
    }

    // Agregar nuevo método para renovar token
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token no proporcionado' });
            }

            const decoded = jwt.verify(refreshToken, JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Generar nuevo access token
            const newToken = jwt.sign({ id: user._id }, JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({
                token: newToken
            });
        } catch (error) {
            res.status(401).json({ message: 'Refresh token inválido o expirado' });
        }
    }
}

module.exports = new AuthController();