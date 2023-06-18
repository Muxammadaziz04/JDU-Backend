const ExpressError = require("../../errors/express.error");
const { uploadFile, removeFile } = require("../../services/file.service");
const logger = require("../../services/logger.service");
const RecruitorService = require("./recruitor.service");

class RecruitorController {
    async create(req, res, next) {
        try {
            const recruitorAvatar = await uploadFile({file: req.files?.avatar})
            if(recruitorAvatar?.url) req.body.avatar = recruitorAvatar.url
            const recruitor = await RecruitorService.create(req.body)
            if(recruitor?.error){
                if(recruitorAvatar?.url) await removeFile(recruitorAvatar.url)
                throw new ExpressError(recruitor.message, recruitor.status)
            }
            res.status(201).send(recruitor)
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res) {
        try {
            const { page, limit } = req.query
            const recruitors = await RecruitorService.getAll({ page, limit })
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

    async update(req, res) {
        try {
            const body = req.body
            if (body.password && !body.currentPassword) {
                res.status(409).send({ error: true, status: 409, message: 'current password is required' })
                return
            } else if (body.password && body.confirmPassword === body.password) {
                const recruitor = await RecruitorService.checkPassword(body.currentPassword)
                if (!recruitor || recruitor.error) {
                    res.status(409).send({ error: true, status: 409, message: 'current password is not correct' })
                    return
                }
            } else if (body.password && body.confirmPassword !== body.password) {
                res.status(409).send({ error: true, status: 409, message: 'confirm password is not correct' })
                return
            }

            const recruitor = await RecruitorService.update(req.params?.id, body)
            res.status(203).send(recruitor)
        } catch (error) {
            logger.error(error.message)
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