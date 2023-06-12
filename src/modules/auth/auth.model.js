const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class Auth extends Model {}

module.exports = (sequelize) => {
    try {
        Auth.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            loginId: {
                type: DataTypes.STRING(),
                allowNull: false,   
                unique: true
            },
            password: {
                type: DataTypes.STRING(),
                allowNull: false
            } 
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Auth'
        })

        return Auth
    } catch (error) {
        logger.error(error.message)
    }
}