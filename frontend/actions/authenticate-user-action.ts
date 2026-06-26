"use server"

import { ErrorResponseSchema, LoginSchema } from "@/src/schemas"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { email } from "zod"

type ActionStateType = {
    errors : string[]
    
}

export async function authenticate(prevState: ActionStateType , formData: FormData){


    const dataCredentials = {
        email: formData.get('email'),
        password : formData.get('password')
    }

    //validaciones 
    const login = LoginSchema.safeParse(dataCredentials)
    console.log(login)
    if(!login.success){
        const errors = login.error._zod.def.map(error => error.message)
        return {
            errors,
          //  success: prevState.success
        }
        
    }

    //Autenticar usuario
    const url = `${process.env.API_URL}/auth/login`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: login.data.email,
            password: login.data.password
        })
    })

    const json = await req.json()

    if(!req.ok){
        const {error} = ErrorResponseSchema.parse(json)
        return{
            errors: [error]
        }
    }

    //Setear cookies 
    
    cookies().set({
        name: 'CASHTRAKER_TOKEN',
        value: json,
        httpOnly: true,
        path: '/'
    })

    redirect('/admin')

}