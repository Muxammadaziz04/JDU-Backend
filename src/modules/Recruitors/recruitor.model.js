const sha256 = require('sha256')
const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");
const { roles } = require('../../constants/server.constants');
const validateLinks = require('../../utils/validateLinks');

class Recruitor extends Model { }

module.exports = (sequelize) => {
    try {
        Recruitor.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
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
                    len: [6, 6],
                    isUnique: async function (value) {
                        const recruitor = await sequelize.models.Students.findOne({ where: { loginId: value } })
                        if (recruitor) {
                            throw new Error('loginId must be unique')
                        }

                        const decan = await sequelize.models.Decan.findOne({ where: { loginId: value } })
                        if (decan) {
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
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            specialisation: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            bio: {
                type: DataTypes.TEXT
            },
            role: {
                type: DataTypes.ENUM(roles.RECRUITOR),
                allowNull: false,
                defaultValue: roles.RECRUITOR
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, {
            sequelize,
            modelName: 'Recruitors',
            hooks: {
                beforeCreate: (model) => {
                    const values = model.dataValues
                    model.password = sha256(values.password)
                },
                beforeUpdate: (model) => {
                    const values = model.dataValues
                    if (model._previousDataValues.password !== values.password) {
                        model.password = sha256(values.password)
                    }
                }
            }
        })

        sequelize.define('SelectedStudents', {
            StudentId: DataTypes.UUIDV4,
            RecruitorId: DataTypes.UUIDV4
        }, {
            timestamps: false,
            modelName: 'SelectedStudents'
        })

        Recruitor.associate = (models) => {
            models.Recruitors.belongsToMany(models.Students, {
                through: models.SelectedStudents,
                as: 'students'
            })
        }

        return Recruitor
    } catch (error) {
        logger.error(error.message)
    }
}