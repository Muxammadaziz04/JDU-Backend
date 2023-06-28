const Joi = require('joi')

const studentSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    loginId: Joi.string().required(),
    password: Joi.string().required(),
    groupNumber: Joi.string().required(),
    // yearOfAdmission: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number()).required(),
    courseNumber: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(1)).required(),
    avatar: Joi.string().uri(),
    bio: Joi.string(),
    email: Joi.string().email(),
    images: Joi.array().items(Joi.string().uri()),
    videos: Joi.array().items(Joi.string().uri()),
    specialisationId: Joi.string().uuid().required(),
    japanLanguageTests: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        listening: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        writing: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        reading: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
    })),
    itQualification: Joi.object({
        description: Joi.string(), 
        skills: Joi.array().items(Joi.object({
            procent: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)).required(),
            skillId: Joi.string().uuid().required()
        }))
    }),
    universityPercentage: Joi.object({
        Attendee: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        ItCourse: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        JapanLanguage: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        SannoUniversity: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        UzSWLUniversity: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100)),
        CoWork: Joi.alternatives(Joi.string().regex(/^\d+$/), Joi.number().min(0).max(100))
    }),
    lessons: Joi.object()
})

const recruitorSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    loginId: Joi.string().required(),
    password: Joi.string().required(),
    companyName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    bio: Joi.string(),
    avatar: Joi.string().uri(),
    specialisation: Joi.string().required()
})

module.exports = {
    studentSchema,
    recruitorSchema
}