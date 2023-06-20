const logger = require("../services/logger.service")

const SequelizeError = (err) => {
    if (Array.isArray(err?.errors)) {
        err.errors.forEach(err => logger.error(err.message))
        return { error: true, status: 400, message: err?.errors?.[0]?.message }
    } else {
        logger.error(err.message)
        return { error: true, status: 400, message: err.message }
    }
}

module.exports = SequelizeError