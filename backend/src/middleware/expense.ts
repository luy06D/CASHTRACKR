import { Request, Response, NextFunction } from 'express'
import { param, validationResult, body, ExpressValidator} from 'express-validator'
import Expense from '../models/Expense'

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}


export const validateExpenseErrors = async (req: Request, res: Response, next: NextFunction) => {

   await body('name')
            .notEmpty().withMessage('El nombre del gasto no puede ir vacio').run(req)
   await body('amount')
            .notEmpty().withMessage('El cantidad del gasto no puede ir vacio')
            .isNumeric().withMessage('Ingrese numeros validos')
            .custom(value => value > 0).withMessage('Ingrese numeros mayores a 0').run(req)
    next()

}

export const validateExpenseExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
            const { expenseId } = req.params
            const expense = await Expense.findByPk(expenseId) // filtrado por id

            if (!expense) {
                const error = new Error('Gasto no encontrado')
                return res.status(404).json({ error: error.message })
            }
            req.expense = expense
            next()

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })

        }
   
}