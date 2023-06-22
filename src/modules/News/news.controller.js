const { languages } = require("../../constants/server.constants");
const ExpressError = require("../../errors/express.error");
const { uploadFile, removeFile } = require("../../services/file.service");
const logger = require("../../services/logger.service");
const NewsServise = require('./news.servise.js')

class NewsController {
    async create(req, res, next) {
        try {
            const body = req.body
            if (req.files?.image) {
                const newsImage = await uploadFile({ file: req.files?.image })
                if (newsImage?.url) body.image = newsImage.url
                else throw new ExpressError('News image is not uploaded')
            }

            languages.forEach(lang => {
                body.languages = body.languages || []
                body[lang] && body.languages.push({ ...body[lang], lang })
            })

            const news = await NewsServise.create(body)
            if (news?.error) {
                if (body.image) await removeFile(body.image)
                throw new ExpressError(news.message, news.status)
            }
            res.status(201).send(news)
        } catch (error) {
            next(error)
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

    async update(req, res, next) {
        try {
            const image = req.files?.image
            const body = req.body

            if (image) {
                const newsImage = await uploadFile({ file: image })
                if (newsImage.url) {
                    body.image = newsImage.url
                    const prevValues = await NewsServise.findByPk(req.params.id)
                    prevValues.dataValues?.image && await removeFile(prevValues.dataValues?.image)
                } else throw new ExpressError(newsImage?.message || 'News image is not uploaded')
            }

            languages.forEach(lang => {
                body.languages = body.languages || []
                body[lang] && body.languages.push({ ...body[lang], lang })
            })

            const news = await NewsServise.update(req.params?.id, body)
            if (news?.error) {
                if (body.image) await removeFile(body.image)
                throw new ExpressError(news.message, news.status)
            }
            res.status(203).send(news)
        } catch (error) {
            next(error)
        }
    }

    async getById(req, res, next) {
        try {
            const news = await NewsServise.findByPk(req.params?.id, req.query?.lang)
            res.status(200).send(news)
        } catch (error) {
            next(error)
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