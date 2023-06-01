const SpecialisationServices = require('./specialisation.service.js')

class SpecialisationController {
    async getSpecialisations(req, res) {
        try {
            const specialisations = await SpecialisationServices.getAll()
            res.status(200).send(specialisations)
        } catch (error) {
            
        }
    }

    async createSpecialisation(req, res) {
        try {
            const specialisation = await SpecialisationServices.create(req.body)
            res.status(201).send(specialisation)
        } catch (error) {
            
        }
    }

    async editSpecialisation(req, res) {
        try {
            const specialisation = await SpecialisationServices.edit(req.params?.id, req.body)
            res.status(204).send(specialisation)
        } catch (error) {
            
        }
    }

    async deleteSpecialisation(req, res) {
        try {
            const specialisation = await SpecialisationServices.delete(req.params?.id)
            res.status(204).send()
        } catch (error) {
            
        }
    }
}

module.exports = SpecialisationController