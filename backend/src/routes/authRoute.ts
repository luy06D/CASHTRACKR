import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateUserErrors } from "../middleware/Authenticate";
import { handleInputErrors } from "../middleware/validation";


const router = Router()

router.post('/create-account',
    validateUserErrors,
    handleInputErrors,
    AuthController.createAccount)


export default router