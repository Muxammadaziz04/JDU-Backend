const { Model, DataTypes, Sequelize } = require("sequelize");
const { languages } = require("../../constants/server.constants");
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
            },
            lang: {
                type: DataTypes.ENUM(languages),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'NewsLanguages'
        })

        NewsLanguage.accosiate = (models) => {
            models.NewsLanguages.belongsTo(models.News, {
                foreignKey: {
                    name: 'newsId',
                    allowNull: false
                },
                as: 'news'
            })
        }
    } catch (error) {
        logger.error(error.message)
    }
}