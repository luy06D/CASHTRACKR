import { Budget } from '@/src/schemas'
import React from 'react'

export default function BudgetForms({budgets}: {budgets?: Budget}) {
    return (
        <>
            <div className="space-y-3">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre Presupuesto
                </label>
                <input
                    id="name"
                    className="w-full p-3  border border-gray-100 bg-slate-100"
                    type="text"
                    placeholder="Nombre del Presupuesto"
                    name="name"
                    defaultValue={budgets?.name}
                />
            </div>
            <div className="space-y-3 mt-3">
                <label htmlFor="amount" className="text-sm uppercase font-bold">
                    Cantidad Presupuesto
                </label>
                <input
                    type="number"
                    id="amount"
                    className="w-full p-3  border border-gray-100 bg-slate-100"
                    placeholder="Cantidad Presupuesto"
                    name="amount"
                    defaultValue={budgets?.amount}
                />
            </div>
        </>
    )
}
