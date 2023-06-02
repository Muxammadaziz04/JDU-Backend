const { Model, Sequelize, DataTypes } = require("sequelize");
const logger = require("../../services/logger.service");

class ItQualificationResult extends Model {}

module.exports = (sequelize) => {
    try {
        ItQualificationResult.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            procent: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            }
        }, {
            sequelize, 
            timestamps: false,
            modelName: 'ItQualificationResults'
        })

        ItQualificationResult.associate = (models) => {
            models.ItQualificationResults.belongsTo(models.Skills, {
                foreignKey: {
                    name: 'skillId',
                    allowNull: false
                },
                onDelete: 'cascade',
                as: 'skill'
            })

            models.ItQualificationResults.belongsTo(models.ItQualifications, {
                foreignKey: {
                    name: 'ItQualificationId',
                    allowNull: false
                },
                onDelete: 'cascade',
                as: 'ItQualification'
            })
        }

        return ItQualificationResult
    } catch (error) {
        logger.error(error.message)
    }
}