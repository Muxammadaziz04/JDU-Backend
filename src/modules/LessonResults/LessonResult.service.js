const SequelizeError = require("../../errors/sequelize.error");
const { sequelize } = require("../../services/sequelize.service");
const LessonResultModel = require("./LessonResult.model");

class LessonResultServices {
    constructor(sequelize) {
        LessonResultModel(sequelize)
        this.models = sequelize.models
    }

    async create(body) {
        try {
            const result = await this.models.LessonResults.create(body, { returning: true })
            return result
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async update(id, body) {
        try {
            const [_, result] = await this.models.LessonResults.update(body, { where: { id }, returning: true, individualHooks: true })
            return result?.[0] || {}
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new LessonResultServices(sequelize)