"use server"

import getToken from "@/src/auth/token"
import { Budget, DraftExpenseSchema, ErrorResponseSchema, Expense, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"


type BudgetAndExpenseIdType = {
    budgetId : Budget['id']
    expenseId: Expense['id']
}
type ActionStateType = {
    errors: string[],
    success: string
}

export async function EditExpense({budgetId , expenseId}: BudgetAndExpenseIdType , prevState: ActionStateType, formData: FormData) {

    const dataExpense = {
        name: formData.get('name'),
        amount: formData.get('amount')
    }

    // Validacion Schema 
    const editExpense = DraftExpenseSchema.safeParse(dataExpense)
    if(!editExpense.success){
        const errors = editExpense.error.issues.map(issue => issue.message)
        return{
            errors,
            success: prevState.success
        }
    }

    // API - Edit Expenses
    const token = getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`
    const req = await fetch(url, {
        method : 'PUT',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body : JSON.stringify({
            name : editExpense.data.name,
            amount : editExpense.data.amount
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
    revalidatePath(`/admin/budget/${budgetId}`)
    const success = SuccessSchema.parse(json)
    return {
        errors: [],
        success
    }

}