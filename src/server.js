const express = require('express')
const cors = require('cors')
const { connectToDB } = require('./services/sequelize.service.js')
const { PORT } = require('./constants/server.constants')
const combineRoutes = require('./routers/index.js')

const app = express()

connectToDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

combineRoutes(app)

app.listen(PORT, () => console.log(`Server is run on ${PORT} port`))