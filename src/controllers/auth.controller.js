const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

class AuthController {
    async register(req, res) {
        try {
            const { email, name, password } = req.body;
            
            // Validate required fields
            if (!email || !name || !password) {
                return res.status(400).json({ 
                    message: 'Todos los campos son requeridos' 
                });
            }

            // Check if user exists by email or name
            const userExists = await User.findOne({ 
                $or: [
                    { email: email },
                    { name: name }
                ]
            });

            if (userExists) {
                return res.status(400).json({ 
                    message: userExists.email === email 
                        ? 'El email ya está registrado' 
                        : 'El nombre de usuario ya está registrado'
                });
            }

            // Create new user with default role
            const user = new User({
                ...req.body,
                role: 'user' // Set default role
            });

            await user.save();

            // Generate tokens
            const token = jwt.sign({ id: user._id }, JWT_SECRET, {
                expiresIn: '1h' // 1 hour for access token
            });

            const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
                expiresIn: '7d' // 7 days for refresh token
            });

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                refreshToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ 
                message: 'Error en el registro',
                error: error.message 
            });
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