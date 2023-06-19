const { defaultStudetnValue } = require('../../constants/student.constants.js')
const ExpressError = require('../../errors/express.error.js')
const { uploadFile, removeFile } = require('../../services/file.service.js')
const StudentServices = require('./student.service.js')

class StudentController {
    async getStudents(req, res) {
        try {
            const { page, limit } = req.query
            const students = await StudentServices.getAll({ page, limit, role: req.role, userId: req.user?.id })
            res.status(200).send(students)
        } catch (error) {

        }
    }

    async createStudent(req, res, next) {
        try {
            const studentAvatar = await uploadFile({ file: req.files?.avatar })
            if (studentAvatar?.url) req.body.avatar = studentAvatar.url
            else throw new ExpressError('avatar is not uploaded')
            const student = await StudentServices.create({ ...defaultStudetnValue, ...req.body })
            if (student?.error) {
                if (studentAvatar?.url) await removeFile(studentAvatar.url)
                throw new ExpressError(student.message, student.status)
            }
            res.status(201).send(student)
        } catch (error) {
            next(error)
        }
    }

    async updateStudent(req, res, next) {
        try {
            const avatar = req.files?.avatar
            const body = req.body

            if (avatar) {
                const studentAvatar = await uploadFile({ file: avatar })
                if (studentAvatar.url) {
                    body.avatar = studentAvatar.url
                    const prevValues = await StudentServices.findByPk(req.params.id)
                    prevValues.dataValues?.avatar && await removeFile(prevValues.dataValues?.avatar)
                } else throw new ExpressError(studentAvatar?.message || 'avatar is not uploaded')
            }

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