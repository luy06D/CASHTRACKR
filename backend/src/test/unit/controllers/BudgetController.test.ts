import { createRequest, createResponse } from 'node-mocks-http'
import { budgets } from "../../mocks/budgets"
import { BudgetController } from '../../../controllers/BudgetController'
import Budget from '../../../models/Budget'
import Expense from '../../../models/Expense'


jest.mock('../../../models/Budget', () => ({
    findAll: jest.fn(), // funcion para filtrar todos 
    create: jest.fn(), // funcion create para registrar
    findByPk: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    destroy: jest.fn()
}))


describe('BudgetController.getAll', () => {

    beforeEach(() => {
        (Budget.findAll as jest.Mock).mockReset();
        (Budget.findAll as jest.Mock).mockImplementation((options) => {
            const updateBudgets = budgets.filter(budget => budget.userId === options.where.userId);
            return Promise.resolve(updateBudgets)
        })

    })

    it('should retrieve 2 budgets for user with ID 1', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 1 }

        })

        const res = createResponse();
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()
        expect(data).toHaveLength(2)
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)

    })


    it('should retrieve 1 budgets for user with ID 2', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 2 }

        })

        const res = createResponse();
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()
        expect(data).toHaveLength(1)
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)

    })


    it('should retrieve 0 budgets for user with ID 10', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 10 }

        })

        const res = createResponse();
        await BudgetController.getAll(req, res)

        const data = res._getJSONData()
        expect(data).toHaveLength(0)
        expect(res.statusCode).toBe(200)
        expect(res.status).not.toBe(404)

    })



    it('should handle errors when feching budgets', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 100 }

        })

        const res = createResponse();
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
        await BudgetController.getAll(req, res)

        expect(res.statusCode).toBe(500)
        expect(res._getJSONData()).toStrictEqual({ error: 'Hubo un error' })


    })


})


describe('BudgetController.create', () => {

    it('Should create a new budget and respond with statusCode 201', async () => {

        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        };

        (Budget.create as jest.Mock).mockResolvedValue(mockBudget)
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: { id: 1 },
            body: { name: 'Presupuesto prueba', amount: 10000 }
        })

        const res = createResponse();
        await BudgetController.create(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(201)
        expect(data).toBe('Presupuesto registrado correctamente')
        expect(mockBudget.save).toHaveBeenCalled()
        expect(mockBudget.save).toHaveBeenCalledTimes(1) // solo se manda llamar una vez 
    })

    it('Should create a new budget and respond with statusCode 500', async () => {

        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        };

        (Budget.create as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: { id: 1 },
            body: { name: 'Presupuesto prueba', amount: 10000 }
        })

        const res = createResponse();
        await BudgetController.create(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(500)
        expect(data).toEqual({ error: 'Hubo un error' })
        expect(mockBudget.save).not.toHaveBeenCalled()
        expect(Budget.create).toHaveBeenCalledWith(req.body)

    })
})

describe('BudgetController.getById', () => {

    beforeEach(() => {
        (Budget.findByPk as jest.Mock).mockImplementation((id) => {
            console.log(id);

            const budget = budgets.filter(b => b.id === id)[0]
            return Promise.resolve(budget)
        })
    })

    it('shoult return a budget with ID 1 and 3 expenses', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: { id: 1 }
        })

        const res = createResponse()
        await BudgetController.getById(req, res)

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200)
        expect(data.expenses).toHaveLength(3)
        expect(Budget.findByPk).toHaveBeenCalled()
        expect(Budget.findByPk).toHaveBeenCalledTimes(1)
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
            include: [Expense]
        })
    })
})

describe('BudgetController.updateById', () => {

    it('should update the budget and return success message', async () => {

        const mockBudget = {
            update: jest.fn().mockResolvedValue(true)
        };

        (Budget.update as jest.Mock).mockResolvedValue(mockBudget)
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId',
            budget: mockBudget,
            body: { name: 'Presupuesto prueba', amount: 10000 }
        })

        const res = createResponse();
        await BudgetController.updateById(req, res)

        const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toBe('Presupuesto actualizado correctamente')
        expect(mockBudget.update).toHaveBeenCalled()
        expect(mockBudget.update).toHaveBeenCalledTimes(1)
        expect(mockBudget.update).toHaveBeenCalledWith(req.body)
    })
})


describe('BudgetController.deleteById', () => {

    const mockBudget = {
        destroy: jest.fn().mockResolvedValue(true)
    };
    (Budget.destroy as jest.Mock).mockResolvedValue(mockBudget)
    it('should delete the budget return success message', async () => {

        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId',
            budget: mockBudget,
        })

        const res = createResponse();
        await BudgetController.deleteById(req, res);

         const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toBe('Presupuesto eliminado correctamente')
        expect(mockBudget.destroy).toHaveBeenCalled()
        expect(mockBudget.destroy).toHaveBeenCalledTimes(1)
    })
})