import * as jwt from 'jsonwebtoken'
import { getEnvironment } from '../Environment/environment'

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
}