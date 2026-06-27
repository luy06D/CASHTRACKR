"use server"

import { ErrorResponseSchema, ForgotPasswordSchema, SuccessSchema } from "@/src/schemas"
import { email, success } from "zod"

type ActionStateType = {
    errors : string[],
    success : string  
}


export async function forgotPassword(prevState : ActionStateType , formData: FormData) {

    const forgotPassword = ForgotPasswordSchema.safeParse({
        email : formData.get('email')
    })

    // Erros validations 
    if(!forgotPassword.success){
        const errors = forgotPassword.error.issues.map(issue => issue.message)
        return {
            errors,
            success: ''
        }
    }

    //Enviar el email -- 
    const url = `${process.env.API_URL}/auth/forgot-password`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            email: forgotPassword.data.email
        })
    })

    const json = await req.json()

    if(req.status == 402){
        const {error} = ErrorResponseSchema.parse(json)
        return{
            errors : [error],
            success : ''
        }
    }

    // Success Validations 
    const success = SuccessSchema.parse(json)
    return {
        errors : [],
        success
    }
    



}