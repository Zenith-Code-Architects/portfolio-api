import Joi from "joi";

export const userProfile_schema = Joi.object({
    profilePicture: Joi.string(),
    location: Joi.string(),
    maritalStatus: Joi.string().valid('single', 'married', 'prefer-not-to-say'),
    sex: Joi.string().valid('male', 'female'),
    bio: Joi.string(),
    about: Joi.string(),
    dateOfBirth: Joi.string(),
    contact: Joi.string(),
    resume: Joi.string(),
    spokenLanguages: Joi.array().items(Joi.string()),
    // spokenLanguages: Joi.string(),
    github: Joi.string(),
    linkedln: Joi.string(),
    twitter: Joi.string(),
    user: Joi.string()
})