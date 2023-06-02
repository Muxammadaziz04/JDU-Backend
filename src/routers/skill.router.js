const router = require('express').Router()
const SkillController = require('../modules/Skills/skill.controller.js')

const Controller = new SkillController()

router.get('/skills', Controller.getAll)
router.post('/skill', Controller.create)
router.put('/skill/:id', Controller.edit)
router.delete('/skill/:id', Controller.delete)

module.exports = router