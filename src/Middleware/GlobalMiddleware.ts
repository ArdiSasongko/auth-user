import { NextFunction, Request, Response } from "express";
import * as httpStatus from 'http-status'
import { JWT } from "../Utils/JWT";

export class GlobalMiddleware {
    static async authValidator(req : any, res : Response, next : NextFunction){
        let token 
        let authHeader = req.headers.authorization

        try {
            if(authHeader && authHeader.startsWith('Bearer')) {
                token = authHeader.split(' ')[1]

                if(!token){
                    res.status(401)
                    next(new Error('User doesnt exist'))
                }

                const decode = await JWT.jwtVerify(token)
                req.user = decode
                next()
            }else {
                res.status(404)
                next(new Error('Need Token Headers'))
            }
        } catch (error: any) {
            req.errorStatus = 401;
            next(new Error('User doesnt exist'));
        }   
    }
}