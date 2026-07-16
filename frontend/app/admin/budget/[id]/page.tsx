import AddExpenseButton from "@/components/expenses/AddExpenseButton"
import ModalContainer from "@/components/ui/ModalContainer"
import { getBudget } from "@/src/services/budgets"


export default async function BudgetsDetailsPage({ params }: { params: { id: string } }) {

  const budget = await getBudget(params.id)

  return (
    <>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className="font-black text-4xl text-purple-950">{budget.name}</h1>
          <p className="text-xl font-bold">Administra tus {''} <span className="text-amber-500">gastos</span></p>
        </div>

        <AddExpenseButton/>
      </div>
      <ModalContainer/>
    </>
  )
}
