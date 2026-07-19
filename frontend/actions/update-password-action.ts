"use server"

import getToken from "@/src/auth/token"
import { ErrorResponseSchema, SuccessSchema, UpdatePasswordSchema } from "@/src/schemas"


type ActionStateType = {
    errors: string[],
    success: string
}

export async function UpdatePassword(prevState : ActionStateType, formData: FormData) {
    

    // Validation Schema
    const dataPasswords = UpdatePasswordSchema.safeParse({
        current_password: formData.get('current_password'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    })

    if(!dataPasswords.success){
        const errors = dataPasswords.error.issues.map(issue => issue.message)
        return{
            errors,
            success: prevState.success
        }
    }

    //API - Update Password
    const token = getToken()
    const url = `${process.env.API_URL}/auth/update-password`
    const req = await fetch(url , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer, ${token}` 
        },
        body: JSON.stringify({
            current_password: dataPasswords.data.current_password,
            password : dataPasswords.data.password
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