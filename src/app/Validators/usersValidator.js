import joi from 'joi'

export const loginSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().required()
})

export const registerSchema = joi.object({
    username: joi.string().required().min(3).max(20).messages({
        'string.min': "name must have atleast 5 characters"
    }),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

export const updateSchema = joi.object({
    username: joi.string().required().min(3).max(20).messages({
        'string.min': "name must have atleast 5 characters"
    }),
    name: joi.string().required().min(3).max(20).messages({
        'string.min': "name must have atleast 5 characters"
    }),
    phone: joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    image: joi.string().required().min(6).max(200).messages({
        'string.min': "name must have atleast 5 characters"
    }),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

