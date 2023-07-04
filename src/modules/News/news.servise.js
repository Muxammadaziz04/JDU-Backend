const SequelizeError = require("../../errors/sequelize.error")
const { sequelize } = require("../../services/sequelize.service")
const newsModel = require("./news.model")
const { Op } = require("sequelize")
const NewsLanguageModel = require("../NewsLanguage/NewsLanguage.model")

class NewsServise {
    constructor(sequelize) {
        newsModel(sequelize)
        NewsLanguageModel(sequelize)
        this.models = sequelize.models
    }

    async create(body) {
        try {
            const news = await this.models.News.create(body, {
                include: [
                    { model: this.models.NewsLanguages, as: 'languages' }
                ]
            })
            return news
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async findByPk(id, lang) {
        try {
            const news = await this.models.News.findByPk(id, {
                include: [
                    { model: this.models.NewsCategories, as: 'category' },
                    { model: this.models.NewsLanguages, as: 'languages', attributes: { exclude: ['newsId'] }, where: { ...(lang && { lang }) } }
                ]
            })
            return news
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getAll({ page = 1, limit = 10, lang, search }) {
        try {
            const news = await this.models.News.findAndCountAll({
                distinct: true,
                attributes: { exclude: ['categoryId'] },
                include: [
                    { model: this.models.NewsCategories, as: 'category' },
                    {
                        model: this.models.NewsLanguages, as: 'languages', attributes: { exclude: ['newsId'] }, where: {
                            ...(lang && { lang }),
                            ...(search && {
                                [Op.or]: [
                                    { title: { [Op.iLike]: '%' + search + '%' } },
                                    { shortDescription: { [Op.iLike]: '%' + search + '%' } },
                                    { description: { [Op.iLike]: '%' + search + '%' } },
                                ]
                            })
                        }
                    }
                ],
                order: [['publishDate', 'DESC']],
                offset: (page - 1) * limit,
                limit
            })
            return news
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getPublishedNews({ page = 1, limit = 10, categoryId = null, lang, search }) {
        try {
            const currentDate = new Date();
            const news = await this.models.News.findAndCountAll({
                distinct: true,
                where: {
                    publishDate: {
                        [Op.lt]: currentDate
                    },
                    ...(categoryId && { categoryId })
                },
                include: [
                    { model: this.models.NewsCategories, as: 'category' },
                    { model: this.models.NewsLanguages, as: 'languages', attributes: { exclude: ['newsId'] }, where: { 
                        ...(lang && { lang }),
                        ...(search && {
                            [Op.or]: [
                                { title: { [Op.iLike]: '%' + search + '%' } },
                                { shortDescription: { [Op.iLike]: '%' + search + '%' } },
                                { description: { [Op.iLike]: '%' + search + '%' } },
                            ]
                        })
                    } }
                ],
                attributes: { exclude: ['categoryId'] },
                order: [['publishDate', 'DESC']],
                offset: (page - 1) * limit,
                limit
            })

            return news
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async update(id, body) {
        try {
            const [_, news] = await this.models.News.update(body, { where: { id }, returning: true })
            if (Array.isArray(body.languages)) {
                body.languages.map(async lang => {
                    const newsLanguage = await this.models.NewsLanguages.findOne({ where: { newsId: id, lang: lang.lang } })
                    if (newsLanguage) {
                        await this.models.NewsLanguages.update(lang, { where: { id: newsLanguage?.id } })
                    } else {
                        await this.models.NewsLanguages.create({ ...lang, newsId: id })
                    }
                })
            }
            return news?.[0]
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async delete(id) {
        try {
            const news = await this.models.News.destroy({ where: { id } })
            return news
        } catch (error) {
            return SequelizeError(error)
        }
    }
}

module.exports = new NewsServise(sequelize)