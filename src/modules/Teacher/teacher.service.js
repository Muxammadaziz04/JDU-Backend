const SequelizeError = require("../../errors/sequelize.error");
const { sequelize } = require("../../services/sequelize.service");
const teacherModel = require("./teacher.model");

class TeacherServices {
    constructor(sequelize) {
        teacherModel(sequelize)
        this.models = sequelize.models
    }

    async getAll({page = 1, limit = 10}) {
        try {
            const teachers = await this.models.Teachers.findAndCountAll({
                offset: (page - 1) * limit,
                limit,
            })
            return teachers
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async create(body) {
        try {
            const teacher = await this.models.Teachers.create(body)
            return teacher
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new TeacherServices(sequelize)