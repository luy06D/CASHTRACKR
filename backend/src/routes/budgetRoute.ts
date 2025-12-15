import { Router } from "express";
import { body, param } from 'express-validator'
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.get('/', BudgetController.getAll)

router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre del presupuesto no puede ir vacio'),
    body('amount')
        .notEmpty().withMessage('El cantidad del presupuesto no puede ir vacio')
        .isNumeric().withMessage('Ingrese numeros validos')
        .custom(value => value > 0).withMessage('Ingrese numeros mayores a 0'),
    handleInputErrors,
    BudgetController.create)

router.get('/:id',
    param('id').isInt().withMessage('ID no valido')
        .custom(value => value > 0).withMessage('ID no valido'),
    handleInputErrors,

    BudgetController.getById)

router.put('/:id',
    param('id').isInt().withMessage('ID no valido')
        .custom(value => value > 0).withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre del presupuesto no puede ir vacio'),
    body('amount')
        .notEmpty().withMessage('El cantidad del presupuesto no puede ir vacio')
        .isNumeric().withMessage('Ingrese numeros validos')
        .custom(value => value > 0).withMessage('Ingrese numeros mayores a 0'),

    handleInputErrors,
    BudgetController.updateById)

router.delete('/:id',
    param('id').isInt().withMessage('ID no valido')
        .custom(value => value > 0).withMessage('ID no valido'),
    handleInputErrors,

    BudgetController.deleteById)


export default router