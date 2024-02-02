import * as Bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

export class Utils {
    public MAX_TIME_TOKEN = (5 * 60 * 1000)
    
    static dotenv() {
        dotenv.config({ path : '.env'})
    }

    static generatedOTP(digit: number = 6) {
        let otp:string = ''
        for(let i = 0; i < digit; i++){
            otp += Math.floor(Math.random() * 10)
        }
        return otp
    }

    static hashPassword (password : string) {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 12, (err, hash)  => {
                if(err){
                    reject(err)
                }else{
                    resolve(hash)
                }
            })
        })
    }

    static comparePassword (password : string, hashpassword : string): Promise<any> {
        return new Promise((resolve, reject) => {
            Bcrypt.compare(password, hashpassword, (err, same) => {
                if(err){
                    reject(err)
                }else if(!same){
                    reject(new Error("Password Invalid"))
                }else{
                    resolve(true)
                }
            })
        })
    }
}
