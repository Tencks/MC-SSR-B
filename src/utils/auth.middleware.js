const jwt = require('jsonwebtoken');
const User = require('../models/Auth/user');
const { JWT_SECRET } = require('../config/config');


// Objeto para almacenar los intentos por IP
const failedAttempts = new Map();
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 2 * 60 * 1000; // 2 minutos en milisegundos


const verifyToken = async (req, res, next) => {
    const clientIP = req.ip;
    const attempt = failedAttempts.get(clientIP) || { count: 0, timestamp: Date.now() };

    // Verificar si el cliente está bloqueado
    if (attempt.count >= MAX_ATTEMPTS) {
        const timeElapsed = Date.now() - attempt.timestamp;
        if (timeElapsed < BLOCK_DURATION) {
            return res.status(429).json({ 
                message: 'Demasiados intentos fallidos. Por favor, intente más tarde.',
                remainingTime: Math.ceil((BLOCK_DURATION - timeElapsed) / 1000 / 60) + ' minutos'
            });
        } else {
            // Resetear intentos después del tiempo de bloqueo
            failedAttempts.delete(clientIP);
        }
    }
    // const token = req.headers['x-access-token'] || req.headers['authorization'];
    const token = req.headers['x-access-token']?.split(' ')[1] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        // Incrementar contador de intentos fallidos
        attempt.count++;
        attempt.timestamp = Date.now();
        failedAttempts.set(clientIP, attempt);

        return res.status(403).json({ 
            message: 'No se recibe el token de autenticación',
            attemptsLeft: MAX_ATTEMPTS - attempt.count
        });
    }


    try {

        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        const user = await User.findById(decoded.id);        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        req.userId = decoded.id;
        // Resetear intentos en caso de éxito
        failedAttempts.delete(clientIP);
        next();
    } catch (error) {
        // Incrementar contador de intentos fallidos
        attempt.count++;
        attempt.timestamp = Date.now();
        failedAttempts.set(clientIP, attempt);

        return res.status(401).json({ message: 'NO-AUTORIZADO', attemptsLeft: MAX_ATTEMPTS - attempt.count
        });
    }
};

module.exports = { verifyToken };