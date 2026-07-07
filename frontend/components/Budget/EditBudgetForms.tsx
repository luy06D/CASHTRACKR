"use client"
import { Budget } from "@/src/schemas"
import BudgetForms from "./BudgetForms"
import { useFormState } from "react-dom"
import { EditBudgets } from "@/actions/edit-budget-forms"
import ErrorMessage from "../ui/ErrorMessage"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function EditBudgetForms({budgets}: {budgets: Budget}) {
    const router = useRouter()
    const getIdEditBudgets = EditBudgets.bind(null, budgets.id)
    const [state , dispatch] = useFormState(getIdEditBudgets, {
    errors: [],
    success: ''
 })

 useEffect(() => {
    if(state.success){
        toast.success(state.success)
        router.push('/admin')
    }
 }, [state])
 
return (
        <form
          className="mt-4 space-y-3"
          noValidate
          action={dispatch}
        >
          <BudgetForms
            budgets = {budgets}
          />
          {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}

          <input
            type="submit"
            className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
            value='Editar Presupuesto'
          />
        </form>
  )
}
