const jwt = require("jsonwebtoken");
require('dotenv').config()

const sign = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET)
}

const verify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err || !payload) return { error: true, message: err.message }
        else return payload
    })
}

module.exports = {
    sign,
    verify
}