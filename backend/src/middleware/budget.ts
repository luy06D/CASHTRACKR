import { Request, Response, NextFunction } from 'express'
import { param, validationResult } from 'express-validator'
import Budget from '../models/Budget'


export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {

    await param('id').isInt().withMessage('ID no valido')
        .custom(value => value > 0).withMessage('ID no valido').run(req)

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()

}

export const validateBudgetExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
            const { id } = req.params
            const budget = await Budget.findByPk(id) // filtrado por id

            if (!budget) {
                const error = new Error('Presupuesto no encontrado ')
                return res.status(404).json({ error: error.message })
            }
            req.budget = budget
            next()
            
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })

        }
   

}