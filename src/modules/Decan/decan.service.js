const sha256 = require('sha256')
const SequelizeError = require("../../errors/sequelize.error")
const { sequelize } = require("../../services/sequelize.service")
const DecanModel = require("./decan.model.js")

class DecanServices {
    constructor(sequelize) {
        DecanModel(sequelize)
        this.models = sequelize.models
    }

    async getMe() {
        try {
            const decan = await this.models.Decan.findOne({ attributes: { exclude: ['password', 'isDeleted'] } })
            return decan
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async update(body) {
        try {
            const decan = await this.models.Decan.update(body, { returning: true })
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
