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
    }

    get(){
        this.router.get('/', (req,res)=>{
            res.status(200).send('Auth Router response success')
        })
        this.router.get('/profile', GlobalMiddleware.authValidator, userController.getMe)
    }

    post(){

    }
}

export default new userRouter().router