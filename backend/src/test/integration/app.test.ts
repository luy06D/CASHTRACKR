import request from 'supertest'
import server from '../../server'
import { AuthController } from '../../controllers/AuthController'
import { AuthEmail } from '../../email/AuthEmail'

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

    it('should display error if token is empty or token not valid', async () =>{
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











})