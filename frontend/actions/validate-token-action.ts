"use server"

import { ErrorResponseSchema, SuccessSchema, TokenSchema } from "@/src/schemas"

type ActionStateType = {
    errors : string[],
    success : string
}

export async function ValidateToken ( token : string , prevState : ActionStateType){

    // Validar el formato del token 
    const resetPasswordToken = TokenSchema.safeParse(token)
    if(!resetPasswordToken.success){
        return{
            errors: resetPasswordToken.error.issues.map(issue => issue.message),
            success: ''
        }
    }

       // validar el token
    const url = `${process.env.API_URL}/auth/validate-token`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: resetPasswordToken.data
        })
    })

    const json = await req.json()

    if(!req.ok){
        const {error} = ErrorResponseSchema.parse(json)
        return{
            errors: [error],
            success: ''
        }

    }

    const success = SuccessSchema.parse(json)
    return{
        errors : [],
        success 
    }

}