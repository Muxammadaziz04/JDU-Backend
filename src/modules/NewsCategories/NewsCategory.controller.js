const logger = require("../../services/logger.service");
const NewsCategoryServise = require("./NewsCategory.servise");

class NewsCategoryController{
    async create(req, res) {
        try {
            const category = await NewsCategoryServise.create(req.body)
            res.status(201).send(category)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getAll(req, res) {
        try {
            const categories = await NewsCategoryServise.getAll()
            res.status(200).send(categories)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async update(req, res) {
        try {
            const category = await NewsCategoryServise.update(req.params?.id, req.body)
            res.status(203).send(category)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async delete(req, res) {
        try {
            const category = await NewsCategoryServise.delete(req.params?.id)
            res.status(203).send('')
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = NewsCategoryController