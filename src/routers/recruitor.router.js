const router = require('express').Router()
const validationMiddleware = require('../middlewares/validation.middleware')
const RecruitorController = require('../modules/Recruitors/recruitor.controller')
const { recruitorSchema } = require('../utils/schema')
const Controller = new RecruitorController()

router.get('/recruitors', Controller.getAll)
router.post('/recruitor', validationMiddleware(recruitorSchema), Controller.create)
router.put('/recruitor/:id', Controller.update)

module.exports = router