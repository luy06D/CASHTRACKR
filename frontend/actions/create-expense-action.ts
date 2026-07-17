"use server"

import getToken from "@/src/auth/token"
import {DraftExpenseSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"


type ActionStateType = {
    errors : string[],
    success : string
    
}

export async function CreateExpenses(idBudget: number , prevState : ActionStateType, formData : FormData) {

    const ExpensesData = {
        name : formData.get('name'),
        amount : formData.get('amount')
    }

    // Validaciones Schema 
    const createExpense = DraftExpenseSchema.safeParse(ExpensesData)
    if(!createExpense.success){
        const errors = createExpense.error.issues.map(issue => issue.message)
        return{
            errors,
            success: prevState.success
        }
    }

    //Registar expenses
    const token = getToken()
    const url = `${process.env.API_URL}/budgets/${idBudget}/expenses`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
           body: JSON.stringify({
            name : createExpense.data.name,
            amount : createExpense.data.amount
        })
    })

    const json = await req.json()

    if(!req.ok){
        const {error} = ErrorResponseSchema.parse(json)
        return{
            errors : [error],
            success : ''
        }
    }
    // invalidar la caché de la ruta y generar con los datos más recientes. 
    revalidatePath(`admin/budget/${idBudget}`)
    const success = SuccessSchema.parse(json)
    return{
        errors : [],
        success
    }
    
}