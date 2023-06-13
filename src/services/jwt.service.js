const jwt = require("jsonwebtoken");
require('dotenv').config()

const sign = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET)
}

module.exports = {
    sign
}