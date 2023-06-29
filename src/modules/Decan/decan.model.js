const sha256 = require('sha256')
const { Model, DataTypes, Sequelize } = require("sequelize");
const { roles } = require("../../constants/server.constants");
const logger = require("../../services/logger.service");
const validateLinks = require("../../utils/validateLinks");

class Decan extends Model {}

module.exports = (sequelize) => {
    try {
        Decan.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING,
            },
            lastName: {
                type: DataTypes.STRING,
            },
            loginId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [6, 6],
                        msg: 'Login id length should be 6 character'
                    },
                    isUnique: async function (value) {
                        const recruitor = await sequelize.models.Students.findOne({ where: { loginId: value } })
                        if (recruitor) {
                            throw new Error('loginId must be unique')
                        }

                        const student = await sequelize.models.Students.findOne({ where: { loginId: value } })
                        if (student) {
                            throw new Error('loginId must be unique')
                        }

                        const teacher = await sequelize.models.Teachers.findOne({ where: { loginId: value } })
                        if (teacher) {
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
                validate: {
                    isEmail: true
                }
            },
            role: {
                type: DataTypes.ENUM(roles.DECAN),
                allowNull: false,
                defaultValue: roles.DECAN
            },
            avatar: {
                type: DataTypes.STRING,
                validate: {
                    validateLinks
                }
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            sequelize,
            modelName: 'Decan',
            hooks: {
                beforeCreate: (model) => {
                    const values = model.dataValues
                    model.password = sha256(values.password)
                },
                beforeUpdate: (model) => {
                    const values = model.dataValues
                    model.password = sha256(values.password)
                },
                beforeBulkUpdate: (model) => {
                    const values = model.attributes
                    model.password = sha256(values?.password)
                }
            }
        })

        return Decan
    } catch (error) {
        logger.error(error.message)
    }
}