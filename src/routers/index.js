const studentRouter = require('./student.router.js')
const specialisationRouter = require('./specialisation.router.js')
const skillRouter = require('./skill.router.js')
const lessonResult = require('./lessonResult.router.js')
const auth = require('./auth.router.js')
const recruitor = require('./recruitor.router.js')
const decan = require('./decan.router.js')
const newsCategory = require('./newsCategory.router')
const news = require('./news.router.js')
const FileUpload = require('./fileUpload.router')

const routes = [
    studentRouter,
    specialisationRouter,
    skillRouter,
    lessonResult,
    auth,
    recruitor,
    decan,
    newsCategory,
    news,
    FileUpload
]

const combineRoutes = (app) => {
    routes.forEach(route => {
        app.use(route)
    })
}

module.exports = combineRoutes