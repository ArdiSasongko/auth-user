import { NextFunction, Request, Response } from "express";
import userModel from "../Model/userModel";
import { authValidator } from "../Validator/authValidator";
import { Utils } from "../Utils/Utils";
import { Mailjet } from "../Utils/sendEmail";
import { userValidator } from "../Validator/userValidator";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
    keyFilename : '././serviceaccount.json',
    projectId : 'spheric-subject-412702'
})

//name bucket in gcp
const bucket = storage.bucket('test-upload-12')

export class userController {
    static async getMe(req: any, res: Response, next: NextFunction){
        const user = req.user
        try {
            const data = await userModel.findById(user.aud)

            if(!data){
                res.status(404)
                return next(new Error('user doesnt exist'))
            }

            return res.status(201).json({ data : data})

        } catch (error: any) {
            return next(error)
        }
    }

    static async verifyEmail(req: any, res: Response, next: NextFunction) {
        const user = req.user
        try {
            const { OTP } = await authValidator.emailVerify.validateAsync(req.body)
            const data = await userModel.findById(user.aud)

            if(!data){
                res.status(404)
                return next(new Error('user doesnt exist'))
            }

            if(data?.email_token_verification !== OTP) {
                return res.status(403).json({message : "OTP invalid or expired, please try again..."})
            }

            const verifyEmail = await userModel.findOneAndUpdate(
                {
                    _id : user.aud
                },
                {
                    email_verified : true,
                    updateAt : Date.now()
                },
                {
                    new : true
                }
            )

            return res.status(201).json(verifyEmail)
        } catch (error: any) {
            return next(error)
        }
    }

    
    static async resendOTP (req: any, res : Response, next: NextFunction) {
        const user = req.user
        try {
            const OTP_Token = await Utils.generatedOTP()

            const resendOTP = await userModel.findByIdAndUpdate(
                {
                    _id : user.aud

                },
                {
                    email_token_verification : OTP_Token,
                    email_token_verification_time : Date.now() + new Utils().MAX_TIME_TOKEN,
                    updateAt : Date.now()
                },
                {
                    new : true
                }
            )

            await Mailjet.sendMail({
                to : [user.email],
                subject : "OTP for email verification",
                html : `<h1>Token OTP : ${OTP_Token}</h1>`
            })

            return res.status(200).json({ message : 'OTP resend success'})
        } catch (error: any) {
            return next(error)
        }
    }

    static async OTP_reset_password (req: any, res: Response, next: NextFunction) {
        try {
            const { email } = await userValidator.otpResetpassword.validateAsync(req.body)
            const OTP_Token = await Utils.generatedOTP()
            const findUser = await userModel.findOne({ email : email })

            if(!findUser){
                req.errorStatus = 403
                return next(new Error("User not found or email invalid"))
            }else {
                const sendOTP = await userModel.findOneAndUpdate(
                    {
                        email : email
                    },
                    {
                        reset_password_token : OTP_Token,
                        resset_password_token_time : Date.now() + new Utils().MAX_TIME_TOKEN,
                        updateAt : Date.now()
                    },
                    {
                        new : true
                    }
                )
    
                await Mailjet.sendMail({
                    to : [email],
                    subject : "OTP for reset password",
                    html : `<h1>Token OTP : ${OTP_Token}</h1>`
                })

                if(!sendOTP) {
                    req.errorStatus = 403
                    return next(new Error("failed send OTP"))
                }
            }

            return res.status(201).json({ message : "Send OTP for reset password success"})
        } catch (error: any) {
            return next(error)
        }
    }

    static async updatePassword (req: any, res: Response, next: NextFunction) {
        try {
            const request = await userValidator.resetPassword.validateAsync(req.body)

            const user = await userModel.findOne({ email : request.email })

            if(!user) {
                req.errorStatus = 404
                return next(new Error("User not found"))
            }

            if(user?.reset_password_token !== request.OTP) {
                req.errorStatus = 403
                return next(new Error("OTP invalid or expired, please try again..."))
            }

            const hash = await Utils.hashPassword(request.password)

            const updatePassword = await userModel.findOneAndUpdate(
                {
                    email : request.email
                },
                {
                    password : hash,
                    updateAt : Date.now()
                },
                {
                    new : true
                }
            )

            if(!updatePassword) {
                req.errorStatus = 403
                return next(new Error("Failed for update password, please try again"))
            }

            return res.status(201).json({ message : "Success update password"})
        } catch (error: any) {
            return next(error)
        }
    }

    static async updateProfile (req: any, res: Response, next: NextFunction){
        const user = req.user
        const path = req.file
        try {
            if(!path){
                req.errorStatus = 403
                return next(new Error('Please upload image'))
            }

            const ext = req.file.originalname.split('.').pop()
            if(ext !== "png" && ext !== "jpg" && ext !== "jpeg" && ext !== "PNG" && ext !== "JPG" && ext !== "JPEG") {
                req.errorStatus = 400
                return next(new Error('Only image'))
            }

            const blob = bucket.file('/profile' + path.originalname)
            const blobStream = blob.createWriteStream()
            blobStream.end(path.buffer)

            await new Promise((resolve, reject) => {
                blobStream.on('finish', resolve),
                blobStream.on('error', reject)
            })

            const urlImage = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

            const updateImage = await userModel.findOneAndUpdate(
                {
                    _id : user.aud
                },
                {
                    profile : urlImage,
                    updateAt : Date.now()
                },
                {
                    new : true,
                    projection:{
                        __v : 0,
                        email_token_verification : 0,
                        email_token_verification_time : 0,
                        reset_password_token : 0,
                        resset_password_token_time : 0
                    }
                }
            )

            return res.status(201).json({
                message : 'Success update profile',
                data : updateImage?.profile
            })
        } catch (error: any) {
            next(error)
        }
    }
}