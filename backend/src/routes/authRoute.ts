import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateUserErrors } from "../middleware/Authenticate";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";
import { limiter } from "../config/limiter";
import { authenticate } from "../middleware/auth";


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
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no válida'),
    handleInputErrors,
    AuthController.validateToken
)


router.post('/reset-password/:token',
    param('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no válida'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password debe tener como minimo 8 caracteres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

router.post('/update-password',
    authenticate,
    body('current_password')
        .isLength({ min: 8 }).withMessage('El password debe tener como minimo 8 caracteres'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password debe tener como minimo 8 caracteres'),

    AuthController.updateCurrentUserPassword

)

export default router