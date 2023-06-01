const StudentModel = require('./student.model.js')
const { sequelize } = require('../../services/sequelize.service.js');
const SequelizeError = require('../../errors/sequelize.error.js');
const japanLanguageTestModel = require('../JapanLanguageTests/japanLanguageTest.model.js');

class StudentServices {
    constructor(sequelize) {
        StudentModel(sequelize);
        japanLanguageTestModel(sequelize);
        this.models = sequelize.models;
    }

    async create(body) {
        try {
            const student = await this.models.Students.create(body, {
                include: [
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests' }
                ]
            })
            return student
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getAll({ page = 1, limit = 10 }) {
        try {
            const students = await this.models.Students.findAndCountAll({
                where: { isDeleted: false },
                include: [
                    { model: this.models.Specialisations, as: 'specialisation' },
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests', attributes: { exclude: ['studentId'] } },
                ],
                attributes: { exclude: ['specialisationId', 'password', 'isDeleted'] },
                offset: (page - 1) * limit,
                limit,
            })
            return students
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new StudentServices(sequelize)