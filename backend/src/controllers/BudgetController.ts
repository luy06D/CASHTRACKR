import { Response, Request, json } from "express";
import Budget from "../models/Budget";

// Accediendo al Request para agregar una nueva propiedad
declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

// CREAMOS LOS CONTROLADORES PARA CADA RUTA _ API REST
export class BudgetController {

    static getAll = async (req: Request, res: Response) => {
        const budget = await Budget.findAll({
            order: [
                ['createAt', 'DESC']
            ],

            //TODO: luego filtrar por el usuario autenticado 
        })

        res.json(budget)
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body)
            await budget.save()
            res.status(201).json('Presupuesto registrado correctamente')
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static getById = async (req: Request, res: Response) => {
        res.json(req.budget)
    }

    static updateById = async (req: Request, res: Response) => {
        await req.budget.update(req.body)
        res.json('Presupuesto actualizado correctamente')

    }

    static deleteById = async (req: Request, res: Response) => {
        await req.budget.destroy()
        res.json('Presupuesto eliminado correctamente')

    }



}