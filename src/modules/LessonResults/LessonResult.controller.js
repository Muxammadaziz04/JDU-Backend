const LessonResultService = require("./LessonResult.service")

class LessonResultController{
    async create(req, res) {
        try {
            const result = await LessonResultService.create({...req.body, semesterId: req.params.id})
            res.status(201).send(result)
        } catch (error) {
            console.log(error);
        }
    }

    async update(req, res) {
        try {
            const result = await LessonResultService.update(req.params.id, req.body)
            res.status(203).send(result)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = LessonResultController