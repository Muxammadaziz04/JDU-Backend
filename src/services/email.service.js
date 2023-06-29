const nodemailer = require("nodemailer");
const { nodemailerConfig } = require("../configs/email.config");
require('dotenv').config()

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async ({ to, html, text, subject }) => {
    return await transporter.sendMail({
        from: `JDU system <${process.env.EMAIL}>`,
        to, subject, html, text
    });
}

module.exports = sendEmail