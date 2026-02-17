import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExist } from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";


jest.mock('../../../models/Expense', () => ({
    findByPk: jest.fn(),

}))

describe('EXPENSES Middleware - validateExpenseExist ' , () => {

    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.filter(e => e.id === id)[0] ?? null
            return Promise.resolve(expense)
        }) 
    })
    
    it('should hnadle a non-existent budget', async ()  => {
        
        const req = createRequest({
            params : {expenseId : 120}
        })

        const res = createResponse();
        const next  = jest.fn(); 

        await validateExpenseExist(req, res, next)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(404)
        expect(data).toEqual({error : 'Gasto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    })

})
