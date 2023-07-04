const { Op } = require('sequelize');
const sha256 = require('sha256')
const SequelizeError = require("../../errors/sequelize.error");
const { sequelize } = require("../../services/sequelize.service");
const { generateLoginId } = require('../../utils/generator');
const recruitorModel = require("./recruitor.model");

class RecruitorService {
    constructor(sequelize) {
        recruitorModel(sequelize)
        this.models = sequelize.models
    }

    async create(body) {
        try {
            const recruitor = await this.models.Recruitors.create(body, { individualHooks: true })
            return recruitor
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getAll({ page = 1, limit = 10, search, company }) {
        try {
            const recruitors = await this.models.Recruitors.findAndCountAll({
                where: {
                    isDeleted: false,
                    ...(search && {
                        [Op.or]: [
                            { firstName: { [Op.iLike]: '%' + search + '%' } },
                            { lastName: { [Op.iLike]: '%' + search + '%' } },
                        ]
                    }),
                    ...(company && {
                        companyName: { [Op.iLike]: '%' + company + '%' }
                    })
                },
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['password', 'isDeleted'] },
                offset: (page - 1) * limit,
                limit,
            })
            return recruitors
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getById(id) {
        try {
            const recruitor = await this.models.Recruitors.findByPk(id, { where: { isDeleted: false }, attributes: { exclude: ['password', 'isDeleted'] } })
            return recruitor
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async update(id, body) {
        try {
            const [_, recruitor] = await this.models.Recruitors.update(body, { where: { id }, returning: true, individualHooks: true })
            return recruitor?.[0]
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async checkPassword(psw) {
        try {
            const recruitor = await this.models.Recruitors.findOne({ where: { password: sha256(psw) } })
            return recruitor
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async deleteStudent(id) {
        try {
            const recruitor = await this.models.Recruitors.update({ isDeleted: true }, { where: { id } })
            return recruitor
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async selectStudent({ RecruitorId, StudentId }) {
        try {
            const selectedStudent = await this.models.SelectedStudents.create({ RecruitorId, StudentId })
            return selectedStudent
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async removeSelectedStudent({ RecruitorId, StudentId }) {
        try {
            const deletedStudent = await this.models.SelectedStudents.destroy({ where: { RecruitorId, StudentId } })
            return deletedStudent
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getSelectedStudents(id) {
        try {
            const recruitor = await this.models.Recruitors.findOne({
                where: { id },
                include: [
                    {
                        model: this.models.Students,
                        through: this.models.SelectedStudents,
                        as: 'students',
                        attributes: ['id', 'firstName', 'lastName', 'avatar', 'loginId'],
                        include: [
                            { model: this.models.UniversityPercentages, as: 'universityPercentage', attributes: { exclude: ['studentId'] } },
                            {
                                model: this.models.ItQualifications, as: 'itQualification', attributes: { exclude: ['studentId', 'id'] }, include: [
                                    {
                                        model: this.models.ItQualificationResults, as: 'skills', attributes: { exclude: ['ItQualificationId', 'skillId'] }, include: [
                                            { model: this.models.Skills, as: 'skill' }
                                        ]
                                    }
                                ]
                            }
                        ],
                    }
                ]
            })
            return recruitor?.students ?? []
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async generateLoginId() {
        try {
            const loginId = generateLoginId()
            const isExist = await this.models.Recruitors.findOne({ where: { loginId } })

            if (isExist) {
                this.generateLoginId()
            } else {
                return loginId
            }
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new RecruitorService(sequelize)