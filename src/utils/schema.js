const Joi = require('joi')

const studentSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    loginId: Joi.string().required(),
    password: Joi.string().required(),
    groupNumber: Joi.string().required(),
    courseNumber: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number()).required(),
    avatar: Joi.string().uri(),
    bio: Joi.string(),
    images: Joi.array().items(Joi.string().uri()),
    videos: Joi.array().items(Joi.string().uri()),
    specialisationId: Joi.string().uuid().required(),
    japanLanguageTests: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        listening: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        writing: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        reading: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
    })),
    ItQualification: Joi.object()
})

module.exports = {
    studentSchema
}