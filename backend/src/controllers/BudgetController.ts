import { Response, Request } from "express";

// CREAMOS LOS CONTROLADORES PARA CADA RUTA _ API REST
export class BudgetController {

    static getAll = async (req: Request, res: Response) => {
        console.log("prueba de api rest ");
    }

     static create = async (req: Request, res: Response) => {
        console.log("Prueba API POST ");
    }

}