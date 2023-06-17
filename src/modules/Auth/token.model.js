const { Model, DataTypes } = require("sequelize");
const logger = require("../../services/logger.service");

class Token extends Model{}

module.exports = (sequelize) => {
    try {
        Token.init({
            userId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Tokens'
        })
    } catch (error) {
        logger.error(error.message)
    }
}