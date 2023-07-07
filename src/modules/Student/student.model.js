const sha256 = require('sha256')
const { Model, Sequelize, DataTypes, Op } = require("sequelize");
const logger = require("../../services/logger.service");
const validateLinks = require("../../utils/validateLinks");
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

                        const decan = await sequelize.models.Decan.findOne({ where: { loginId: value } })
                        if (decan) {
                            throw new Error('loginId must be unique')
                        }

                        const teacher = await sequelize.models.Teachers.findOne({ where: { loginId: value } })
                        if (teacher) {
                            throw new Error('loginId must be unique')
                        }
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: 8,
                }
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
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
                    validateLinks
                },
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
            },
            cv: {
                type: DataTypes.STRING,
                validate: {
                    validateLinks
                },
            }
        }, {
            sequelize,
            modelName: 'Students',
            hooks: {
                beforeCreate: (model) => {
                    const values = model.dataValues
                    if(values?.password){
                        model.password = sha256(values.password)
                    }
                },
                beforeUpdate: (model) => {
                    const values = model.dataValues
                    if(model._previousDataValues?.password !== values?.password){
                        model.password = sha256(values.password)
                    }
                }
            }
        });

        Student.associate = (models) => {
            // models.Students.belongsTo(models.Specialisations, {
            //     foreignKey: {
            //         name: 'specialisationId',
            //         allowNull: false
            //     },
            //     as: 'specialisation'
            // })

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