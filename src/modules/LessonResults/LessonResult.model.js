const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class LessonResult extends Model {}

module.exports = (sequelize) => {
    try {
        LessonResult.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            lessonName: {
                type: DataTypes.STRING(),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(['Incompleted', 'Completed']),
                allowNull: false
            },
            university: {
                type: DataTypes.STRING(),
                allowNull: false
            },
            credit: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0
                }
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'LessonResults',
            hooks: {
                beforeCreate: (model) => {
                    const values = model.dataValues
                    if(values.status === 'Completed') {
                        model.credit = 0
                    }
                },
                beforeUpdate: (model) => {
                    const values = model.dataValues
                    if(values.status === 'Completed') {
                        model.credit = 0
                    }
                }
            }
        })

        LessonResult.associate = (models) => {
            models.LessonResults.belongsTo(models.Semesters, {
                foreignKey: {
                    name: 'semesterId',
                    allowNull: false
                },
                as: 'semesters',
                onDelete: 'cascade'
            })
        }

        return LessonResult
    } catch (error) {
        logger.error(error.message)
    }
}