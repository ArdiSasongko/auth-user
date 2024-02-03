import { NextFunction, Request, Response } from "express";
import * as httpStatus from 'http-status'
import { authValidator } from "../Validator/authValidator";
import { Utils } from "../Utils/Utils";
import userModel from "../Model/userModel";
import { Mailjet } from "../Utils/sendEmail";
import { JWT } from "../Utils/JWT";

export class authController {
    static async registerUser (req: Request, res: Response, next: NextFunction) {
        try {
            const request = await authValidator.register.validateAsync(req.body)
            const OTP_Token = await Utils.generatedOTP()
            const hashPassword = await Utils.hashPassword(request.password)
            const email = await userModel.findOne({ email : request.email })

            if(email){
                return res.status(403).json({ error : 'Email already used'})
            }

            const data = {
                name : request.name,
                email : request.email,
                password : hashPassword,
                phone : request.phone,
                profile : request.profile,
                email_token_verification : OTP_Token,
                email_token_verification_time : Date.now() + new Utils().MAX_TIME_TOKEN
            }

            const newUser = await new userModel(data).save()

            await Mailjet.sendMail({
                to : [request.email],
                subject : "OTP for email verification",
                html : `<h1>Token OTP : ${OTP_Token}</h1>`
            })

            if(!newUser) {
                return res.status(400).json({ error : 'Failed register user'})
            }

            return res.status(200).json({ data : newUser})
        } catch (error: any) {
            return next(error)
        }
    }

    static async login (req: Request, res: Response, next: NextFunction){
        try {
            const request = await authValidator.login.validateAsync(req.body)
            const user = await userModel.findOne({ email : request.email })

            if(!user) {
                return res.status(404).json({ error : 'Email Invalid'})
            }

            await Utils.comparePassword(request.password, user.password)

            const payload = {
                email : user.email,
                type : user.type,
                email_verified : user.email_verified,
            }

            const token = await JWT.jwtSign(payload, user._id)

            return res.status(201).json({ token : `${token}`})
        } catch (error: any) {
            return next(error)
        }
    }
}