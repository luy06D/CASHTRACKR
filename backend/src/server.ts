import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db' 

async function connectDB() {
    try {
        await db.authenticate() // Autenticarse con la DB
        db.sync()  // SYNC creara las tablas y las columnas en automatico  - una vez definido el modelo
        console.log(colors.blue.bold('Conexion exitosa a la BD'));
        
    } catch (error) {
        console.log(error);
        
    }
    }

connectDB()



const app = express()

app.use(morgan('dev'))

app.use(express.json())



export default app