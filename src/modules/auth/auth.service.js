const { Op } = require("sequelize")
const { sequelize } = require("../../services/sequelize.service")
const AuthModel = require("./auth.model")

class AuthService {
    constructor(sequelize) {
        AuthModel(sequelize)
        this.models = sequelize.models
    }

    async login({ loginId, password }) {
        const user = await this.models.Auth.findOne({ where: { [Op.and]: [{ loginId }, { password }] } })
        return user
    }
}

module.exports = new AuthService(sequelize)