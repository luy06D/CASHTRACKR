import {createRequest, createResponse} from 'node-mocks-http'
import User from '../../../models/User'
import { AuthController } from '../../../controllers/AuthController'
import { hashPassword } from '../../../utils/auth';
import { generateToken } from '../../../utils/token';
import { AuthEmail } from '../../../email/AuthEmail';


jest.mock('../../../models/User');
jest.mock('../../../utils/auth');
jest.mock('../../../utils/token');

describe('AuthController.createAccount', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    })

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
                password: '12345678',
                name: 'test Name'
            }

        })

        const res = createResponse();
        const userMock = { ...req.body, save: jest.fn()};
        
        (User.create as jest.Mock).mockResolvedValue(userMock);
        (hashPassword as jest.Mock).mockReturnValue('passwordHas');
        (generateToken as jest.Mock).mockReturnValue('123456');

        jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve()) ;  
        await AuthController.createAccount(req, res);

        expect(User.create).toHaveBeenCalledWith(req.body); 
        expect(User.create).toHaveBeenCalledTimes(1);
        expect(userMock.save).toHaveBeenCalled();
        expect(userMock.password).toBe('passwordHas')
        
        expect(userMock.token).toBe('123456')
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            token: '123456'
        })
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
        expect(res.statusCode).toBe(201);   
        
        
    })
    
})