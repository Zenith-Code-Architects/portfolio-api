import Joi from "joi";

export const education_schema = Joi.object({
    schoolName: Joi.string().required(),
    location: Joi.string(),
    program: Joi.string().required(),
    degree: Joi.string().required(),
    grade: Joi.string(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    user: Joi.string()
})