const sha256 = require('sha256');
const ExpressError = require('../../errors/express.error.js');
const jwt = require('../../services/jwt.service.js')
const logger = require("../../services/logger.service");
const AuthService = require("./auth.service");

class AuthController {
    async login(req, res) {
        try {
            const { loginId, password } = req.body
            const user = await AuthService.login({ loginId, password: sha256(password) })

            if (!user || user?.error) {
                res.status(409).send(new ExpressError('Incorrect email or password', 409))
            } else {
                const token = jwt.sign(JSON.stringify(user))
                res
                    .status(200)
                    .cookie('access_token', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' })
                    .send({ user, success: true })
            }
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = AuthController