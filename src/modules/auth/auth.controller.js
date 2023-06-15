const sha256 = require('sha256')
const jwt = require('../../services/jwt.service.js')
const logger = require("../../services/logger.service");
const AuthService = require("./auth.service");

class AuthController {
    async login(req, res) {
        try {
            const { loginId, password } = req.body
            const user = await AuthService.login({ loginId, password: sha256(password) })

            if (!user || user?.error) {
                res.status(409).send({
                    error: true,
                    status: 409,
                    message: 'Incorrect email or password'
                })
            } else {
                const token = jwt.sign(JSON.stringify(user))
                res
                    .status(200)
                    .cookie('access_token', token, { httpOnly: true })
                    .send({ user, success: true })
            }
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = AuthController