const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class UniversityPercentage extends Model { }

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
                validate: {
                    min: 0,
                    max: 100
                }
            },
            ItCourse: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            JapanLanguage: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            SannoUniversity: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            UzSWLUniversity: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            CoWork: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            AllMarks: {
                type: DataTypes.INTEGER,
                get() {
                    const Attendee = this.getDataValue('Attendee') ?? 0
                    const ItCourse = this.getDataValue('ItCourse') ?? 0
                    const JapanLanguage = this.getDataValue('JapanLanguage') ?? 0
                    const SannoUniversity = this.getDataValue('SannoUniversity') ?? 0
                    const UzSWLUniversity = this.getDataValue('UzSWLUniversity') ?? 0
                    const CoWork = this.getDataValue('CoWork') ?? 0

                    return +((Attendee + ItCourse + JapanLanguage + SannoUniversity + UzSWLUniversity + CoWork) / 6).toFixed(2)
                }
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'UniversityPercentages'
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