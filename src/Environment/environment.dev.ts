import { Utils } from "../Utils/Utils";
import { Environment } from "./environment";
Utils.dotenv()

export const EnvironmentDev : Environment = {
    database : process.env.DATABASE_DEV,
    jwt_secret_key : process.env.JWT_SECRET_KEY_DEV,
    mailjet:{
        api_key : process.env.MAILJET_API_DEV,
        secret_key : process.env.MAILJET_SECRET_DEV,
        email_from : process.env.EMAIL_FROM_DEV
    },
    redis:{
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    }
}