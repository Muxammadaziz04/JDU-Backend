const DecanServices = require('./decan.service.js')
const logger = require("../../services/logger.service");
const ExpressError = require('../../errors/express.error');

class DecanController {
    async update(req, res) {
        try {
            const body = req.body
            if (body.password && !body.currentPassword) {
                res.status(409).send(new ExpressError('current password is required', 409))
                return
            } else if (body.password && body.confirmPassword === body.password) {
                const decan = await DecanServices.checkPassword(body.currentPassword)
                if (!decan || decan.error) {
                    res.status(409).send(new ExpressError('current password is not correct', 409))
                    return
                }
            } else if (body.password && body.confirmPassword !== body.password) {
                res.status(409).send(new ExpressError('confirm password is not correct', 409))
                return
            }

            const decan = await DecanServices.update(req.params?.id, body)
            res.status(203).send(decan)
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = DecanController