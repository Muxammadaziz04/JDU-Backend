const { Sequelize } = require('sequelize');
const { sequelize } = require('../../services/sequelize.service.js');
const StudentModel = require('./student.model.js')
const SequelizeError = require('../../errors/sequelize.error.js');
const JapanLanguageTestModel = require('../JapanLanguageTests/JapanLanguageTest.model.js');
const ItQualificationModel = require('../ItQualifications/ItQualification.model.js');
const lessonModel = require('../Lessons/lesson.model.js');
const LessonResultModel = require('../LessonResults/LessonResult.model.js');
const semesterModel = require('../Semesters/semester.model.js');
const UniversityPercentageModel = require('../UniversityPercentages/UniversityPercentage.model.js');
const currentYear = 2023

function calculateCourseNumber(admissionYear) {
    console.log(admissionYear);
    const currentYear = new Date().getFullYear();
    return Math.ceil((currentYear - admissionYear) / 4);
}

class StudentServices {
    constructor(sequelize) {
        StudentModel(sequelize);
        JapanLanguageTestModel(sequelize);
        ItQualificationModel(sequelize)
        lessonModel(sequelize)
        LessonResultModel(sequelize)
        semesterModel(sequelize)
        UniversityPercentageModel(sequelize)
        this.models = sequelize.models;
    }

    async create(body) {
        try {
            const student = await this.models.Students.create(body, {
                include: [
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests' },
                    { model: this.models.UniversityPercentages, as: 'universityPercentage' },
                    {
                        model: this.models.ItQualifications, as: 'itQualification', include: [
                            { model: this.models.ItQualificationResults, as: 'skills', include: [{ model: this.models.Skills, as: 'skill' }] }
                        ]
                    },
                    {
                        model: this.models.Lessons, as: 'lessons', include: [
                            { model: this.models.Semesters, as: 'semesters', include: [{ model: this.models.LessonResults, as: 'results' }] }
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
                // order: [['courseNumber', 'DESC']],
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
            let student = await this.models.Students.update(body, {
                where: { id },
                include: [
                    { model: this.models.JapanLanguageTests, as: 'japanLanguageTests' }
                ],
                returning: true
            })

            return student
        } catch (error) {
            return SequelizeError(error) 
              
        }
    }
}

module.exports = new StudentServices(sequelize)