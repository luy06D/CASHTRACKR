import request from 'supertest'
import server from '../../server'
import { AuthController } from '../../controllers/AuthController'



describe('Athentication -  Create Account', () => {

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

    it('should return 201 status code', async () => {

        const data = {
            "name": "Luis",
            "password": "12345678",
            "email": "cusi@gmail.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            .send(data)
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')

        expect(response.statusCode).toBe(201)
        expect(response.body.errors).toHaveLength(1)

        expect(response.body.errors[0].msg).toBe('Usuario registrado correctemente')
        expect(response.statusCode).not.toBe(400)
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled()

    })




}) 