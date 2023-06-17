const router = require('express').Router()
const AuthController = require('../modules/Auth/auth.controller.js')

const Controller = new AuthController()

router.post('/auth/login', Controller.login)
router.post('/auth/reset_password', Controller.resetPassword)
router.post('/auth/change_password/', Controller.changePassword)
router.delete('/auth/logout', Controller.logout)

module.exports = router