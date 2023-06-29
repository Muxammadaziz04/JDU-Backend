const router = require('express').Router()
const TeacherController = require('../modules/Teacher/teacher.controller.js')

const Controller = new TeacherController()

router.get('/teachers', Controller.getAll)
router.post('/teacher', Controller.create)

module.exports = router