const router = require('express').Router()
const { roles } = require('../constants/server.constants')
const chechPermissionMiddleware = require('../middlewares/checkPermission.middleware')
const validationMiddleware = require('../middlewares/validation.middleware')
const RecruitorController = require('../modules/Recruitors/recruitor.controller')
const { recruitorSchema } = require('../utils/schema')
const Controller = new RecruitorController()

router.get('/recruitors', Controller.getAll)
router.get('/recruitor/:id', Controller.getById)
router.get('/recruitor/selected_students', Controller.getSelectedStudents)
router.post('/recruitor', validationMiddleware(recruitorSchema), Controller.create)
router.post('/recruitor/select_student/:id', Controller.selectStudent)
router.put('/recruitor/:id', Controller.update)
router.delete('/recruitor/:id', Controller.deleteRecruitor)
router.delete('/recruitor/remove_student/:id', Controller.removeSelectedStudent)

module.exports = router