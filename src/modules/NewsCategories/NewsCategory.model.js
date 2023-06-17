const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class NewsCategory extends Model {}

module.exports = (sequelize) => {
    try {
        NewsCategory.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'NewsCategories'
        })

        NewsCategory.associate = (models) => {
            models.NewsCategories.hasMany(models.News, {
                foreignKey: {
                    name: 'categoryId'
                },
                as: 'news'
            })
        }

        return NewsCategory
    } catch (error) {
        logger.error(error)
    }
}