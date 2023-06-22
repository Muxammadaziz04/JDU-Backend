const { Op } = require("sequelize")
const SequelizeError = require("../../errors/sequelize.error")
const { sequelize } = require("../../services/sequelize.service")
const tokenModel = require("./token.model")

class AuthService {
    constructor(sequelize) {
        tokenModel(sequelize)
        this.models = sequelize.models
    }

    async login({ loginId, password }) {
        try {
            const student = await this.models.Students.findOne({ where: { loginId, password, isDeleted: false }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (student) {
                return student
            }

            const recruitor = await this.models.Recruitors.findOne({ where: { loginId, password, isDeleted: false }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (recruitor) {
                return recruitor
            }

            const decan = await this.models.Decan.findOne({ where: { loginId, password, isDeleted: false }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (decan) {
                return decan
            }
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getById(id) {
        try {
            const student = await this.models.Students.findOne({ where: { id }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (student) {
                return student
            }

            const recruitor = await this.models.Recruitors.findOne({ where: { id }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (recruitor) {
                return recruitor
            }

            const decan = await this.models.Decan.findOne({ where: { id }, attributes: ['firstName', 'lastName', 'loginId', 'avatar', 'id', 'role'] })
            if (decan) {
                return decan
            }
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getUserByEmail(email) {
        try {
            const student = await this.models.Students.findOne({ where: { email, isDeleted: false }, attributes: ['id'] })
            if (student) {
                return student
            }

            const recruitor = await this.models.Recruitors.findOne({ where: { email, isDeleted: false }, attributes: ['id'] })
            if (recruitor) {
                return recruitor
            }

            const decan = await this.models.Decan.findOne({ where: { email, isDeleted: false }, attributes: ['id'] })
            if (decan) {
                return decan
            }
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async createToken(body) {
        try {
            const token = await this.models.Tokens.create(body)
            return token
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getTokenByUserId(userId) {
        try {
            const token = await this.models.Tokens.findOne({ where: { userId } })
            return token
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async deleteToken(userId) {
        try {
            const token = await this.models.Tokens.destroy({ where: { userId } })
            return token
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async changePassword(id, password) {
        try {
            const student = await this.models.Students.findOne({ where: { id } })
            if (student) {
                this.models.Students.update({ password }, { where: { id } })
                return student
            }

            const recruitor = await this.models.Recruitors.findOne({ where: { id } })
            if (recruitor) {
                this.models.Recruitors.update({ password }, { where: { id } })
                return recruitor
            }

            const decan = await this.models.Decan.findOne({ where: { id } })
            if (decan) {
                this.models.Decan.update({ password }, { where: { id } })
                return decan
            }
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new AuthService(sequelize)