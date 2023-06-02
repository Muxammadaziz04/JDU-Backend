const { Model, DataTypes, Sequelize } = require("sequelize");
const { colorRegex } = require("../../constants/server.constants");
const logger = require("../../services/logger.service");

class Skill extends Model {}

module.exports = (sequelize) => {
    try {
        Skill.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            color: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: colorRegex
                }
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Skills'
        })

        Skill.associate = (models) => {
            models.Skills.hasMany(models.ItQualificationResults, {
                foreignKey: {
                    name: 'skillId',
                },
                as: 'ItQualifications'
            })
        }

        return Skill
    } catch (error) {
        logger.error(error.message)
    }
}