const StudentServices = require('./student.service.js')

class StudentController {
    async getStudents(req, res) {
        try {
            const { page, limit } = req.query
            const students = await StudentServices.getAll({ page, limit })
            res.status(200).send(students)
        } catch (error) {

        }
    }

    async createStudent(req, res) {
        try {
            const student = await StudentServices.create(req.body)
            res.status(201).send(student)
        } catch (error) {
            console.log(error);
        }
    }

    async updateStudent(req, res) {
        try {
            const student = await StudentServices.update(req.params.id, req.body  )
            res.status(203).send(student)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = StudentController