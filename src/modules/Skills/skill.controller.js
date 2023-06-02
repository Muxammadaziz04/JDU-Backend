const logger = require("../../services/logger.service");
const SkillService = require("./skill.service");

class SkillController{
    async getAll (req, res){
        try {
            const skills = await SkillService.getAll()
            res.status(200).send(skills)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async create (req, res) {
        try {
            const skill = await SkillService.create(req.body)
            res.status(201).send(skill)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async edit(req, res) {
        try {
            const skill = await SkillService.edit(req.params?.id, req.body)
            res.status(203).send(skill)
        } catch (error) {
            logger.error(error.message)
        }
    }

    async delete(req, res) { 
        try {
            const skill = await SkillService.delete(req.params?.id)
            res.status(204).send()
        } catch (error) {
            logger.error(error.message)
        }
    }
}

module.exports = SkillController