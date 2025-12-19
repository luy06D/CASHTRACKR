import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetErrors, validateBudgetExist, validateBudgetId } from "../middleware/budget";

const router = Router()

// EJEECUTAR CADA QUE TENGAMOS UN ENDPOINT CON UN PARAMETRO budgetId
router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExist)

router.get('/', BudgetController.getAll)

router.post('/',
    validateBudgetErrors,
    handleInputErrors,
    BudgetController.create)

router.get('/:budgetId', BudgetController.getById)

router.put('/:budgetId',
    validateBudgetErrors,
    handleInputErrors,
    BudgetController.updateById)

router.delete('/:budgetId', handleInputErrors, BudgetController.deleteById)


export default router