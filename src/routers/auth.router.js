const router = require('express').Router()
const AuthController = require('../modules/Auth/auth.controller.js')

const Controller = new AuthController()

router.post('/auth/login', Controller.login)

module.exports = router