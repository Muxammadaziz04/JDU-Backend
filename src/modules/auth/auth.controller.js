const logger = require("../../services/logger.service");
const AuthService = require("./auth.service");

class AuthController {
    async login(req, res) {
        try {
            const user = await AuthService.login(req.body)
            res.status(200).send(user)
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = AuthController