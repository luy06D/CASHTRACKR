"use server"

import getToken from "@/src/auth/token"
import { Budget, ErrorResponseSchema, PasswordValidationSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"


type ActionStateType = {
    errors : string[],
    success : string
}

export async function confirmDeleteBudget(budgetId : Budget['id'] ,prevState : ActionStateType, formData: FormData) {
    
    const validatePassword = PasswordValidationSchema.safeParse(formData.get('password'))
    if(!validatePassword.success){
        const errors = validatePassword.error.issues.map(issue => issue.message)
        return{
            errors,
            success: ''
        }
    }

    // Validar el password 
    const token = getToken()
    const checkPasswordUrl = `${process.env.API_URL}/auth/check-password`
    const checkPasswordReq = await fetch(checkPasswordUrl, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            password : validatePassword.data
        })        
    })

    const checkPasswordJson = await checkPasswordReq.json()
    if(!checkPasswordReq.ok){
        const {error} = ErrorResponseSchema.parse(checkPasswordJson)
        return{
            errors: [error],
            success: prevState.success
        }
    }  
    
    // Eliminar Presupuesto 
    const deleteBudgetUrl = `${process.env.API_URL}/budgets/${budgetId}`
    const deleteBudgetReq = await fetch(deleteBudgetUrl, {
        method: 'DELETE',
        headers: {
            'Authorization' : `Bearer ${token}`
        }     
    })

    const deleteBudgetJson = await deleteBudgetReq.json()
    if(!deleteBudgetReq.ok){
        const {error} = ErrorResponseSchema.parse(deleteBudgetJson)
        return{
            errors: [error],
            success: ''
        }
    }  

    revalidatePath('/admin')

    const success = SuccessSchema.parse(deleteBudgetJson)

    return {
        errors : [],
        success
    }
}