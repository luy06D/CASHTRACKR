import request from 'supertest'
import server from '../../server'
import { AuthController } from '../../controllers/AuthController'
import User from '../../models/User'
import * as dataUtils from '../../utils/auth'
import * as dataJWT from '../../utils/jwt'
import { response } from 'express'

// mock de confirmationEmail
jest.mock('../../email/AuthEmail', () => ({
    AuthEmail: {
        sendConfirmationEmail: jest.fn().mockResolvedValue(true)
    }
}))

describe('Authentication -  Create Account', () => {

    it('should display validation errors when form is empty ', async () => {

        const response = await request(server)
            .post('/api/auth/create-account')
            .send({})
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)

        expect(response.statusCode).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(5)
        expect(createAccountMock).not.toHaveBeenCalled()

    })

    it('should return 400 when the email is invalid', async () => {

        const response = await request(server)
            .post('/api/auth/create-account')
            .send({
                "name": "LuisD",
                "password": "12345678",
                "email": "email_not_valide"
            })
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.statusCode).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled()

    })

    it('should return 400 status code when the password is less than 8 characters ', async () => {

        const response = await request(server)
            .post('/api/auth/create-account')
            .send({
                "name": "LuisD",
                "password": "short",
                "email": "cusi@gmail.com"
            })
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.body.errors[0].msg).toBe("El password debe tener como minimo 8 caracteres")

        expect(response.statusCode).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled()

    })

    // TODO: Optimizar las operaciones de la funcion CREATE-ACCOUNT --
    it('should return 201 status code', async () => {

        const data = {
            "name": "Luis",
            "password": "12345678",
            "email": "cusi@gmail.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            .send(data)

        // const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.statusCode).toBe(201)
        expect(response.statusCode).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')


    })

    it('should return 409 conflict when a user is already registared', async () => {

        const data = {
            "name": "Luis",
            "password": "12345678",
            "email": "cusi@gmail.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            .send(data)

        expect(response.statusCode).toBe(409)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('El usuario ya esta registrado')
        expect(response.statusCode).not.toBe(400)
        expect(response.statusCode).not.toBe(201)
        expect(response.body).not.toHaveProperty('errors')


    })


})

describe('Authentication - Account confirmation with token ', () => {

    it('should display error if token is empty or token not valid', async () => {
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                "token": "not_valid"
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Token no válida")

    })

    it('should display error if token is empty or token', async () => {
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                "token": "123456"
            })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Token no válido")

    })


    it('should confirm account with a valid token', async () => {

        const token = globalThis.cashTrackerConfirmationToken
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                "token": token
            })

        expect(response.status).toBe(200)
        expect(response.body).toBe('Cuenta de usuario confirmada correctamente.')

    })

})

describe('Authentication - Login', () => {
    // Limpia todos los mocks 
    beforeEach(() => {
        jest.clearAllMocks();
    })



    it('should display validation errors when the form is empty', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "email": '',
                "password": ''
            })

        const loginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
        expect(response.body.errors).not.toHaveLength(1)
        expect(loginMock).not.toHaveBeenCalled()

    })

    it('should return 400 bad request when the email is invalid ', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "email": "not_valid",
                "password": "12345678"
            })

        const loginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(400)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors).not.toHaveLength(2)
        expect(response.body.errors[0].msg).toBe('Email no válido')
        expect(loginMock).not.toHaveBeenCalled()

    })

    it('should return 404 error  if the user is not found', async () => {
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "email": "cusiluis@gmail.com",
                "password": "12345678"
            })

        const loginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Usuario no encontrado')
        expect(loginMock).not.toHaveBeenCalled()

    })

    it('should return 403 error  if the user account is not confirmed', async () => {

        (jest.spyOn(User, 'findOne') as jest.Mock).mockResolvedValue({
            id: 1,
            confirmed: false,
            password: 12345678,
            email: "usernotconfirmed@gmail.com"
        })
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "email": "usernotconfirmed@gmail.com",
                "password": "12345678"
            })


        expect(response.status).toBe(403)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La cuenta no esta confirmada')

    })


    it('should return 403 error  if the user account is not confirmed 2.0', async () => {

        const userData = {
            name: "Fabri",
            password: "12345678",
            email: "emaildeprueba@gmail.com"
        }
        await request(server)
            .post('/api/auth/create-account')
            .send(userData)

        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "email": userData.email,
                "password": userData.password,
            })


        expect(response.status).toBe(403)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La cuenta no esta confirmada')

    })


    it('should return a 401 error if the password is correct', async () => {

        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock).mockResolvedValue({
            id: 1,
            confirmed: true,
            password: 12345678,
            //        email: "usernotconfirmed@gmail.com"
        })

        const comparePassword = jest.spyOn(dataUtils, 'comparePassword').mockResolvedValue(false)
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "email": "usernotconfirmed@gmail.com",
                "password": "12345678"
            })


        expect(response.status).toBe(401)
        expect(response.status).not.toBe(200)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La contraseña ingresada es incorrecta')
        expect(findOne).toHaveBeenCalledTimes(1)
        expect(comparePassword).toHaveBeenCalledTimes(1)


    })

    it('should return a JWT', async () => {

        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock).mockResolvedValue({
            id: 1,
            confirmed: true,
            password: "hashedPassword",
            //        email: "usernotconfirmed@gmail.com"
        })

        const comparePassword = jest.spyOn(dataUtils, 'comparePassword').mockResolvedValue(true);
        const generateJWT = jest.spyOn(dataJWT, 'generateJWT').mockReturnValue('jwt_token');

        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "email": "usernotconfirmed@gmail.com",
                "password": "corretPassword"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual('jwt_token')

        expect(findOne).toHaveBeenCalled()
        expect(findOne).toHaveBeenCalledTimes(1)

        expect(comparePassword).toHaveBeenCalled()
        expect(comparePassword).toHaveBeenCalledTimes(1)
        expect(comparePassword).toHaveBeenCalledWith('corretPassword', 'hashedPassword')

        expect(generateJWT).toHaveBeenCalled()
        expect(generateJWT).toHaveBeenCalledTimes(1)
        expect(generateJWT).toHaveBeenCalledWith(1) //User id = 1

    })

})

let jwt: string

async function AuthenticateUser() {


    const response = await request(server)
        .post('/api/auth/login')
        .send({
            password: "12345678",
            email: "cusi@gmail.com"
        })

    jwt = response.body  // authendicamos al usuario
}

describe('GET /api/budgets', () => {

    beforeAll(() => {
        jest.restoreAllMocks() // restaura las funciones del hjest.Spy a su implementacion original
    })

    beforeAll(async () => {
        await AuthenticateUser()
    })

    it('should reject unauthenticatd Access to budgets without a jwt', async () => {
        const response = await request(server)
            .get('/api/budgets')


        expect(response.status).toBe(401)
        expect(response.body.error).toEqual('No autorizado')

    })

    it('should reject unauthenticatd Access to budgets without a valid jwt', async () => {
        const response = await request(server)
            .get('/api/budgets')
            .auth('not_valid', { type: "bearer" })


        expect(response.status).toBe(500)
        expect(response.status).not.toBe(200)
        expect(response.body.error).toEqual('Token no valido')

    })

    it('should allow authenticated access to budgets with a valid jwt', async () => {
        const response = await request(server)
            .get('/api/budgets')
            .auth(jwt, { type: 'bearer' })

        expect(response.status).not.toBe(401)
        expect(response.status).toBe(200)
        expect(response.body.error).not.toBe('No autorizado')
        expect(response.body).toHaveLength(0)

    })




})

describe('POST /api/budgets', () => {

    beforeAll(async () => {
        await AuthenticateUser()
    })


    it('should reject unauthenticatd post request to budgets without a jwt', async () => {
        const response = await request(server)
            .post('/api/budgets')


        expect(response.status).toBe(401)
        expect(response.status).not.toBe(200)
        expect(response.body.error).toEqual('No autorizado')

    })


    it('should display validation when the form is sudmitted with invalid data ', async () => {
        const response = await request(server)
            .post('/api/budgets')
            .auth(jwt, { type: 'bearer' })
            .send({})


        expect(response.status).toBe(400)
        expect(response.status).not.toBe(200)
        expect(response.body.errors).toHaveLength(4)
        expect(response.body.errors).not.toHaveLength(1)

    })



})

describe('GET /api/budgets/:id/', () => {

    beforeAll(async () => {
        await AuthenticateUser()
    })

    it('should reject unauthenticatd Access to budgets id without a jwt', async () => {
        const response = await request(server)
            .get('/api/budgets/1')


        expect(response.status).toBe(401)
        expect(response.body.error).toEqual('No autorizado')
    })

    it('should return 400 bad request when id is not valid', async () => {
        const response = await request(server)
            .get('/api/budgets/not_valid')
            .auth(jwt, { type: 'bearer' })

        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toEqual("ID no valido")
        expect(response.body.errors).toHaveLength(1)

    })

    it('should return 404 bad request when a budget doesnt exists', async () => {
        const response = await request(server)
            .get('/api/budgets/500')
            .auth(jwt, { type: 'bearer' })

        expect(response.status).toBe(404)
        expect(response.body.error).toEqual("Presupuesto no encontrado")


    })

    it('should return a single budget by id', async () => {

        const data = {
            name: "Samsung galaxy s24 ultra",
            amount: 5000
        }
        // Creamos un presupuesto
        const budget = await request(server)
            .post('/api/budgets')
            .auth(jwt, { type: 'bearer' })
            .send(data)

        expect(budget.status).toBe(201)


        const response = await request(server)
            .get('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })

        expect(response.status).toBe(200)
        expect(response.status).not.toBe(400)



    })

})


describe('PUT /api/budgets/:id/', () => {

    beforeAll(async () => {
        await AuthenticateUser()
    })

    it('should reject unauthenticatd put request to budgets id without a jwt', async () => {
        const response = await request(server)
            .put('/api/budgets/1')


        expect(response.status).toBe(401)
        expect(response.body.error).toEqual('No autorizado')
    })


    it('should display validation errors if the form is empty', async () => {
        const response = await request(server)
            .put('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })
            .send({})


        expect(response.status).toBe(400)
        expect(response.status).not.toBe(201)
        expect(response.body.errors).toHaveLength(4)
        expect(response.body.errors).toBeTruthy()
    })

    it('should update a budget by id and return a success message', async () => {
        const response = await request(server)
            .put('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })
            .send({
                name: "Update_budget",
                amount: 5500
            })


        expect(response.status).toBe(200)
        expect(response.status).not.toBe(400)
        expect(response.body).toEqual('Presupuesto actualizado correctamente')

    })
})


describe('DELETE /api/budgets/:id/', () => {

    beforeAll(async () => {
        await AuthenticateUser()
    })

    it('should reject unauthenticatd put request to budgets id without a jwt', async () => {
        const response = await request(server)
            .delete('/api/budgets/1')


        expect(response.status).toBe(401)
        expect(response.body.error).toEqual('No autorizado')
    })


    it('should return 404 not found when a budget doesnt exists', async () => {
        const response = await request(server)
            .delete('/api/budgets/3000')
            .auth(jwt, { type: 'bearer' })


        expect(response.status).toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body.error).toEqual('Presupuesto no encontrado')

    })

    it('should delete a budget  and return a success message', async () => {
        const response = await request(server)
            .delete('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })


        expect(response.status).toBe(200)
        expect(response.status).not.toBe(404)
        expect(response.body).toEqual('Presupuesto eliminado correctamente')

    })
})







