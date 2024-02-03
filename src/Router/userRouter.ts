import { Router } from "express";
import { authController } from "../Controller/authController";
import { GlobalMiddleware } from "../Middleware/GlobalMiddleware";
import { userController } from "../Controller/userController";

class userRouter {

    public router = Router()

    constructor(){
        this.router = Router()
        this.get()
        this.post()
        this.patch()
    }

    get(){
        this.router.get('/', (req,res)=>{
            res.status(200).send('Auth Router response success')
        })
        this.router.get('/resend/email/otp', GlobalMiddleware.authValidator, userController.resendOTP)
        this.router.get('/profile', GlobalMiddleware.authValidator, GlobalMiddleware.emailVerified, userController.getMe)
    }

    post(){
        this.router.post('/verify/email', GlobalMiddleware.authValidator, userController.verifyEmail)
        this.router.post('/reset/password', userController.OTP_reset_password)
    }

    patch(){
        this.router.patch('/update/password', userController.updatePassword)
    }
}

export default new userRouter().router