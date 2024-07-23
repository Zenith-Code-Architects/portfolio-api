import Joi from "joi";

export const license_schema = Joi.object({
    name: Joi.string().required(),
    issuingOrganization: Joi.string().required(),
    issueDate: Joi.string(),
    expirationDate: Joi.string(),
    credentialId: Joi.string(),
    credentialUrl: Joi.string(),
    skills: Joi.string(),
    media: Joi.string(),
    user: Joi.string()
})