const logger = require("../services/logger.service")

const AuthMiddleware = (req, res, next) =>{
    try {
        const token = req.cookies.access_token
        
    } catch (error) {
        logger.error(error.message)
    }
}