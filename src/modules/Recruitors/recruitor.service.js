const SequelizeError = require("../../errors/sequelize.error");
const { sequelize } = require("../../services/sequelize.service");
const recruitorModel = require("./recruitor.model");

class RecruitorService {
    constructor(sequelize) {
        recruitorModel(sequelize)
        this.models = sequelize.models
    }

    async create(body) {
        try {
            const recruitor = await this.models.Recruitors.create(body)
            return recruitor
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getAll({ page = 1, limit = 10 }) {
        try {
            const recruitors = await this.models.Recruitors.findAndCountAll({
                attributes: { exclude: ['password'] },
                offset: (page - 1) * limit,
                limit,
            })
            return recruitors
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async update(id, body) {
        try {
            const [_, recruitor] = await this.models.Recruitors.update(body, { where: { id }, returning: true, individualHooks: true })
            return recruitor?.[0]
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new RecruitorService(sequelize)