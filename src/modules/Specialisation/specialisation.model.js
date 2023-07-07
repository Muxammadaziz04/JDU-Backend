const { Model, Sequelize, DataTypes } = require("sequelize");
const logger = require("../../services/logger.service");

class Specialisation extends Model { }

module.exports = (sequelize) => {
    try {
        Specialisation.init({
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
                unique: true
            }
        }, {
            sequelize, 
            timestamps: false,
            modelName: 'Specialisations'
        })

        Specialisation.associate = (models) => {
            models.Specialisations.hasMany(models.Students, {
                foreignKey: {
                    name: 'specialisationId',
                    allowNull: true
                },
                as: 'specialisation'
            })
        }

        return Specialisation
    } catch (error) {
        logger.error(error.message)
    }
}