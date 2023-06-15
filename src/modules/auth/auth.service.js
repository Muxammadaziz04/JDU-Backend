const { Op } = require("sequelize")
const SequelizeError = require("../../errors/sequelize.error")
const { sequelize } = require("../../services/sequelize.service")

class AuthService {
    constructor(sequelize) {
        this.models = sequelize.models
    }

    async login({ loginId, password }) {
        try {
            const student = await this.models.Students.findOne({ where: { loginId, password }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (student) {
                return student
            }

            const recruitor = await this.models.Recruitors.findOne({ where: { loginId, password }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (recruitor) {
                return recruitor
            }

            const decan = await this.models.Decan.findOne({ where: { loginId, password }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (decan) {
                return decan
            }
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new AuthService(sequelize)