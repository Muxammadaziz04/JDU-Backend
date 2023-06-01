const studentRouter = require('./student.router.js')
const specialisationRouter = require('./specialisation.router.js')

const routes = [
    studentRouter,
    specialisationRouter
]

const combineRoutes = (app) => {
    routes.forEach(route => {
        app.use(route)
    })
}

module.exports = combineRoutes