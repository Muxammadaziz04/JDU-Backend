const sha256 = require('sha256')
const { Model, Sequelize, DataTypes } = require("sequelize");
const validateLinks = require("../../utils/validateLinks");
const logger = require("../../services/logger.service");
const { roles } = require('../../constants/server.constants');

class Teacher extends Model {}

module.exports = (sequelize) => {
    try {
        Teacher.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            fatherName: {
                type: DataTypes.STRING
            },
            university: {
                type: DataTypes.STRING,
                allowNull: false
            },
            avatar: {
                type: DataTypes.STRING,
                validate: {
                    validateLinks
                }
            },
            loginId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    validateId: (value) => {
                        if(!/^[0-9]+$/.test(value)){
                            throw new Error('login id must be only numeric')
                        }
                    },
                    isUnique: async function (value) {
                        const recruitor = await sequelize.models.Recruitors.findOne({ where: { loginId: value } })
                        if (recruitor) {
                            throw new Error('loginId must be unique')
                        }

                        const decan = await sequelize.models.Decan.findOne({ where: { loginId: value } })
                        if (decan) {
                            throw new Error('loginId must be unique')
                        }

                        const teachers = await sequelize.models.Students.findOne({ where: { loginId: value } })
                        if (teachers) {
                            throw new Error('loginId must be unique')
                        }
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: 8,
                }
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            specialisation: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM(roles.TEACHER),
                allowNull: false,
                defaultValue: roles.TEACHER
            },
        }, {
            sequelize,
            modelName: 'Teachers',
            hooks: {
                beforeCreate: (model) => {
                    const values = model.dataValues
                    model.password = sha256(values.password)
                },
                beforeUpdate: (model) => {
                    const values = model.dataValues
                    model.password = sha256(values.password)
                }
            }
        })
    } catch (error) {
        logger.error(error.message)
    }
}