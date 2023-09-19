import mssql from 'mssql'
// const mssql = 'mssql'
import bcrypt from 'bcrypt'
import { registerUser } from "../Controllers/usersController";
import jwt from 'jsonwebtoken'
import { pool } from '../Config/config.js'

// mock database connection
jest.mock('../Config/config.js', () => ({
    pool: {
        connected: true,
        request: jest.fn()
    }
}));

// Mock bcrypt.hash to avoid actual hashing
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
}));



// registration route
describe('user registration', () => {
      test("success registration", async () => {

        const mockResult = {
            rowsAffected: [1]
        }

        // pool.request.mockResolvedValueOnce(mockResult)
        console.log((await pool).connected);
        req.body = {
            username: "admin",
            email: "admin@gmail.com",
            password: "admin"
        }


        await registerUser(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
    })
})