const logger = require("../../services/logger.service");
const NewsServise = require('./news.servise.js')

class NewsController {
    async create(req, res) {
        try {
            const news = await NewsServise.create(req.body)
            res.status(201).send(news)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getAll(req, res) {
        try {
            const { page, limit } = req.query
            const news = await NewsServise.getAll({ page, limit })
            res.status(200).send(news)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getPublishedNews(req, res) {
        try {
            const { page, limit, categoryId } = req.query
            const news = await NewsServise.getPublishedNews({ page, limit, categoryId })
            res.status(200).send(news)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async delete(req, res) {
        try {
            const news = await NewsServise.delete(req.params?.id)
            res.status(203).send('deleted')
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = NewsController