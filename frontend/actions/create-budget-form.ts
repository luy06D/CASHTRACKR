"use server"

import getToken from "@/src/auth/token"
import { DraftBudgetSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"



type ActionStateType = {
    errors : string[],
    success : string
    
}

export async function CreateBudgets(prevState: ActionStateType , formData: FormData) {
    
    const dataBudget = {
        name  : formData.get('name'),
        amount : formData.get('amount')
    }

    // Validaciones Schema
    const createBudget = DraftBudgetSchema.safeParse(dataBudget)
    if(!createBudget.success){
        const errors = createBudget.error.issues.map(issue => issue.message)
        return{
            errors,
            success: prevState.success
        }
    }

    // Registrar un budget
     const token = getToken()
    const url = `${process.env.API_URL}/budgets`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
             'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
            name : createBudget.data.name,
            amount : createBudget.data.amount
        })
    })

    const json = await req.json()

    if(!req.ok){
        const {error} = ErrorResponseSchema.parse(json)
        return{
            errors: [error],
            success : ''
        }
    }

    const success = SuccessSchema.parse(json)

    return{
        errors: [],
        success
    }
}