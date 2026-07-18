"use client"

import { CreateBudgets } from "@/actions/create-budget-form"
import { useFormState } from "react-dom"
import ErrorMessage from "../ui/ErrorMessage"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import BudgetForms from "./BudgetForms"

export default function CreateBudgetForm() {
  const router = useRouter()
  const [state, dispatch] = useFormState(CreateBudgets, {
      errors : [],
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
      <BudgetForms/>
      {state.errors.map(error => <ErrorMessage>{error}</ErrorMessage>)}
      <input
        type="submit"
        className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
        value='Crear Presupuesto'
      />
    </form>
  )
}