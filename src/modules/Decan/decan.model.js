const { Model, DataTypes, Sequelize } = require("sequelize");
const { roles } = require("../../constants/server.constants");
const logger = require("../../services/logger.service");

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
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
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
                    isUrl: true
                }
            },
        }, {
            sequelize,
            modelName: 'Decan'
        })

        return Decan
    } catch (error) {
        logger.error(error.message)
    }
}