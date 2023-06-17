const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class NewsLanguage extends Model { }

module.exports = (sequelize) => {
    try {
        NewsLanguage.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            title: {
                type: DataTypes.STRING,
            },
            shortDescription: {
                type: DataTypes.TEXT
            },
            description: {
                type: DataTypes.TEXT
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'NewsLanguages'
        })
    } catch (error) {
        logger.error(error.message)
    }
}