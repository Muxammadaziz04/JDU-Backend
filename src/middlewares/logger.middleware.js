const logger = require("../services/logger.service")

const LoggerMiddleware = (req, res, next) => {
    try {
        const fullName = `${req?.user?.firstName || ''} ${req?.user?.lastName || ''}`
        logger.info(`${fullName.trim() ? `${fullName} - ` : ''}${req.url}`)
        next()
    } catch (error) {
        
    }
}

module.exports = LoggerMiddleware