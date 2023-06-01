const { Model, Sequelize, DataTypes } = require("sequelize");
const logger = require("../../services/logger.service");

class JapanLanguageTest extends Model {}

module.exports = (sequelize) => {
    try {
        JapanLanguageTest.init({
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
            },
            listening: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            reading: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            writing: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            sertificate: {
                type: DataTypes.STRING,
                validate: {
                    isUrl: true
                }
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'JapanLanguageTests'
        })

        JapanLanguageTest.associate = (models) => {
            models.JapanLanguageTests.belongsTo(models.Students, {
                foreignKey: {
                    name: 'studentId',
                    allowNull: false
                },
                onDelete: 'cascade',
                as: 'student'
            })
        }

    } catch (error) {
        logger.error(error.message)
    }
}