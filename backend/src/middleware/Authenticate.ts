import { Request, Response, NextFunction } from 'express'
import {  body} from 'express-validator'



export const validateUserErrors = async (req: Request, res: Response, next: NextFunction) => {

   await body('name')
            .notEmpty().withMessage('El nombre del usuario no puede ir vacio').run(req)
   await body('password')
            .isLength({min: 8}).withMessage('El password debe tener como minimo 8 caracteres').run(req)
   await body('email')
            .isEmail().withMessage('E-mail no válido').run(req)
    next()

}   