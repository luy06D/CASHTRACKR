"use server"

import getToken from "@/src/auth/token"
import { Budget, DraftBudgetSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"
import { success } from "zod"

type ActionStateType = {
    errors : string[],
    success : string
}

export async function EditBudgets(budgetId: Budget['id'] , prevState: ActionStateType , formData: FormData) {
    const dataBudget = {
        name: formData.get('name'),
        amount : formData.get('amount')
    }

    // Validaciones Schema
    const editBudget = DraftBudgetSchema.safeParse(dataBudget)
    if(!editBudget.success){
        const errors = editBudget.error.issues.map(issue => issue.message)
        return{
            errors,
            success: prevState.success
        }
    }

    // Edit Budget
    const token = getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':  `Bearer ${token}`
        },
        body: JSON.stringify({
            name: editBudget.data.name,
            amount  : editBudget.data.amount
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

    revalidatePath('/admin') // elimina el cache , para mostrar data actualizada

    const success = SuccessSchema.parse(json)

     return{
        errors: [],
        success
    }



}