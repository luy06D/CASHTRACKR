"use server"

import { ErrorResponseSchema, ResetPasswordSchema, SuccessSchema } from "@/src/schemas"
import { success } from "zod"


type ActionStateType = {
    errors: string[]
    success: string
}

export async function ResetPassword(token: string ,prevState: ActionStateType, formData: FormData) {

    const dataPassword = {
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    // validar los password
    const validPasssword = ResetPasswordSchema.safeParse(dataPassword)
    if (!validPasssword.success) {
        const errors = validPasssword.error.issues.map(issue => issue.message)
        return {
            errors,
            success: ''
        }
    }

    // validar los passwords
    const url = `${process.env.API_URL}/auth/reset-password/${token}`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            password: validPasssword.data.password
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
    return {
        errors: [],
        success
    }

}