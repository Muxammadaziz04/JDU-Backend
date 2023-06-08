const router = require('express').Router()
const LessonResultController = require('../modules/LessonResults/LessonResult.controller')

const Controller = new LessonResultController()

router.post('/lesson/result/:id', Controller.create)
router.put('/lesson/result/:id', Controller.update)

module.exports = router