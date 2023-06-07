const router = require('express').Router()
const StudentController = require('../modules/Student/student.controller.js')
const validationMiddleware = require('../middlewares/validation.middleware.js')
const { studentSchema } = require('../utils/schema.js')

const Controller = new StudentController()

router.get('/students', Controller.getStudents)
router.post('/student', validationMiddleware(studentSchema), Controller.createStudent)
router.put('/student/:id', Controller.updateStudent)

module.exports = router