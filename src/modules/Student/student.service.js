const {  } = require('../../services/.service.js');
const StudentModel = require('./student.model.js')
const Error = require('../../errors/.error.js');
const JapanLanguageTestModel = require('../JapanLanguageTests/JapanLanguageTest.model.js');
const ItQualificationModel = require('../ItQualifications/ItQualification.model.js');
const lessonModel = require('../Lessons/lesson.model.js');
const semesterModel = require('../Semesters/semester.model.js');
const UniversityPercentageModel = require('../UniversityPercentages/UniversityPercentage.model.js');

class StudentServices {
    constructor() {
        StudentModel();
        JapanLanguageTestModel();
        ItQualificationModel();
        lessonModel();
        semesterModel(); 
        UniversityPercentageModel();
        this.models = .models;
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
            return Error(error)
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
            return Error(error)
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
            return Error(error)
        }
    }

    async delete(id) {
        try {
            const student = this.models.Students.update({ isDeleted: true }, { where: { id } })
            return student
        } catch (error) {
            return Error(error)
        }
    }

    async findByPk(id) {
        try {
            const student = await this.models.Students.findByPk(id)
            return student?.isDeleted ? {} : student
        } catch (error) {
            return Error(error)
        }
    }
}

module.exports = new StudentServices()