const { Sequelize } = require("sequelize");
const dbConfig = require("../configs/sequelize.config.js");
const logger = require("./logger.service.js");

const sequelize = new Sequelize(dbConfig);

const connectToDB = async () => {
    try {
        await sequelize
            .authenticate()
            .then(() => {
                logger.info('DB connected!')
                console.log(sequelize.models);
                Object.keys(sequelize.models).forEach(model => {
                    if (sequelize.models[model].associate){
                        sequelize.models[model].associate(sequelize.models)
                    }
                })
            })
            .catch((err) => {
                throw new Error(err);
            });

        if (process.env.NODE_ENV === "production") {
            sequelize.sync()
        } else {
            sequelize.sync({ alter: true })
        }
    } catch (error) {
        logger.error(`Failed to connect db: ${error}`)
    }
};

module.exports = {
    connectToDB,
    sequelize,
};