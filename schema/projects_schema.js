import Joi from "joi";

export const project_schema = Joi.object({
    projectName: Joi.string().required(),
    program: Joi.string(),
    contributors: Joi.string(),
    skills: Joi.string(),
    link: Joi.string(),
    nameOfInstitution: Joi.string(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    user: Joi.string()
})