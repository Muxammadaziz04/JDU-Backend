const { welcomeTemplate } = require('../../configs/email.config.js')
const { roles } = require('../../constants/server.constants.js')
const { defaultStudetnValue } = require('../../constants/student.constants.js')
const ExpressError = require('../../errors/express.error.js')
const sendEmail = require('../../services/email.service.js')
const { uploadFile, removeFile } = require('../../services/file.service.js')
const { generatePassword } = require('../../utils/generator.js')
const StudentServices = require('./student.service.js')

class StudentController {
    async getStudents(req, res) {
        try {
            const students = await StudentServices.getAll({ role: req.role, userId: req.user?.id, ...req.query })
            res.status(200).send(students)
        } catch (error) {

        }
    }

    async createStudent(req, res, next) {
        try {
            const avatar = req.files?.avatar
            const cv = req.files?.cv
            const body = req.body

            body.password = body.password || generatePassword()

            if(avatar) {
                const studentAvatar = await uploadFile({ file: avatar })
                if (studentAvatar?.url) body.avatar = studentAvatar.url
                else throw new ExpressError('avatar is not uploaded')
            }

            if(cv) {
                const studentCv = await uploadFile({ file: cv })
                if (studentCv?.url) body.cv = studentCv.url
                else throw new ExpressError('cv is not uploaded')
            }

            const student = await StudentServices.create({ ...defaultStudetnValue, ...body })
            if (student?.error) {
                if (body.avatar) await removeFile(body.avatar)
                if(body.cv) await removeFile(body.cv)
                throw new ExpressError(student.message, student.status)
            }

            await sendEmail({ to: body.email, subject: 'Welcome to JDU system', html: welcomeTemplate({ loginId: body.loginId, password: body.password }) })

            res.status(201).send(student)
        } catch (error) {
            next(error)
        }
    }

    async updateStudent(req, res, next) {
        try {
            const avatar = req.files?.avatar
            const body = req.body

            if(typeof body?.japanLanguageTests === 'string') {
                body.japanLanguageTests = JSON.parse(body.japanLanguageTests)
            }

            if(typeof body?.universityPercentage === 'string') {
                body.universityPercentage = JSON.parse(body.universityPercentage)
            }

            if(typeof body?.itQualification === 'string') {
                body.itQualification = JSON.parse(body.itQualification)
            }

            if (avatar) {
                const studentAvatar = await uploadFile({ file: avatar })
                if (studentAvatar.url) {
                    body.avatar = studentAvatar.url
                    const prevValues = await StudentServices.findByPk(req.params.id)
                    prevValues.dataValues?.avatar && await removeFile(prevValues.dataValues?.avatar)
                } else throw new ExpressError(studentAvatar?.message || 'avatar is not uploaded')
            }

            if(req.user.id === req.params.id || req.role === roles.DECAN) {
                if(req.role !== roles.DECAN) {
                    if (body.password && !body.currentPassword) {
                        throw new ExpressError('current password is required', 400)
                    } else if (body.password && body.confirmPassword === body.password) {
                        const student = await StudentServices.checkPassword(body.currentPassword)
                        if (!student || student.error) {
                            throw new ExpressError('current password is not correct', 400)
                        }
                    } else if (body.password && (body.confirmPassword !== body.password)) {
                        throw new ExpressError('confirm password is not correct', 400)
                    }
                }
            } else throw new ExpressError('You dont have permission', 403)

            const student = await StudentServices.update(req.params.id, body)
            if(student?.error) {
                if (body.avatar) await removeFile(body.avatar)
                throw new ExpressError(student.message, student.status)
            }
            res.status(203).send(student)
        } catch (error) {
            next(error)
        }
    }

    async deleteStudent(req, res) {
        try {
            const student = await StudentServices.delete(req.params.id)
            res.status(204).send('')
        } catch (error) {
            console.log(error);
        }
    }

    async findById(req, res) {
        try {
            const student = await StudentServices.findByPk(req.params.id)
            res.status(200).send(student)
        } catch (error) {
            console.log(error);
        }
    }

    async getTopStudents(req, res) {
        try {
            const topStudents = await StudentServices.getTopStudents({ page: req.query?.page, limit: req.query?.limit })
            res.status(200).send(topStudents)
        } catch (error) {

        }
    }
}

module.exports = StudentController