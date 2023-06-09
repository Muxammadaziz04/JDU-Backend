const { sequelize } = require('../../services/sequelize.service.js');
const StudentModel = require('./student.model.js')
const SequelizeError = require('../../errors/sequelize.error.js');
const JapanLanguageTestModel = require('../JapanLanguageTests/JapanLanguageTest.model.js');
const ItQualificationModel = require('../ItQualifications/ItQualification.model.js');
const lessonModel = require('../Lessons/lesson.model.js');
const semesterModel = require('../Semesters/semester.model.js');
const UniversityPercentageModel = require('../UniversityPercentages/UniversityPercentage.model.js');
const { Op } = require('sequelize');

class StudentServices {
    constructor(sequelize) {
        StudentModel(sequelize);
        JapanLanguageTestModel(sequelize);
        ItQualificationModel(sequelize);
        lessonModel(sequelize);
        semesterModel(sequelize);
        UniversityPercentageModel(sequelize);
        this.models = sequelize.models;
    }

    async create(body) {
        try {
            const student = await this.models.Students.create(body, {
                include: [
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests' },
                    { model: this.models.UniversityPercentages, as: 'universityPercentage', individualHooks: true },
                    {
                        model: this.models.ItQualifications, as: 'itQualification', include: [
                            { model: this.models.ItQualificationResults, as: 'skills', include: [{ model: this.models.Skills, as: 'skill' }] }
                        ]
                    },
                    {
                        model: this.models.Lessons, as: 'lessons', include: [
                            { model: this.models.Semesters, as: 'semesters', include: [{ model: this.models.LessonResults, as: 'results', individualHooks: true }] }
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
            let students = await this.models.Students.findAndCountAll({
                distinct: true,
                where: { isDeleted: false },
                // order: [['universityPercentage', 'AllMarks', 'ASC']],
                include: [
                    { model: this.models.Specialisations, as: 'specialisation' },
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests', attributes: { exclude: ['studentId'] } },
                    { model: this.models.UniversityPercentages, as: 'universityPercentage', attributes: { exclude: ['studentId'] } },
                    {
                        model: this.models.ItQualifications, as: 'itQualification',
                        attributes: { exclude: ['studentId', 'id'] },
                        include: [
                            {
                                model: this.models.ItQualificationResults, as: 'skills',
                                attributes: { exclude: ['ItQualificationId', 'skillId'] },
                                include: [{ model: this.models.Skills, as: 'skill' }]
                            }
                        ]
                    },
                    {
                        model: this.models.Lessons, as: 'lessons',
                        attributes: { exclude: ['studentId'] },
                        include: [
                            {
                                model: this.models.Semesters, as: 'semesters', attributes: { exclude: ['lessonId'] }, include: [
                                    { model: this.models.LessonResults, as: 'results', attributes: { exclude: ['semesterId'] } }
                                ]
                            }
                        ],
                    }
                ],
                attributes: { exclude: ['specialisationId', 'password', 'isDeleted',] },
                offset: (page - 1) * limit,
                limit,
            })

            return students
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async update(id, body) {
        try {
            const student = await this.models.Students.update(body, { where: { id }, returning: true })

            if (Array.isArray(body?.JapanLanguageTests)) {
                body.forEach((test) => {
                    this.models.JapanLanguageTests.update(test, { where: { id: test.id } })
                })
            }
            if (body?.itQualification) {
                this.models.ItQualifications.update(body.itQualification, { where: { [Op.or]: [{ id: body?.itQualification?.id }, { studentId: id }] } })
                if (Array.isArray(body?.itQualification?.skills)) {
                    body?.itQualification?.skills.forEach(skill => {
                        this.models.ItQualificationResults.update(skill, { where: { [Op.or]: [{ id: skill.id }, { ItQualificationId: body?.itQualification?.id }] } })
                    })
                }
            }
            if (body?.universityPercentage) {
                this.models.UniversityPercentages.update(body?.universityPercentage, { where: { [Op.or]: [{ id: body?.universityPercentage?.id }, { studentId: id }] } })
            }
            
            return student
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async delete(id) {
        try {
            const student = this.models.Students.update({ isDeleted: true }, { where: { id } })
            return student
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async findByPk(id) {
        try {
            const student = await this.models.Students.findByPk(id)
            return student?.isDeleted ? {} : student
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new StudentServices(sequelize)