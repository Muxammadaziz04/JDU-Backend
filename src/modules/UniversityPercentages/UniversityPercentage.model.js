const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class UniversityPercentage extends Model { }

function calculateAllMarks(model) {
    const value = model.dataValues

    const Attendee = +value.Attendee
    const ItCourse = +value.ItCourse
    const JapanLanguage = +value.JapanLanguage
    const SannoUniversity = +value.SannoUniversity
    const UzSWLUniversity = +value.UzSWLUniversity
    const CoWork = +value.CoWork

    const results = [Attendee, ItCourse, JapanLanguage, SannoUniversity, UzSWLUniversity, CoWork]

    return +(results.reduce((acc, curr) => (acc + curr), 0) / results.length).toFixed(2)
}

module.exports = (sequelize) => {
    try {
        UniversityPercentage.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            Attendee: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            ItCourse: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            JapanLanguage: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            SannoUniversity: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            UzSWLUniversity: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            CoWork: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            AllMarks: {
                type: DataTypes.DECIMAL(5, 2),
                defaultValue: 0,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'UniversityPercentages'
        })

        UniversityPercentage.beforeCreate((model) => {
            model.AllMarks = calculateAllMarks(model)
        })

        UniversityPercentage.beforeUpdate((model) => {
            model.AllMarks = calculateAllMarks(model)
        })

        UniversityPercentage.associate = (models) => {
            models.UniversityPercentages.belongsTo(models.Students, {
                foreignKey: {
                    name: 'studentId',
                    allowNull: false
                },
                as: 'student',
                onDelete: 'cascade'
            })
        }

        return UniversityPercentage
    } catch (error) {
        logger.error(error.message)
    }
}