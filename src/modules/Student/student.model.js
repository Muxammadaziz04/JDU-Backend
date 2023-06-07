const { Model, Sequelize, DataTypes } = require("sequelize");
const logger = require("../../services/logger.service");
const { validateLinks } = require("../../utils/modelValidation");

class Student extends Model { }

module.exports = (sequelize) => {
    try {
        Student.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            loginId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            groupNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            yearOfAdmission: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING,
                validate: {
                    isUrl: true
                }
            },
            bio: {
                type: DataTypes.TEXT
            },
            images: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: [],
                validate: {
                    validateLinks
                }
            },
            videos: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: [],
                validate: {
                    validateLinks
                }
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Students',
        })

        Student.associate = (models) => {
            models.Students.belongsTo(models.Specialisations, {
                foreignKey: {
                    name: 'specialisationId',
                    allowNull: false
                },
                as: 'specialisation'
            })

            models.Students.hasMany(models.JapanLanguageTests, {
                foreignKey: {
                    name: 'studentId',
                    allowNull: false
                },
                as: 'japanLanguageTests',
            })

            models.Students.hasOne(models.ItQualifications, {
                foreignKey: {
                    name: 'studentId',
                    allowNull: false
                },
                as: 'itQualification',
            })

            models.Students.hasMany(models.Lessons, {
                foreignKey: {
                    name: 'studentId',
                },
                as: 'lessons',
                onDelete: 'cascade'
            })

            models.Students.hasOne(models.UniversityPercentages, {
                foreignKey: {
                    name: 'studentId',
                },
                as: 'universityPercentage',
            })
        }

        return Student
    } catch (error) {
        logger.error(error.message);
    }
}