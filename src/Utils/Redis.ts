import { createClient } from "redis";
import { getEnvironment } from "../Environment/environment";

const client = createClient({
    password : getEnvironment().redis.password,
    socket : {
        host : getEnvironment().redis.host,
        port : getEnvironment().redis.port
    }
})

export class Redis {
    static connectedRedis(){
        client.connect().then(() => {
            console.log("Redis connected...");
        }).catch((e: any) => {
            throw(e)
        })
    }

    static async setValue(key: string, value: string, expired_at){
        try {
            let options: any = {}
            if(expired_at) {
                options = {
                    EX: expired_at
                }
            }

            await client.set(key, value, options)
            return
        } catch (error) {
            throw('Server not connected, please try again')
        }
    }

    static async getValue(key: string){
        try {
            const value = await client.get(key)
            return value
        } catch (error) {
            throw('Session expired! please login again')
        }
    }

    static async deleteKey(key : string){
        try {
            await client.del(key)
        } catch (error) {
            throw('Server not connected, please try again')
        }
    }
}