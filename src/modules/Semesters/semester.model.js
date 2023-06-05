const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class Semester extends Model {}

module.exports = (sequelize) => {
    try {
        Semester.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            semesterNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Semesters'
        })

        Semester.associate = (models) => {
            models.Semesters.hasMany(models.LessonResults, {
                foreignKey: {
                    name: 'semesterId',
                },
                as: 'results'
            })

            models.Semesters.belongsTo(models.Lessons, {
                foreignKey: {
                    name: 'lessonId',
                },
                as: 'lesson',
            })
        }

        return Semester
    } catch (error) {
        logger.error(error.message)
    }
}