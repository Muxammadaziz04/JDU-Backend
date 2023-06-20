const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload')
const { connectToDB } = require('./services/sequelize.service.js')
const { PORT } = require('./constants/server.constants')
const combineRoutes = require('./routers/index.js');
const AuthMiddleware = require('./middlewares/auth.middleware.js');
const logger = require('./services/logger.service.js');
const LoggerMiddleware = require('./middlewares/logger.middleware.js');

const app = express()

connectToDB()

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }));
app.use(AuthMiddleware)
app.use(LoggerMiddleware)

combineRoutes(app)

app.use((err, req, res, next) => {
    logger.error(err.message)
    res.status(err.status || 400).send({
        error: true,
        status: err.status || 400,
        message: err?.message || 'Somethink went wrong',
    })
  })

app.listen(PORT, () => console.log(`Server is run on ${PORT} port`))