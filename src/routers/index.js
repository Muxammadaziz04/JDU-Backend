const studentRouter = require('./student.router.js')
const specialisationRouter = require('./specialisation.router.js')
const skillRouter = require('./skill.router.js')

const routes = [
    studentRouter,
    specialisationRouter,
    skillRouter,
]

const combineRoutes = (app) => {
    routes.forEach(route => {
        app.use(route)
    })
}

module.exports = combineRoutes