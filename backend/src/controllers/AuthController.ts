import { Response, Request, json } from "express";
import User from "../models/User"
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token"

// CREAMOS LOS CONTROLADORES PARA CADA RUTA _ API REST
export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        const { email, password } = req.body
        const emailExist = await User.findOne({ where: { email } })

        if (emailExist) {
            const error = new Error('El usuario ya esta registrado')
            return res.status(409).json({ error: error.message })
        }

        try {
            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = generateToken()


            await user.save()
            res.status(201).json('Usuario registrado correctemente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }


    }
}