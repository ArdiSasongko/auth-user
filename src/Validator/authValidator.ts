import * as joi from 'joi'

export class authValidator {

    static register = joi.object({
        name : joi.string().required(),
        email : joi.string().email().required(),
        password : joi.string().alphanum().min(8).max(25).required(),
        phone : joi.string().required(),
        profile : joi.string().optional()
    })

    static login = joi.object({
        email : joi.string().email().required(),
        password : joi.string().alphanum().min(8).max(25).required(),
    })
}