import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { Utils } from './Utils/Utils'
import mongoose from 'mongoose'
import { getEnvironment } from './Environment/environment'
import authRouter from './Router/authRouter'
import userRouter from './Router/userRouter'

export class Server {

    public app : express.Application = express()

    constructor(){
        this.setConfig()
        this.setRouter()
        this.setNoRouter()
        this.setErrorHandler()
    }

    setConfig(){
        this.setDotenv()
        this.setDB()
        this.setCors()
        this.setBodyParser()
    }

    setDotenv(){
        Utils.dotenv()
    }

    setDB(){
        mongoose.connect(getEnvironment().database)
        .then(()=> {
            console.log('Database connected...')
        }).catch((err) => {
            console.log(err.message)
        })
    }

    setCors(){
        this.app.use(cors())
    }

    setBodyParser(){
        this.app.use(bodyParser.urlencoded({ extended : true }))
    }

    setRouter(){
        this.app.use('/api/auth', authRouter)
        this.app.use('/api/user', userRouter)
    }

    setNoRouter(){
        this.app.use((req: any, res: any, next: any) => {
            res.status(404).json({
                statusCode : 404,
                message : 'Route_Not_Found'
            })
        })
    }

    setErrorHandler(){
        this.app.use((error: any, req: any, res: any, next: any) => {
            const errorStatus = req.errorStatus || 500
            res.status(errorStatus).json({
                statusCode : errorStatus,
                message : error.message || "Something wrong, please try again"
            })
        })
    }
}