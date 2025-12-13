import { Response, Request, json } from "express";
import Budget from "../models/Budget";

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

        try {
            const {id} =  req.params
            const budget = await Budget.findByPk(id)
            
            if(!budget){
                const error = new Error('Presupuesto no encontrado ')
            return res.status
                

            }
            

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
            

        }

    }

    static updateById = async (req: Request, res: Response) => {
        console.log("Prueba API POST ");
    }

    static deleteById = async (req: Request, res: Response) => {
        console.log("Prueba API POST ");
    }



}