import { NextFunction, Request, Response } from "express";
import userModel from "../Model/userModel";

export class userController {
    static async getMe(req: any, res: Response, next: NextFunction){
        const user = req.user
        try {
            const data = await userModel.findById(user.aud)

            if(!data){
                res.status(404)
                next(new Error('user doesnt exist'))
            }

            return res.status(201).json({ data : data})

        } catch (error: any) {
            next(error)
        }
    }
}