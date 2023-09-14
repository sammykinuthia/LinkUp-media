import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import mssql, { connect } from 'mssql'
import { describe, test, expect, vi, afterEach } from "vitest";
import { loginUser, registerUser } from "../Controllers/usersController.js";
// import { pool } from '../Config/config.js';
import { registerSchema } from '../Validators/usersValidator.js';
import { pool } from '../Config/config.js';
// import * as jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken')

// vi.spyOn(mssql, 'connect').mockRejectedValueOnce({
//     connected: true,
//     request: {
//         input: vi.fn().mockReturnThis(),
//         execute: vi.fn().mockResolvedValueOnce({ rowsAffected: [1] })
//     }
// })

describe("login user", () => {
    test("login suceess", async () => {
        let reqM = {
            body:
            {
                email: "sam@gmail.com",
                password: "sam"
            }
        }
        let resM = {
            json: vi.fn().mockReturnThis(),
            status: vi.fn().mockReturnThis()
        }
        await loginUser(reqM, resM)
        expect(resM.status).toHaveBeenCalled(200)

    })

    test("no password", async () => {
        let reqM = {
            body: { email: "sam@gmail.com" }
        }
        let resM = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        }
        await loginUser(reqM, resM)
        expect(resM.status).toHaveBeenCalledWith(422)

    })
    test("no email and password", async () => {
        let reqM = {
            body: {}
        }
        let resM = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        }
        await loginUser(reqM, resM)
        expect(resM.status).toHaveBeenCalledWith(422)
    })

})

describe("User Registration", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })
    test("Provide password", async () => {
        let reqM = {
            body: {
                email: "samuelmwaniki@gmail.com",
                username: "sam"
            }
        }
        let resM = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        const registrationValidation = vi.spyOn(registerSchema, 'validate')
        registrationValidation.mockReturnValueOnce({ error: new Error('Password required') })
        await registerUser(reqM, resM)
        expect(resM.status).toHaveBeenCalledWith(422)
    })
    test("successifully register user", async () => {
        let req = {
            body: {
                email: "sam@gmail.com",
                username: "sam1",
                password: "sam"
            }
        }
        let res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        }
        // const conn = await pool
        // vi.mock(conn, () => {
        //     connected:true;
        //     request: vi.fn().mockResolvedValueOnce({
        //         input:vi.fn().mockReturnValueOnce(),
        //         execute:vi.fn().mockResolvedValue({
        //             rowsAffected:[1]
        //         })
        //     })
        // })

        const pool = vi.spyOn(mssql, 'connect')
        // pool.mockReturnValueOnce({connected: true})
        pool.mockResolvedValueOnce({
            request: vi.fn().mockReturnThis(),
            input: vi.fn().mockReturnThis(),
            execute: vi.fn().mockResolvedValueOnce({ rowsAffected: [1] }) 
        })
        vi.spyOn(jwt, 'sign').mockReturnValueOnce("token")
        // vi.spyOn(mssql, 'connect').mockResolvedValueOnce({
        //     request: vi.fn().mockReturnThis(),
        //     input: vi.fn().mockReturnThis(),
        //     execute: vi.fn().mockResolvedValueOnce({ rowsAffected: [1] })
        // })

        // vi.spyOn(jwt, 'sign').mockReturnValue('Token')

        await registerUser(req, res)
        expect(res.status).toHaveBeenCalledWith(201)

    })
})