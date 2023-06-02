const SpecialisationModel = require('./specialisation.model.js')
const { sequelize } = require("../../services/sequelize.service")
const SequelizeError = require('../../errors/sequelize.error.js');
const ItQualificationResultModel = require('../ItQualificationResults/ItQualificationResult.model.js');

class SpecialisationServices {
    constructor(sequelize) {
        SpecialisationModel(sequelize);
        ItQualificationResultModel(sequelize)
        this.models = sequelize.models;
    }

    async getAll() {
        try {
            const specialisations = await this.models.Specialisations.findAll()
            return specialisations
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async create(body) {
        try {
            const specialisation = await this.models.Specialisations.create(body)
            return specialisation
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async edit(id, body) {
        try {
            const [_, specialisation] = await this.models.Specialisations.update(body, { where: { id }, returning: true }) || []
            return specialisation?.[0] || {}
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async delete(id) {
        try {
            const specialisation = await this.models.Specialisations.destroy({ where: { id } })
            return specialisation
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new SpecialisationServices(sequelize)