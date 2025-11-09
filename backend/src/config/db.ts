import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'

dotenv.config() // PARA CONFIGURAR DOTENV 

// INSTANCIA DE LA BASE DE DATOS 
export const db = new Sequelize(process.env.DATABASE_URL , {

})