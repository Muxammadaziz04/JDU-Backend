const StudentModel = require('./student.model.js')
const { sequelize } = require('../../services/sequelize.service.js');
const SequelizeError = require('../../errors/sequelize.error.js');
const JapanLanguageTestModel = require('../JapanLanguageTests/JapanLanguageTest.model.js');
const ItQualificationModel = require('../ItQualifications/ItQualification.model.js');
const lessonModel = require('../Lessons/lesson.model.js');
const LessonResultModel = require('../LessonResults/LessonResult.model.js');
const semesterModel = require('../Semesters/semester.model.js');
const { Sequelize } = require('sequelize');

class StudentServices {
    constructor(sequelize) {
        StudentModel(sequelize);
        JapanLanguageTestModel(sequelize);
        ItQualificationModel(sequelize)
        lessonModel(sequelize)
        LessonResultModel(sequelize)
        semesterModel(sequelize)
        this.models = sequelize.models;
    }

    async create(body) {
        try {
            const student = await this.models.Students.create(body, {
                include: [
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests' },
                    {
                        model: this.models.ItQualifications, as: 'itQualification', include: [
                            {
                                model: this.models.ItQualificationResults, as: 'skills', include: [
                                    { model: this.models.Skills, as: 'skill' }
                                ]
                            }
                        ]
                    },
                    {
                        model: this.models.Lessons, as: 'lessons', include: [
                            {
                                model: this.models.Semesters, as: 'semesters', include: [
                                    { model: this.models.LessonResults, as: 'results' }
                                ]
                            }
                        ]
                    }
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
                where: { isDeleted: false },
                include: [
                    { model: this.models.Specialisations, as: 'specialisation' },
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests', attributes: { exclude: ['studentId'] } },
                    {
                        model: this.models.ItQualifications, as: 'itQualification',
                        attributes: { exclude: ['studentId', 'id'] },
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
                    {
                        model: this.models.Lessons, as: 'lessons', attributes: { exclude: ['studentId'], include: [Sequelize.literal('(select s."allCredits" from "Lessons" as l join (select sum(credit) as "allCredits", sm.id, sm."lessonId" from "Semesters" as sm join "LessonResults" as r on sm.id = r."semesterId" group by sm.id) as s on s."lessonId" = l.id)'), 'summ'] },  include: [
                            {
                                model: this.models.Semesters, as: 'semesters', attributes: { exclude: ['lessonId'] }, include: [
                                    { model: this.models.LessonResults, as: 'results', attributes: { exclude: ['semesterId'] } }
                                ]
                            }
                        ],
                    }
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