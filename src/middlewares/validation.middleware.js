const ExpressError = require("../errors/express.error")

const validationMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body)
            if (error) {
                res.status(400).send(new ExpressError(error?.details?.[0].message, 400))
                return
            } else {
                next()
            }
        } catch (error) {

        }
    }
}

module.exports = validationMiddleware