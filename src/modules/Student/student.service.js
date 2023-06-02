const StudentModel = require('./student.model.js')
const { sequelize } = require('../../services/sequelize.service.js');
const SequelizeError = require('../../errors/sequelize.error.js');
const JapanLanguageTestModel = require('../JapanLanguageTests/JapanLanguageTest.model.js');
const SkillsModel = require('../Skills/skill.model.js');
const ItQualificationModel = require('../ItQualifications/ItQualification.model.js');

class StudentServices {
    constructor(sequelize) {
        StudentModel(sequelize);
        JapanLanguageTestModel(sequelize);
        ItQualificationModel(sequelize)
        this.models = sequelize.models;
    }

    async create(body) {
        try {
            const student = await this.models.Students.create(body, {
                include: [
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests' },
                    {
                        model: this.models.ItQualifications, as: 'ItQualification', include: [
                            {
                                model: this.models.ItQualificationResults, as: 'skills', include: [
                                    { model: this.models.Skills, as: 'skill' }
                                ]
                            }
                        ]
                    },
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
                    {
                        model: this.models.ItQualifications, as: 'ItQualification',
                        attributes: { exclude: ['studentId'] },
                        include: [
                            {
                                model: this.models.ItQualificationResults, as: 'skills',
                                attributes: { exclude: ['ItQualificationId', 'skillId'] },
                                include: [
                                    { model: this.models.Skills, as: 'skill' }
                                ]
                            }
                        ]
                    },
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