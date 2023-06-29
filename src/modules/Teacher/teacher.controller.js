const { welcomeTemplate } = require("../../configs/email.config")
const ExpressError = require("../../errors/express.error")
const sendEmail = require("../../services/email.service")
const { uploadFile, removeFile } = require("../../services/file.service")
const { generatePassword } = require("../../utils/generator")
const TeacherService = require("./teacher.service")

class TeacherController {
    async getAll(req, res, next) {
        try {
            const teachers = await TeacherService.getAll(req.query)
            res.status(200).send(teachers)
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const avatar = req.files?.avatar
            const body = req.body

            body.password = body.password || generatePassword()

            if(avatar) {
                const teacherAvatar = await uploadFile({ file: avatar })
                if (teacherAvatar?.url) body.avatar = teacherAvatar.url
                else throw new ExpressError('avatar is not uploaded')
            }

            const teacher = await TeacherService.create(body)
            if (teacher?.error) {
                if (body.avatar) await removeFile(body.avatar)
                throw new ExpressError(teacher.message, teacher.status)
            }

            await sendEmail({ to: body.email, subject: 'Welcome to JDU system', html: welcomeTemplate({ loginId: body.loginId, password: body.password }) })

            res.status(201).send(teacher)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = TeacherController