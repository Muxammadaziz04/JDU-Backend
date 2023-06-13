const sha256 = require('sha256')
const jwt = require('../../services/jwt.service.js')
const logger = require("../../services/logger.service");
const AuthService = require("./auth.service");

class AuthController {
    async login(req, res) {
        try {
            const body = req.body
            const user = await AuthService.login({ loginId: body.loginId, password: sha256(body.password) })
            res.status(200).send({
                user,
                token: jwt.sign(JSON.stringify(user))
            })
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = AuthController