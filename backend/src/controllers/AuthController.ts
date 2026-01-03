import { Response, Request, json } from "express";
import User from "../models/User"
import { comparePassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token"
import { AuthEmail } from "../email/AuthEmail";
import { generateJWT } from "../utils/jwt";

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

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token

            })

            await user.save()
            res.status(201).json('Usuario registrado correctemente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }


    }

    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body

        const user = await User.findOne({ where: { token } })

        if (!user) {
            const error = new Error('Token no válido')
            return res.status(401).json({ error: error.message })
        }

        user.confirmed = true
        user.token = null
        await user.save()

        res.json('Cuenta de usuario confirmada correctamente.')


    }

    static login = async (req: Request, res: Response) => {

        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user) {
            const error = new Error('El email no encontrado')
            return res.status(402).json({ error: error.message })
        }

        if (!user.confirmed) {
            const error = new Error('La cuenta no esta confirmada')
            return res.status(403).json({ error: error.message })
        }

        const isPasswordCorrect = await comparePassword(password, user.password)

        if (!isPasswordCorrect) {
            const error = new Error('La contraseña ingresada es incorrecta')
            return res.status(403).json({ error: error.message })
        }

        const token =  generateJWT(user.id)
        res.json(token)

    }
}