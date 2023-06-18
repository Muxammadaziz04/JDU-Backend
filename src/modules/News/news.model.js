const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");
const validateLinks = require('../../utils/validateLinks.js')

class News extends Model {}

module.exports = (sequelize) => {
    try {
        News.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            publishDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            image: {
                type: DataTypes.STRING,
                validate: {
                    validateLinks
                }
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'News'
        })

        News.associate = (models) => {
            models.News.belongsTo(models.NewsCategories, {
                foreignKey: {
                    name: 'categoryId'
                },
                as: 'category'
            })

            models.News.hasMany(models.NewsLanguages, {
                foreignKey: {
                    name: 'newsId'
                },
                as: 'languages',
                onDelete: 'cascade'
            })
        }

        return News
    } catch (error) {
        logger.error(error.message)
    }
}