import { EnvironmentDev } from "./environment.dev"
import { EnvironmentProd } from "./environment.prod"


export interface Environment{
    database? : string
    jwt_secret_key? : string
    mailjet?:{
        api_key?: string,
        secret_key?: string,
        email_from?: string
    },
    redis?:{
        host?: string,
        port?: number,
        password?: string
    }
}

export function getEnvironment(): any{
    if(process.env.NODE_ENV === 'production'){
        return EnvironmentProd
    } 
    return EnvironmentDev
}