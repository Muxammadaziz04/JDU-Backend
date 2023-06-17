const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

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
                    isUrl: true
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
        }

        return News
    } catch (error) {
        logger.error(error.message)
    }
}