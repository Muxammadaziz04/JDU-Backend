const SequelizeError = require("../../errors/sequelize.error")
const { sequelize } = require("../../services/sequelize.service")
const DecanModel = require("./Decan.model")

class DecanServices {
    constructor(sequelize) {
        DecanModel(sequelize)
        this.models = sequelize.models
    }

    async update(id, body) {
        try {
            const decan = await this.models.Decan.update(body, { where: { id }, returning: true })
            return decan
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new DecanServices(sequelize)