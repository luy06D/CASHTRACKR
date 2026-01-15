import { Response, Request, json } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";


// CREAMOS LOS CONTROLADORES PARA CADA RUTA _ API REST
export class BudgetController {

    static getAll = async (req: Request, res: Response) => {
        try {

            const budget = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],

                where: {
                    userId: req.user.id
                }
            })

            res.json(budget)

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})

        }

    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body)
            budget.userId = req.user.id // registra el id del usuario autenticado 
            await budget.save()
            res.status(201).json('Presupuesto registrado correctamente')
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static getById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        });

        res.json(budget)
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