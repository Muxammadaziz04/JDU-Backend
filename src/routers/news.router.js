const router = require('express').Router()
const NewsController = require('../modules/News/news.controller.js')
const Controller = new NewsController()

router.get('/news', Controller.getAll)
router.get('/news/published', Controller.getPublishedNews)
router.get('/news/:id', Controller.getById)
router.post('/news', Controller.create)
router.put('/news/:id', Controller.update)
router.delete('/news/:id', Controller.delete)

module.exports = router