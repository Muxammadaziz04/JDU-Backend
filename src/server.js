const express = require('express')
const { PORT } = require('./constants/server.constants')

const app = express()


app.listen(PORT, () => console.log(`Server is run on ${PORT} port`))