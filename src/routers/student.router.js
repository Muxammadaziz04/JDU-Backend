const router = require('express').Router()
const StudentController = require('../modules/Student/student.controller.js')
const validationMiddleware = require('../middlewares/validation.middleware.js')
const { studentSchema } = require('../utils/schema.js')

const Controller = new StudentController()

router.get('/students', Controller.getStudents)
router.get('/students/top', Controller.getTopStudents)
router.get('/student/:id', Controller.findById)
router.post('/student', validationMiddleware(studentSchema), Controller.createStudent)
router.put('/student/:id', Controller.updateStudent)
router.delete('/student/:id', Controller.deleteStudent)

module.exports = router