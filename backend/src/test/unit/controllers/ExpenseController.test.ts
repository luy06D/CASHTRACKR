import { createRequest, createResponse } from "node-mocks-http";
import { ExpensesController } from "../../../controllers/ExpenseController";
import Expense from "../../../models/Expense";



jest.mock('../../../models/Expense', () => ({ 
    create: jest.fn()
  
}))

describe('ExpenseController - create', () => {
    it('should return expense save corretc', async () => {

        const expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        };

        (Expense.create as jest.Mock).mockResolvedValue(expenseMock)

        const req = createRequest({
            method: 'POST',
            url: 'api/budgets/:budgetId/expenses',
            body: {name: 'prueba gasto', amount: 500 },
            budget: {id: 1 }
        })

        const res = createResponse();
        await ExpensesController.create(req, res)
        const data = res._getJSONData();


        expect(res.statusCode).toBe(201)
        expect(data).toEqual('Gasto agregado correctamente')
        expect(expenseMock.save).toHaveBeenCalled()
        expect(expenseMock.save).toHaveBeenCalledTimes(1)
        expect(Expense.create).toHaveBeenLastCalledWith(req.body)
        
        

    })


     it('should handle expense creation error', async () => {

        const expenseMock = {
            save: jest.fn().mockResolvedValue(false)
        };

        (Expense.create as jest.Mock).mockRejectedValue(new Error)

        const req = createRequest({
            method: 'POST',
            url: 'api/budgets/:budgetId/expenses',
            body: {name: 'prueba gasto', amount: 500 },
            budget: {id: 1 }
        })

        const res = createResponse();
        await ExpensesController.create(req, res)
        const data = res._getJSONData();


        expect(res.statusCode).toBe(500)
        expect(data).toEqual({ error: 'Hubo un error' })
        expect(expenseMock.save).not.toHaveBeenCalled()
        

    })
})