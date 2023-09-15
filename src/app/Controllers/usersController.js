import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { pool } from '../Config/config.js'
import { loginSchema, registerSchema, updateSchema } from '../Validators/usersValidator.js'
// const dotenv = require ('dotenv')
// dotenv.config()


export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const { error } = registerSchema.validate(req.body)
        if (error) {
            return res.status(422).json(error.details)

        }
        const id = v4()
        const hashPwd = await bcrypt.hash(password, 4)
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request()
                .input("id", id)
                .input("username", username)
                .input("email", email)
                .input("password", hashPwd)
                .execute("uspRegisterUser")
            if (result.rowsAffected[0] == 0) {
                console.log(res);
                res.status(500).json({ Error: "error creating user" })
            }
            else {
                const token = jwt.sign({ username, email, id }, process.env.SECRET, { expiresIn: "4h" })
                res.status(201).json({ message: "Register success", token })
            }
        }
        else {
            console.log(res);
            res.status(500).json({ "message": "error connecting to db" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { username, email, name, image, phone } = req.body
        const id = req.info.id
        // console.log(req.body);
        const { error } = updateSchema.validate(req.body)
        if (error) {
            return res.status(422).json(error.details)

        }
        const conn = await pool
        if (conn.connected) {

            const result = await conn.request()
                .input("id", id)
                .input("username", username)
                .input("email", email)
                .input("name", name)
                .input("image", image)
                .input("phone", phone)
                .execute("uspUpdateUser")

            if (result.rowsAffected[0] == 0) {
                res.status(500).json({ Error: "error creating user" })

            }
            else {
                res.status(204).json({ message: "Updated successifully", data: result.recordset })
            }
        }
        else {
            res.status(500).json({ "message": "error connecting to db" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const { error } = loginSchema.validate(req.body)
        if (error) {
            return res.status(422).json(error.details)
        }
        const conn = await pool
        if (conn.connected) {
            const user = await conn.request()
                .input("email", email)
                .execute("uspGetUserByEmail")
            if (user.rowsAffected[0] == 0) {
                res.status(403).json({ message: "User with that email does not exist" })
            }
            else {
                const { username, password: hashedPwd, email, id } = user.recordset[0]
                const result = await bcrypt.compare(password, hashedPwd)
                if (result) {
                    const token = jwt.sign({ username, email, id }, process.env.SECRET, { expiresIn: "4h" })
                    res.status(200).json({ message: "Login success", token })
                }
                else {
                    res.status(403).json({ message: "wrong password" })

                }
            }
        }
        else {
            res.status(500).json({ "message": "error connecting to db" })
        }
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
}



export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const conn = await pool
        if (conn.connected) {
            const code = v4().slice(0, 6)
            const user = await conn.request()
                .input("email", email)
                .execute("uspGetUserByEmail")
            if (user.rowsAffected[0] == 0) {
                res.status(404).json({ message: "email not found" })
            }
            else {
                const { id } = user.recordset[0]
                const result = await conn.request()
                    .input("id", id)
                    .input("code", code)
                    .execute("uspSaveResetCode")
                if (result.rowsAffected[0] == 0) {
                    res.status(500).json({ message: "code could not be saved" })
                }
                else {
                    res.status(200).json({ message: "ok" })
                }

            }

        }
        else {
            res.status(500).json({ error: "error connecting to db" })
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



export const verifyCode = async (req, res) => {
    try {
        const { code, email } = req.body
        const conn = await pool
        if (conn.connected) {
            const user = await conn.request()
                .input("email", email)
                .execute("uspGetUserByEmail")
            if (user.rowsAffected[0] == 0) {
                res.status(404).json({ message: "email not found" })
            }
            else {
                const { id } = user.recordset[0]
                const result = await conn.request()
                    .input("id", id)
                    .input("code", code)
                    .execute("uspSaveResetCode")
                if (result.rowsAffected[0] == 0) {
                    res.status(500).json({ message: "code could not be saved" })
                }
                else {
                    res.status(200).json({ message: "Code verified" })
                }
            }
        }
        else {
            res.status(500).json({ error: "error connecting to db" })

        }

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

export const changePassword = async (req, res) => {
    try {
        const { email, password } = req.body
        const conn = await pool
        if (conn.connected) {
            const hashedPwd = await bcrypt.hash(password, 4)
            const result = await conn.request()
                .input("email", email)
                .input("password", hashedPwd)
                .execute("uspChangePassword")
            if (result.rowsAffected[0] == 0) {
                res.status(500).json({ message: "Password could not be updated" })
            }
            else {
                res.status(200).json({ message: "Password Updated successifully" })
            }
        }
        else {
            res.status(500).json({ error: "error connecting to db" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const verifyUser = async (req, res) => {
    try {
        if (req.info) {
            const { id } = req.info
            const conn = await pool
            if (conn.connected) {
                const result = await conn.request()
                    .input("id", id)
                    .execute("uspGetCurrentUser")
                if (result.rowsAffected[0] == 0) {
                    return res.status(500).json({ message: "Unable to get the user" })
                }
                else {
                    return res.status(200).json({ data: result.recordset })
                }
            }
            else {
                return res.status(500).json({ error: "error connecting to db" })
            }

        }
        else {
            return res.status(401).json({ message: "token not found" })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const getUser = async (req, res) => {
    try {

        const { user_id } = req.params
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request()
                .input("id", user_id)
                .execute("uspGetUser")
            if (result.rowsAffected[0] == 0) {
                return res.status(500).json({ message: "Unable to get the user" })
            }
            else {
                return res.status(200).json({ data: result.recordset })
            }
        }
        else {
            return res.status(500).json({ error: "error connecting to db" })
        }

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


export const getUsersFollowing = async (req, res) => {
    try {
        const user_id = req.info.id
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request().input("user_id", user_id).execute("uspGetUsersFollowing")
            if (result.rowsAffected[0] == 0) {
                res.status(404).json({ message: "no users" })
            }
            else {
                res.status(200).json({ data: result.recordset })
            }
        }
        else {
            res.status(500).json(error)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUsersNotFollowing = async (req, res) => {
    try {
        const user_id = req.info.id
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request().input("user_id", user_id).execute("uspGetUsersNotFollowing")
            if (result.rowsAffected[0] == 0) {
                res.status(404).json({ message: "no users" })
            }
            else {
                res.status(200).json({ data: result.recordset })
            }
        }
        else {
            res.status(500).json(error)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


export const followUser = async (req, res) => {
    try {
        const id = req.info.id
        const { follow_id } = req.body
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request()
                .input("id", id)
                .input("follow_id", follow_id)
                .execute("uspFollowUser")
            if (result.rowsAffected[0] == 0) {
                return res.status(500).json({ message: "Unable to follow user" })
            }
            else {
                return res.status(201).json({ message: "like success" })
            }
        }
        else {
            return res.status(500).json({ error: "error connecting to db" })
        }

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
