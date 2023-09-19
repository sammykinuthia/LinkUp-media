const { registerUser } = require('../Controllers/usersController.js'); // Import your controller here
const { pool } = require('../Config/config.js'); // Import your database connection here
const bcrypt = require('bcrypt');
// import { createMockPool } from 'jest-mock-extended';

// Mock bcrypt.hash to avoid actual hashing
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

// Mock your pool object to avoid database calls
jest.mock('../Config/config.js', () => ({
    pool: {
        connected:true,
        request:{
            input:jest.fn().mockReturnThis(),
            execute:jest.fn().mockResolvedValueOnce({})
        }
    }
}));

// Mock the mssql module and its connect method
jest.mock('mssql', () => {
    const mssql = jest.requireActual('mssql');
    return {
      ...mssql,
      connect: jest.fn(),
    };
  });

describe('registerUser controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                username: "admin",
                email: "admin@gmail.com",
                password: "admin"
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should register a user', async () => {
        // const mockPool = createMockPool();

        // mockPool.request.mockResolvedValueOnce(mockResult);
        // pool.mockReturnValueOnce(mockPool)
        

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Register success',
            token: expect.any(String),
        });
    });

    it('should handle validation errors', async () => {
        req.body = {};
        await registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
    });

    it('should handle database connection error', async () => {
        // Mock a database connection error
        pool.connected = false;
        await registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should handle user registration error', async () => {
        // error registering user
        pool.request.mockResolvedValueOnce({ rowsAffected: [0] });
        await registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should handle unexpected errors', async () => {
        // Mock an unexpected error
        pool.request.mockRejectedValueOnce(new Error('Unexpected error'));
        await registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
