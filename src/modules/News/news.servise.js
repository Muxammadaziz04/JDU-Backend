const SequelizeError = require("../../errors/sequelize.error")
const { sequelize } = require("../../services/sequelize.service")
const newsModel = require("./news.model")
const { Op } = require("sequelize")

class NewsServise {
    constructor(sequelize) {
        newsModel(sequelize)
        this.models = sequelize.models
    }

    async create(body) {
        try {
            const news = await this.models.News.create(body)
            return news
        } catch (error) {
            return SequelizeError(error)
        }
    }

    async getAll({ page = 1, limit = 10 }) {
        try {
            const news = await this.models.News.findAndCountAll({
                attributes: { exclude: ['categoryId'] },
                include: [
                    { model: this.models.NewsCategories, as: 'category' }
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

    async getPublishedNews({ page = 1, limit = 10, categoryId = null }) {
        console.log(categoryId);
        try {
            const currentDate = new Date();
            const news = await this.models.News.findAndCountAll({
                where: {
                    publishDate: {
                        [Op.lt]: currentDate
                    },
                    ...(categoryId && { categoryId })
                },
                include: [
                    { model: this.models.NewsCategories, as: 'category' }
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