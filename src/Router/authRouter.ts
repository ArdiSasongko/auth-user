import { Router } from "express";
import { authController } from "../Controller/authController";
import { GlobalMiddleware } from "../Middleware/GlobalMiddleware";

class authRouter {

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
    }

    post(){
        this.router.post('/register', authController.registerUser)
        this.router.post('/login', authController.login)
        this.router.post('/logout', GlobalMiddleware.authValidator, authController.logout)
    }
}

export default new authRouter().router