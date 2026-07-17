"use client"

import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpensesForm";
import { useFormState } from "react-dom";
import { CreateExpenses } from "@/actions/create-expense-action";
import ErrorMessage from "../ui/ErrorMessage";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
  

export default function AddExpenseForm({closeModal}: {closeModal: () => void}) {
    const params = useParams()

    const CreateExpensesWithId = CreateExpenses.bind(null, +params.id)
    const [state, dispatch] = useFormState(CreateExpensesWithId, {
        errors : [],
        success : ''
    })

    useEffect(() => {
      if(state.success){
        toast.success(state.success)
        closeModal()
        //router.push(`/admin/budget/${params.id}`)
      }
    }, [state])

    
  return (
    <>
      <DialogTitle
        as="h3"
        className="font-black text  -4xl text-purple-950 my-5"
      >
        Agregar Gasto
      </DialogTitle>

      <p className="text-xl font-bold">Llena el formulario y crea un {''}
        <span className="text-amber-500">gasto</span>
      </p>
      <form
        className="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
        noValidate
        action={dispatch}
      >
        <ExpenseForm/>
        {state.errors.map(error=> <ErrorMessage key={error}>{error}</ErrorMessage>)}
        <input
          type="submit"
          className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors mt-3"
          value='Registrar Gasto'
        />
      </form>
    </>
  )
}