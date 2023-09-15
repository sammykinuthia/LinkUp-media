import mssql from 'mssql'
import bcrypt from 'bcrypt'
import { registerUser } from "../Controllers/usersController";


const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
}

describe("reg users", () => {
    it("reg fails", async () => {
        const req = {
            body: {
                email: "sam@gmail.com",
                username: "sam",
                password:"sam"
            }
        }
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("kjhgsaiuytwiulkyiyui")
        const mockedInput = jest.fn().mockReturnThis()
        const mockedExecute = jest.fn().mockResolvedValue({rowsAffected: [1]})
        const mockedRequest ={
            input: mockedInput,
            execute: mockedExecute
        }
        const mockedPool ={
            request: jest.fn().mockReturnValue(mockedRequest)
        }

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool)

        await registerUser(req, res)
        expect(res.status).toHaveBeenCalledWith(422)


    })
})