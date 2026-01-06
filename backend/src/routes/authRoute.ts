import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateUserErrors } from "../middleware/Authenticate";
import { handleInputErrors } from "../middleware/validation";
import { body } from "express-validator";
import { limiter } from "../config/limiter";


const router = Router()

// Aplicamos un limite para peticiones en todos los end point
router.use(limiter)

router.post('/create-account',
    validateUserErrors,
    handleInputErrors,
    AuthController.createAccount)

router.post('/confirm-account',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no válida'),
    handleInputErrors,
    AuthController.confirmAccount)

router.post('/login',
    body('email')
        .isEmail().withMessage("Email no válido"),
    body('password')
        .notEmpty().withMessage("El password es obligatorio"),
    handleInputErrors,
    AuthController.login
)


router.post('/forgot-password',
    body('email')
        .isEmail().withMessage("Email no válido"),
    handleInputErrors

)

export default router