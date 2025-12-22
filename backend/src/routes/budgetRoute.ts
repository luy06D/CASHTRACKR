import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetErrors, validateBudgetExist, validateBudgetId } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseErrors } from "../middleware/expense";

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


/** ROUTES - EXPENSE */

router.post('/:budgetId/expenses',
    validateExpenseErrors,
    handleInputErrors,
    ExpensesController.create)

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)
router.put('/:budgetId/expenses/:expenseId', ExpensesController.updateById)
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)




export default router