import Joi from "joi";

export const achievement_schema = Joi.object({
    awards: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string(),
    date: Joi.string().required(),
    nameOfInstitution: Joi.string().required(),
    user: Joi.string()
})