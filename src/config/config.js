require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'defaultSecretKey123!@#',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 86400
};