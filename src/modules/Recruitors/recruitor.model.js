const sha256 = require('sha256')
const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

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
                    isUrl: true
                }
            },
            loginId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
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
                type: DataTypes.ENUM('recruitor'),
                allowNull: false,
                defaultValue: 'recruitor'
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
                    model.password = sha256(values.password)
                }
            }
        })

    } catch (error) {
        logger.error(error.message)
    }
}