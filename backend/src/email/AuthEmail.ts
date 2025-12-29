import { transport } from "../config/nodemailer"

type EmailType =  {
    name: string
    email: string
    token : string
}


export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from : 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'CashTrackr - Confirma tu cuenta',
            html: `<p>Hola_ ${user.name}, has creado tu cuenta de Cashtrackr, ya casi esta lista</p>
                <p>Visita el siguiente enlace:</p>
                <a href="#" >Confirma tu cuenta</a>
                <p>e ingresa el codigo:<b>${user.token}</b></p>
            
            `
        }) 

        console.log(email);
        
        
    }
}