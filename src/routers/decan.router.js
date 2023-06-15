const router = require('express').Router()
const DecanController = require('../modules/Decan/decan.controller.js')
const Controller = new DecanController()

router.put('/decan/:id', Controller.update)

module.exports = Controller