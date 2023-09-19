const { registerUser } = require('../Controllers/usersController.js'); // Import your controller here
const { pool } = require('../Config/config.js'); // Import your database connection here
const bcrypt = require('bcrypt')
const mssql = require('mssql')
import { registerSchema } from '../Validators/usersValidator'
const jwt = require('jsonwebtoken')

jest.mock('jsonwebtoken')

jest.mock('../Config/config.js', () => ({
    pool: {
        connected: true,
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        execute: jest.fn(()=>{
          return  {rowsAffected:[1]}
        }),
    }
}))

describe("reg user", () => {

    it("reg users success", async () => {
        const req = {
            body: {
                email: "sam@gmail.com",
                password: "sam",
                username: "sam"
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const conn = await pool
        // console.log(conn);

       const mockedToken = "kbjksbfjksbjfb"
       const token = (jwt.sign).mockReturnValue(mockedToken)
    //    console.log(token);
        await registerUser(req, res)
        expect(res.status).toHaveBeenCalledWith(201)
       
    })
})