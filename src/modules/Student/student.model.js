const sha256 = require('sha256')
const { Model, Sequelize, DataTypes, Op } = require("sequelize");
const logger = require("../../services/logger.service");
const { validateLinks } = require("../../utils/modelValidation");
const { roles } = require('../../constants/server.constants');

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
                unique: true,
                validate: {
                    isUnique: async function (value) {
                        const recruitor = await sequelize.models.Recruitors.findOne({ where: { loginId: value } })
                        if (recruitor) {
                            throw new Error('loginId must be unique')
                        }
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            groupNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            courseNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            role: {
                type: DataTypes.ENUM(roles.STUDENT),
                allowNull: false,
                defaultValue: roles.STUDENT
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
            hooks: {
                beforeCreate: (model) => {
                    const values = model.dataValues
                    model.password = sha256(values.password)
                },
                beforeUpdate: (model) => {
                    const values = model.dataValues
                    model.password = sha256(values.password)
                }
            }
        });

        // sequelize.queryInterface.addIndex('Students', ['loginId'], { unique: true })

        // sequelize.queryInterface.addConstraint('Students', {
        //     type: 'unique',
        //     fields: ['loginId'],
        // });

        //   // Add check constraint to ensure the username field of Post model is not already used in User model
        //   sequelize.queryInterface.addConstraint('Students', {
        //     type: 'check',
        //     name: 'loginId_unique_across_models',
        //     where: {
        //       loginId: {
        //         [Op.notIn]: sequelize.literal(`(SELECT "loginId" FROM "Recruitors")`),
        //       },
        //     },
        //   });

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
                onDelete: 'cascade'
            })

            models.Students.belongsToMany(models.Recruitors, {
                through: models.SelectedStudents,
                timestamps: false
            })
        }

        return Student
    } catch (error) {
        logger.error(error.message);
    }
}