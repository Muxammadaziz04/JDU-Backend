
const validationMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body)
            if (error) {
                res.status(400).send({ error: true, status: 400, message: error?.details?.[0].message })
                return
            } else {
                next()
            }
        } catch (error) {

        }
    }
}

module.exports = validationMiddleware