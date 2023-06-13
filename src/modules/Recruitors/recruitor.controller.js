const logger = require("../../services/logger.service");
const RecruitorService = require("./recruitor.service");

class RecruitorController {
    async create(req, res) {
        try {
            const recruitor = await RecruitorService.create(req.body)
            res.status(201).send(recruitor)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getAll(req, res) {
        try {
            const { page, limit } = req.params
            const recruitors = await RecruitorService.getAll({ page, limit })
            res.status(200).send(recruitors)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async update(req, res) {
        try {
            const recruitor = await RecruitorService.update(req.params?.id, req.body)
            res.status(203).send(recruitor)
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = RecruitorController