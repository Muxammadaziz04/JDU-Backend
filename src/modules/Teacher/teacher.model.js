const { Model, Sequelize, DataTypes } = require("sequelize");
const logger = require("../../services/logger.service");

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

            },
            bio: {
                type: DataTypes.TEXT 
            }
        }, {
            sequelize,
            modelName: 'Teachers'
        })
    } catch (error) {
        logger.error(error.message)
    }
}