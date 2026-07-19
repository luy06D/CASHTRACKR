"use server"

import getToken from "@/src/auth/token"
import { ProfileFormSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType = {
    errors: string[],
    success : string
}


export async function updateUser(prevState: ActionStateType , formData : FormData) {
    
    const userData = ProfileFormSchema.safeParse({
        name : formData.get('name'),
        email : formData.get('email')
    })

    if(!userData.success){
        const errors = userData.error.issues.map(issue => issue.message)
        return{
            errors,
            success: prevState.success
        }
    }

    // API - update user 
    const token = getToken()
    const url = `${process.env.API_URL}/auth/user`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer, ${token}` 
        },
        body: JSON.stringify({
            name : userData.data.name,
            email : userData.data.email
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
    revalidatePath('/admin/profile/settings')
    return{
        errors: [],
        success
    }
}