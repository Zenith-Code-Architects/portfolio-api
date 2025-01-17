import Joi from "joi";

export const user_schema = Joi.object({
    firstName: Joi.string()
        .min(3)
        .max(30)
        .required(),


    lastName: Joi.string()
        .min(3)
        .max(30)
        .required(),

    userName: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string().min(6)
        .required(),

    confirmPassword: Joi.ref('password')
}).with('password', 'confirmPassword');