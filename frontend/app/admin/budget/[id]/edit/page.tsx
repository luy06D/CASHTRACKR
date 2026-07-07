import EditBudgetForms from "@/components/Budget/EditBudgetForms"
import { getBudget } from "@/src/services/budgets"
import Link from "next/link"


//generateMetadata agrega title para pagina con routing dinamico
export async function generateMetadata({params}: {params : {id: string}}) {
  const budget = await getBudget(params.id)
  return{
    title: `CashTrackr - ${budget.name}`,
    description: `CashTrackr - ${budget.name}`
  }
  
}


export default async function budgetEditPage({params}: {params : {id: string}}) {

    const { id } = params
    const budgets = await getBudget(id)

  return (
        <>
      <div className='flex flex-col-reverse md:flex-row md:justify-between items-center'>
        <div className='w-full md:w-auto'>
          <h1 className='font-black text-4xl text-purple-950 my-5'>
            Editar Presupuesto: {budgets.name}   
          </h1>
          <p className="text-xl font-bold">Llena el formulario y crea un nuevo {''}
            <span className="text-amber-500">presupuesto</span>
          </p>
        </div>
        <Link
          href={'/admin'}
          className='bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center'
        >
          Volver
        </Link>
      </div>
      <div className='p-10 mt-10  shadow-lg border '>
        <EditBudgetForms
          budgets = {budgets}
        />

      </div>
    </>
  )
}
