import * as mailjet from 'node-mailjet'
import { getEnvironment } from '../Environment/environment'

export class Mailjet {
    private static client = new mailjet.Client({
        apiKey: getEnvironment().mailjet.api_key,
        apiSecret: getEnvironment().mailjet.secret_key,
    })

    static sendMail(data : { to : [string], subject : string, html : string}) : Promise<any> {
        return Mailjet.client.post('send', { version : 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: getEnvironment().mailjet.email_from,
                        },
                        To: data.to.map((email) => ({ Email: email })),
                        Subject: data.subject,
                        HTMLPart: data.html,
                    },
                ],
            })
    }
}