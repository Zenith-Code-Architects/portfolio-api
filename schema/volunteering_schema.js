import Joi from "joi";

export const volunteering_schema = Joi.object({
    organization: Joi.string().required(),
    role: Joi.string().required(),
    description: Joi.string(),
    skills: Joi.string(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    projectName: Joi.string(),
    location: Joi.string(),
    user: Joi.string()
})