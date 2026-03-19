import {createRequest, createResponse} from 'node-mocks-http'
import User from '../../../models/User'
import { AuthController } from '../../../controllers/AuthController'
import { hashPassword } from '../../../utils/auth';
import { generateToken } from '../../../utils/token';


jest.mock('../../../models/User');
jest.mock('../../../utils/auth');
jest.mock('../../../utils/token');

describe('AuthController.createAccount', () => {

    it('should return a 409 status and error message if the email is already registered', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(true)
        
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: 'cusi@gmail.com',
                password: '12345678'
            }

        })

        const res = createResponse();
        await AuthController.createAccount(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(409),
        expect(data).toHaveProperty('error', 'El usuario ya esta registrado')
        expect(User.findOne).toHaveBeenCalled()
        expect(User.findOne).toHaveBeenCalledTimes(1)


       
    })

    it('should register a new user and return a success message ', async () => {
     
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: 'cusi@gmail.com',
                password: '12345678'
            }

        })

        const res = createResponse();
        const userMock = { ...req.body, save: jest.fn()};
        
        (User.create as jest.Mock).mockResolvedValue(userMock);
        (hashPassword as jest.Mock).mockResolvedValue('Simulacion');
        (generateToken as jest.Mock).mockResolvedValue('12345');

        await AuthController.createAccount(req, res);
        
    })
    
})