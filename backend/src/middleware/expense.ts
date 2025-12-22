import { Request, Response, NextFunction } from 'express'
import { param, validationResult, body} from 'express-validator'


export const validateExpenseErrors = async (req: Request, res: Response, next: NextFunction) => {

   await body('name')
            .notEmpty().withMessage('El nombre del gasto no puede ir vacio').run(req)
   await body('amount')
            .notEmpty().withMessage('El cantidad del gasto no puede ir vacio')
            .isNumeric().withMessage('Ingrese numeros validos')
            .custom(value => value > 0).withMessage('Ingrese numeros mayores a 0').run(req)
    next()

}