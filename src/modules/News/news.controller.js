const { languages } = require("../../constants/server.constants");
const logger = require("../../services/logger.service");
const NewsServise = require('./news.servise.js')

class NewsController {
    async create(req, res) {
        try {
            const body = req.body
            languages.forEach(lang => {
                body.languages = body.languages || [] 
                body[lang] && body.languages.push({ ...body[lang], lang })
            })
            const news = await NewsServise.create(body)
            res.status(201).send(news)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getAll(req, res) {
        try {
            const news = await NewsServise.getAll(req.query)
            res.status(200).send(news)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getPublishedNews(req, res) {
        try {
            const news = await NewsServise.getPublishedNews(req.query)
            res.status(200).send(news)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async update(req, res) {
        try {
            const body = req.body
            languages.forEach(lang => {
                body.languages = body.languages || [] 
                body[lang] && body.languages.push({ ...body[lang], lang })
            })
            const news = await NewsServise.update(req.params?.id, body)
            res.status(203).send(news)
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