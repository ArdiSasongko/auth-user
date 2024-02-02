import { Utils } from "../Utils/Utils";
import { Environment } from "./environment";
Utils.dotenv()

export const EnvironmentProd : Environment = {
    database : process.env.DATABASE_PROD,
    jwt_secret_key : process.env.JWT_SECRET_KEY_PROD,
    mailjet:{
        api_key : process.env.MAILJET_API_PROD,
        secret_key : process.env.MAILJET_SECRET_PROD,
        email_from : process.env.EMAIL_FROM_PROD
    }
}