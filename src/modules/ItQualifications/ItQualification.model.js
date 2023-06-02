const { Model, DataTypes, Sequelize } = require("sequelize");
const logger = require("../../services/logger.service");

class ItQualification extends Model {}

module.exports = (sequelize) => {
    try {
        ItQualification.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'ItQualifications'
        })

        ItQualification.associate = (models) => {
            models.ItQualifications.belongsTo(models.Students, {
                foreignKey: {
                    name: 'studentId',
                    allowNull: false
                },
                onDelete: 'cascade',
                as: 'student'
            })

            models.ItQualifications.hasMany(models.ItQualificationResults, {
                foreignKey: {
                    name: 'ItQualificationId',
                    allowNull: false
                },
                as: 'skills'
            })
        }
    } catch (error) {
        logger.error(error.message)
    }
}