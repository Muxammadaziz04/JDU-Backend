const SequelizeError = require("../../errors/sequelize.error");
const { sequelize } = require("../../services/sequelize.service");
const skillModel = require("./skill.model");

class SkillServices {
    constructor(sequelize) {
        skillModel(sequelize)
        this.models = sequelize.models
    }

    async getAll() {
        try {
            const skills = await this.models.Skills.findAll()
            return skills
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async create(body) {
        try {
            const skill = await this.models.Skills.create(body)
            return skill
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async edit(id, body) {
        try {
            const [_, skill] = await this.models.Skills.update(body, { where: { id }, returning: true })
            return skill?.[0] || {}
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async delete(id) {
        try {
            const skill = await this.models.Skills.destroy({ where: { id } })
            return skill
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new SkillServices(sequelize)