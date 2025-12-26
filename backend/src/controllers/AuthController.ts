import { Response, Request, json } from "express";
import User from "../models/User"

// CREAMOS LOS CONTROLADORES PARA CADA RUTA _ API REST
export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const user = new User(req.body)
            await user.save()
            res.status(201).json('Usuario registrado correctemente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }


    }
}