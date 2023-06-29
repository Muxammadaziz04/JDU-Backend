const { welcomeTemplate } = require("../../configs/email.config");
const { roles } = require("../../constants/server.constants");
const ExpressError = require("../../errors/express.error");
const sendEmail = require("../../services/email.service");
const { uploadFile, removeFile } = require("../../services/file.service");
const logger = require("../../services/logger.service");
const { generatePassword } = require("../../utils/generator");
const RecruitorService = require("./recruitor.service");

class RecruitorController {
    async create(req, res, next) {
        try {
            const avatar = req.files?.avatar
            const body = req.body

            body.password = body.password || generatePassword()
            body.loginId = body.loginId || await RecruitorService.generateLoginId()

            if (avatar) {
                const recruitorAvatar = await uploadFile({ file: avatar })
                if (recruitorAvatar?.url) body.avatar = recruitorAvatar.url
                else throw new ExpressError('avatar is not uploaded')
            }
            
            const recruitor = await RecruitorService.create(body)
            if (recruitor?.error) {
                if (body.avatar) await removeFile(body.avatar)
                throw new ExpressError(recruitor.message, recruitor.status)
            }

            await sendEmail({ to: body.email, subject: 'Welcome to JDU system', html: welcomeTemplate({ loginId: body.loginId, password: body.password }) })

            res.status(201).send(recruitor)
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res) {
        try {
            const { page, limit, search } = req.query
            const recruitors = await RecruitorService.getAll({ page, limit, search })
            res.status(200).send(recruitors)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getById(req, res) {
        try {
            const recruitor = await RecruitorService.getById(req.params?.id)
            res.status(200).send(recruitor)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async update(req, res, next) {
        try {
            const avatar = req.files?.avatar
            const body = req.body

            if (avatar) {
                const recruitorAvatar = await uploadFile({ file: avatar })
                if (recruitorAvatar.url) {
                    body.avatar = recruitorAvatar.url
                    const prevValues = await RecruitorService.getById(req.params.id)
                    prevValues.dataValues?.avatar && await removeFile(prevValues.dataValues?.avatar)
                } else throw new ExpressError(recruitorAvatar?.message || 'avatar is not uploaded')
            }

            if (req.user.id === req.params.id || req.role === roles.DECAN) {
                if (req.role !== roles.DECAN) {
                    if (body.password && !body.currentPassword) {
                        throw new ExpressError('current password is required', 400)
                    } else if (body.password && body.confirmPassword === body.password) {
                        const recruitor = await RecruitorService.checkPassword(body.currentPassword)
                        if (!recruitor || recruitor.error) {
                            throw new ExpressError('current password is not correct', 400)
                        }
                    } else if (body.password && (body.confirmPassword !== body.password)) {
                        throw new ExpressError('confirm password is not correct', 400)
                    }
                }
            } else throw new ExpressError('You dont have permission', 403)

            const recruitor = await RecruitorService.update(req.params?.id, body)
            if (recruitor?.error) {
                if (body.avatar) await removeFile(body.avatar)
                throw new ExpressError(recruitor.message, recruitor.status)
            }
            res.status(203).send(recruitor)
        } catch (error) {
            next(error)
        }
    }

    async deleteRecruitor(req, res) {
        try {
            const recruitor = await RecruitorService.deleteStudent(req.params.id)
            res.status(203).send(recruitor)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async selectStudent(req, res) {
        try {
            const selectedStudent = await RecruitorService.selectStudent({ StudentId: req.params?.id, RecruitorId: req.user?.id })
            res.status(201).send(selectedStudent)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async removeSelectedStudent(req, res) {
        try {
            const removedStudent = await RecruitorService.removeSelectedStudent({ StudentId: req.params?.id, RecruitorId: req.user?.id })
            res.status(203).send('removedStudent')
        } catch (error) {
            logger.error(error.message)
        }
    }

    async getSelectedStudents(req, res) {
        try {
            const students = await RecruitorService.getSelectedStudents(req.user?.id)
            res.status(200).send(students)
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = RecruitorController