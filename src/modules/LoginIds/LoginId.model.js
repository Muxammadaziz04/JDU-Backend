const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class LoginId extends Model{}

module.exports = (sequelize) => {
    try {
        LoginId.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            }, 
            loginId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            modelName: 'LoginIds',
            timestamps: false
        })
    } catch (error) {
        logger.error(error.message)
    }
}