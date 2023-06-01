const router = require('express').Router()
const SpecialisationController = require('../modules/Specialisation/specialisation.controller.js')

const Controller = new SpecialisationController()

router.get('/specialisations', Controller.getSpecialisations)
router.post('/specialisation', Controller.createSpecialisation)
router.put('/specialisation/:id', Controller.editSpecialisation)
router.delete('/specialisation/:id', Controller.deleteSpecialisation)

module.exports = router