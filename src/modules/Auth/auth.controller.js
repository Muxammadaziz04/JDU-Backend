const sha256 = require('sha256');
const crypto = require('crypto')
const ExpressError = require('../../errors/express.error.js');
const jwt = require('../../services/jwt.service.js')
const logger = require("../../services/logger.service");
const AuthService = require("./auth.service");
const sendEmail = require('../../services/email.service.js');
const { resetPasswordTemplate } = require('../../configs/email.config.js');

class AuthController {
    async login(req, res) {
        try {
            const { loginId, password, remember } = req.body
            const user = await AuthService.login({ loginId, password: sha256(password) })
            
            if (!user || user?.error) {
                res.status(409).send(new ExpressError('Incorrect id or password', 409))
            } else {
                const token = jwt.sign(JSON.stringify({...user?.dataValues, remember}))
                res
                    .status(200)
                    .cookie('access_token', token, { 
                        httpOnly: true, 
                        secure: process.env.NODE_ENV === 'production', 
                        sameSite: 'none',
                        ...(!remember && {maxAge: 20 * 60 * 1000})
                    })
                    .send({ user, success: true })
            }
        } catch (error) {
            logger.error(error.message)
        }
    }

    async logout(req, res) {
        try {
            res.cookie('access_token', null, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "none" })
            res.status(203).send('Successful logout')
        } catch (error) {
            logger.error(error.message)
        }
    }

    async resetPassword(req, res) {
        try {
            let user = await AuthService.getUserByEmail(req.body.email)
            if (!user) return res.status(400).send(new ExpressError('user with given email doesn\'t exist', 400))
            user = JSON.parse(JSON.stringify(user))

            let token = await AuthService.getTokenByUserId(user?.id)
            if (!token) {
                token = await AuthService.createToken({
                    userId: user?.id,
                    token: crypto.randomBytes(32).toString("hex"),
                })
            }
            token = JSON.parse(JSON.stringify(token))

            const link = `${process.env.CLIENT_URL}/password-reset?token=${token.token}&id=${user?.id}`
            await sendEmail({ to: req.body.email, subject: 'Reset password', html: resetPasswordTemplate(link) })
            res.status(200).send({
                success: true,
                message: 'We emailed you a link to reset your password'
            })
        } catch (error) {
            logger.error(error.message)
        }
    }

    async changePassword(req, res) {
        try {
            let token = await AuthService.getTokenByUserId(req.body.userId)
            if (!token || JSON.parse(JSON.stringify(token)).token !== req.body.token) {
                return res.status(400).send(new ExpressError('Invalid link or expired', 400));
            }

            const user = await AuthService.changePassword(req.body.userId, sha256(req.body.password))
            if (user) {
                await AuthService.deleteToken(req.body.userId)
            }
            res.status(203).send({
                success: true,
                message: 'password successful changet'
            })
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getMe(req, res) {
        try {
            const user = await AuthService.getById(req.user.id)
            if (!user) {
                req.status(400).send(new ExpressError('user not found', 400))
            } else {
                res.status(200).send(user)
            }
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = AuthController