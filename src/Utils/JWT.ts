import * as jwt from 'jsonwebtoken'
import { getEnvironment } from '../Environment/environment'
import { Redis } from './Redis'

export class JWT {
    static jwtSign(payload: Object, user_id: any) {
        return jwt.sign(
            payload,
            getEnvironment().jwt_secret_key,
            {
                expiresIn : '1d',
                audience : user_id.toString()
            }
        )
    }

    static jwtVerify(token: any){
        return new Promise ((resolve, reject) => {
            jwt.verify(token, getEnvironment().jwt_secret_key, (err: any, decode: any) => {
                if(err){
                    reject(err)
                }else if (!decode) {
                    reject(new Error('User unauthorised'))
                }else{
                    resolve (decode)
                }
            })
        })
    }

    static async jwtSignRefreshToken (
        payload: Object,
        user_id : any,
        redis_ex: number = 365 * 24 * 60 * 60
    ){
        try {
            const refreshToken = jwt.sign(
                payload,
                getEnvironment().jwt_secret_key,
                {
                    expiresIn : '1y',
                    audience : user_id.toString()
                }
            )

            //set redis refreshToken
            await Redis.setValue(user_id.toString(), refreshToken, redis_ex)
            return refreshToken
        } catch (error: any) {
            throw(error)
        }
    }

    static jwtVerifyRefreshToken (refreshToken : string) {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, getEnvironment().jwt_secret_key, (err: any, decode: any) => {
                if(err) reject (err)
                else if(!decode) reject(new Error('User unauthorised'))
                else {
                    const user: any = decode;
                    Redis.getValue(user.aud).then(value => {
                        if(value === refreshToken) resolve(decode)
                        else reject(new Error('Session Expired'))
                    }).catch((err) => {
                        reject(err)
                    })
                }
            })
        })
    }
}