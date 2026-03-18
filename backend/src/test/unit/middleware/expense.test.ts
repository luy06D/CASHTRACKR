import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExist } from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";
import { budgets } from "../../mocks/budgets";
import { hasAccess } from "../../../middleware/budget";


jest.mock('../../../models/Expense', () => ({
   findByPk: jest.fn(), 
}))

describe('Expenses Middleware - validateExpenseExist', () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.filter(e => e.id === id)[0] ?? null
            return Promise.resolve(expense);
        })
    })

    // Testing a un gasto que no existe... 
    it('should hnadle a non-existent budget', async () => {

        const req = createRequest({
            params: {expenseId : 120}

        })
        
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExist(req, res, next)

        const data = res._getJSONData();
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({error : 'Gasto no encontrado' })
        expect(next).not.toHaveBeenCalled()


    })

    // Test cuando un gasto si existe..
     it('should call next middleware if expenses exists', async () => {

        const req = createRequest({
            params: {expenseId : 1}

        })
        
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExist(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        expect(req.expense).toEqual(expenses[0])

    })

    // Test cuando un gasto si existe..
     it('should handle internal server error', async () => {

        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            params: {expenseId : 1}

        })
        
        const res = createResponse();
        const next = jest.fn();
        await validateExpenseExist(req, res, next)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(500)
        expect(next).not.toHaveBeenCalled()
        expect(data).toEqual({error: 'Hubo un error' })

    })

        // Si un usuario sin autorizacion intenta realizar un gasto..
     it('should prevent unauthorized users from adding expenses', async () => {

        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: budgets[0],
            user: {id: 20},
            body: {name: 'Expenses Test', amount: 3000}

        })
        
        const res = createResponse();
        const next = jest.fn();

        hasAccess(req, res, next)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(401)
        expect(data).toEqual({error: 'Acción no valida' })



       

    })

}) 

