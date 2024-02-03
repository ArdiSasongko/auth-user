import * as joi from 'joi'

export class userValidator {
    static otpResetpassword = joi.object({
        email : joi.string().email().required()
    })

    static resetPassword = joi.object({
        email : joi.string().email().required(),
        password : joi.string().min(8).max(25).required(),
        OTP : joi.string().required()
    })
}