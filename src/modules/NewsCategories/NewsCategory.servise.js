const SequelizeError = require("../../errors/sequelize.error")
const { sequelize } = require("../../services/sequelize.service")
const NewsCategoryModel = require("./NewsCategory.model")

class NewsCategoryServises {
    constructor(sequelize) {
        NewsCategoryModel(sequelize)
        this.models = sequelize.models
    }

    async create(body) {
        try {
            const category = await this.models.NewsCategories.create(body)
            return category
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getAll() {
        try {
            const categories = await this.models.NewsCategories.findAll()
            return categories
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async update(id, body) {
        try {
            const [_, category] = await this.models.NewsCategories.update(body, { where: { id }, returning: true })
            return category?.[0]
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async delete(id) {
        try {
            const category = await this.models.NewsCategories.destroy({ where: { id } })
            return category
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new NewsCategoryServises(sequelize)