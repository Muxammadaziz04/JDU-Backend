const { sequelize } = require('../../services/sequelize.service.js');
const StudentModel = require('./student.model.js')
const SequelizeError = require('../../errors/sequelize.error.js');
const JapanLanguageTestModel = require('../JapanLanguageTests/JapanLanguageTest.model.js');
const ItQualificationModel = require('../ItQualifications/ItQualification.model.js');
const lessonModel = require('../Lessons/lesson.model.js');
const semesterModel = require('../Semesters/semester.model.js');
const UniversityPercentageModel = require('../UniversityPercentages/UniversityPercentage.model.js');
const logger = require('../../services/logger.service.js');
const { roles } = require('../../constants/server.constants.js');

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
                individualHooks: true,
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

    async getAll({ page = 1, limit = 10, role, userId = '' }) {
        try {
            let students = await this.models.Students.findAndCountAll({
                distinct: true,
                where: { isDeleted: false },
                attributes: {
                    exclude: ['specialisationId', 'password', 'isDeleted', 'email', 'groupNumber', 'courseNumber', 'role', 'bio', 'images', 'videos', 'createdAt', 'updatedAt'],
                    include: role === roles.RECRUITOR ? [
                        [sequelize.literal(`(SELECT EXISTS(SELECT * FROM "SelectedStudents" WHERE "StudentId" = "Students".id AND "RecruitorId" = '${userId}'))`), 'isSelected']
                    ] : []
                },
                include: [
                    { model: this.models.Specialisations, as: 'specialisation' },
                    // { model: this.models.JapanLanguageTests, as: 'japanLanguageTests', attributes: { exclude: ['studentId'] } },
                    { model: this.models.UniversityPercentages, as: 'universityPercentage', attributes: ['AllMarks'] },
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
                    // {
                    //     model: this.models.Lessons, as: 'lessons',
                    //     attributes: { exclude: ['studentId'] },
                    //     include: [
                    //         {
                    //             model: this.models.Semesters, as: 'semesters', attributes: { exclude: ['lessonId'] }, include: [
                    //                 { model: this.models.LessonResults, as: 'results', attributes: { exclude: ['semesterId'] } }
                    //             ]
                    //         }
                    //     ],
                    // }
                ],
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
            const [_, student] = await this.models.Students.update(body, { where: { id }, returning: true, individualHooks: true })
            if (student?.length === 0) return SequelizeError(new Error('Student not found'))

            if (Array.isArray(body?.japanLanguageTests)) {
                await Promise.all(body?.japanLanguageTests?.map(async (test) => {
                    try {
                        await this.models.JapanLanguageTests.update(test, { where: { id: test.id || null } })
                    } catch (error) {
                        logger.error(error.message)
                    }
                }))
            }
            if (body?.itQualification) {
                const [_, itQualification] = await this.models.ItQualifications.update(body.itQualification, { where: { studentId: id }, returning: true })
                if (Array.isArray(body?.itQualification?.skills)) {
                    await Promise.all(body?.itQualification?.skills?.map(async skill => {
                        try {
                            const studentSkill = await this.models.ItQualificationResults.update(skill, { where: { id: skill.id || null }, returning: true })
                            if (studentSkill?.[0] === 0 && skill.skillId && skill.procent) {
                                this.models.ItQualificationResults.create({ ...skill, ItQualificationId: itQualification?.[0]?.id })
                            }
                        } catch (error) {
                            logger.error(error.message)
                        }
                    }))
                }
            }
            if (body?.universityPercentage) {
                await this.models.UniversityPercentages.update(body?.universityPercentage, { where: { studentId: id } })
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
            const student = await this.models.Students.findByPk(id, {
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
                        attributes: { exclude: ['studentId'], include: [
                            // [sequelize.literal(`(select s."allCredits" from "Lessons" as l join (select sum(credit) as "allCredits", sm.id, sm."lessonId" from "Semesters" as sm join "LessonResults" as r on sm.id = r."semesterId" group by sm.id) as s on s."lessonId" = l.id where s."lessonId" = "Lessons".id)`), 'summ']
                        ] },
                        include: [
                            {
                                model: this.models.Semesters, as: 'semesters', attributes: { exclude: ['lessonId'], include: [
                                    // [sequelize.literal(`(select sum(credit) from "Semesters" as s left join "LessonResults" as l on s.id = l."semesterId" where s.id = "Lessons".id group by s.id)`), 'all']
                                ] }, 
                                order: ['semesterNumber'],
                                include: [
                                    { model: this.models.LessonResults, as: 'results', attributes: { exclude: ['semesterId'] } }   
                                ]
                            }
                        ],
                    }
                ],
                attributes: { exclude: ['specialisationId', 'password', 'isDeleted',] },
            })
            return student?.isDeleted ? {} : student
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getTopStudents({ page = 1, limit = 10 }) {
        try {
            const topStudents = await this.models.Students.findAndCountAll({
                attributes: ['id', 'firstName', 'lastName', 'avatar'],
                order: [['universityPercentage', 'AllMarks', 'DESC']],
                include: [{ model: this.models.UniversityPercentages, as: 'universityPercentage', attributes: ['AllMarks'] }],
                offset: (page - 1) * limit,
                limit,
            })
            return topStudents
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new StudentServices(sequelize)