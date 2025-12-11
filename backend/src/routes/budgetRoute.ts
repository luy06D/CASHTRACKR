import { Router } from "express";
import { body } from 'express-validator'
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.get('/', BudgetController.getAll)

router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre del presupuesto no puede ir vacio'),
    body('amout')
        .notEmpty().withMessage('El cantidad del presupuesto no puede ir vacio'),
    handleInputErrors,
    BudgetController.create)

router.get('/:id', BudgetController.getById)

router.put('/:id', BudgetController.updateById)

router.delete('/:id', BudgetController.deleteById)



export default router