import request from 'supertest'
import server from '../../server'


describe('Athentication -  Create Account', () => {

    it('should display validation errors when form is empty ', async() => {

        const response = await request(server)
        .post('/api/auth/create-account')
        .send({})

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)
        
    })
})