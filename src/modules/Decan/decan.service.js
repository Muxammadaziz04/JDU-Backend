const sha256 = require('sha256')
const SequelizeError = require("../../errors/sequelize.error")
const { sequelize } = require("../../services/sequelize.service")
const DecanModel = require("./Decan.model.js")

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

    async checkPassword(psw) {
        try {
            const decan = await this.models.Decan.findOne({ where: { password: sha256(psw) } })
            return decan
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new DecanServices(sequelize)