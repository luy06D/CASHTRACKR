"use server"

import getToken from "@/src/auth/token"
import { Budget, ErrorResponseSchema, Expense, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type budgetAndExpenseIdType = {
    budgetId : Budget['id']
    expenseId : Expense['id']
}

type ActionStateType = {
    errors : string[]
    success : string
}
export async function deleteExpense({budgetId, expenseId } : budgetAndExpenseIdType,  prevState : ActionStateType ) {

    // API - Delete expenses
    const token = getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`
    const req = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }) 

    const json = await req.json()

    //Validaciones 
    if(!req.ok){
        const {error} = ErrorResponseSchema.parse(json)
        return{
            errors : [error],
            success : ''
        }
    }

    revalidatePath(`/admin/budget/${budgetId}`)
    const success = SuccessSchema.parse(json)
    return{
        errors : [],
        success 
    }
    
}