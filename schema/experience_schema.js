import Joi from "joi";

export const experience_schema = Joi.object({
    companyName: Joi.string().required(),
    role: Joi.string().required(),
    skills: Joi.string(),
    description: Joi.string(),
    location: Joi.string(),
    locationType: Joi.string().valid('on-site', 'hybrid', 'remote'),
    startDate: Joi.string().required(),
    endDate: Joi.string(),
    employmentType: Joi.string()
        .valid('full-time', 'part-time', 'self-employed', 'freelance', 'contract', 'internship'),
    user: Joi.string()
})