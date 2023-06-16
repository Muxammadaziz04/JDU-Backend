const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const { connectToDB } = require('./services/sequelize.service.js')
const { PORT } = require('./constants/server.constants')
const combineRoutes = require('./routers/index.js');
const AuthMiddleware = require('./middlewares/auth.middleware.js');

const app = express()

connectToDB()

app.options("*", cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(AuthMiddleware)

combineRoutes(app)

app.listen(PORT, () => console.log(`Server is run on ${PORT} port`))