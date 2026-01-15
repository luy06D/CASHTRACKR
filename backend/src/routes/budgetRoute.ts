import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { hasAccess, validateBudgetErrors, validateBudgetExist, validateBudgetId } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseErrors, validateExpenseExist } from "../middleware/expense";
import { authenticate } from "../middleware/auth";

const router = Router()

router.use(authenticate) // EL user tiene que autenticarse

// EJEECUTAR CADA QUE TENGAMOS UN ENDPOINT CON UN PARAMETRO budgetId
router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExist)
router.param('budgetId', hasAccess)

router.param('expenseId', validateBudgetId)
router.param('expenseId', validateExpenseExist)


/** ROUTES - BUDGET */

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

router.put('/:budgetId/expenses/:expenseId', 
    validateExpenseErrors,
    handleInputErrors,
    ExpensesController.updateById)

router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)




export default router