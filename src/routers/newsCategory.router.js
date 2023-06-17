const router = require('express').Router()
const NewsCategoryController = require('../modules/NewsCategories/NewsCategory.controller.js')
const Controller = new NewsCategoryController()

router.get('/news_categories', Controller.getAll)
router.post('/news_category', Controller.create)
router.put('/news_category/:id', Controller.update)
router.delete('/news_category/:id', Controller.delete)

module.exports = router