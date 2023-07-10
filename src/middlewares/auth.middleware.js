const logger = require("../services/logger.service")
const jwt = require('../services/jwt.service.js');
const { publicRoutes } = require("../constants/server.constants");
require('dotenv').config()

const AuthMiddleware = (req, res, next) => {
    try {
        if(publicRoutes.includes(req.url)) return next()
        
        const token = req.cookies.access_token
        if (!token) {
            return res.status(401).send({ error: true, status: 401, message: 'Unauthorized' });
        }

        const payload = jwt.verify(token)
        if(payload?.error) {
            return res.status(401).send({ error: true, status: 401, message: payload.message });
        } else {
            if(!payload?.remember) {
                res.cookie('access_token', token, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'none',
                    maxAge: 20 * 60 * 1000
                })
            }
            req.user = payload
            req.role = payload.role
            next()
        }
    } catch (error) {
        logger.error(error.message)
    }
}

module.exports = AuthMiddleware