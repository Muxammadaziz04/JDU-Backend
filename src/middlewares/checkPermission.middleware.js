const ExpressError = require("../errors/express.error")
const logger = require("../services/logger.service")

const chechPermissionMiddleware = (allowedRole) => {
    return (req, res, next) => {
        try {
            if(req.role !== allowedRole) {
                return res.status(403).send(new ExpressError('Access Denied. You don\'t have permission', 403))
            }
            next()
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = chechPermissionMiddleware