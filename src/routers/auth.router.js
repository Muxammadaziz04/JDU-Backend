const router = require('express').Router()
const AuthController = require('../modules/auth/auth.controller')

const Controller = new AuthController()

router.post('/auth/login', Controller.login)

module.exports = router