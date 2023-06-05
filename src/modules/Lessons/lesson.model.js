const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class Lesson extends Model {}

module.exports = (sequelize) => {
    try {
        Lesson.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Lessons'
        })

        Lesson.associate = (models) => {
            models.Lessons.hasMany(models.Semesters, {
                foreignKey: {
                    name: 'lessonId',
                },
                as: 'semesters',
            })

            models.Lessons.belongsTo(models.Students, {
                foreignKey: {
                    name: 'studentId',
                },
                as: 'student',
            })
        }

        return Lesson
    } catch (error) {
        logger.error(error.message)
    }
}