import { v4 } from "uuid"
import { pool } from "../Config/config.js"


export const createPost = async (req, res) => {
    try {
        const user_id = req.info.id
        const { post_message, post_image } = req.body
        const id = v4()
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request()
                .input("id", id)
                .input("user_id", user_id)
                .input("message", post_message)
                .input("image", post_image)
                .execute("uspCreatePost")
            if (result.rowsAffected[0] == 0) {
                return res.status(500).json({ message: "Unable to create post" })
            }
            else {
                return res.status(201).json({ message: "Post created successifully" })
            }
        }
        else {
            return res.status(500).json({ error: "error connecting to db" })
        }

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


export const getPosts = async (req, res) => {
    try {
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request()
                .execute("uspGetPosts")
            if (result.rowsAffected[0] == 0) {
                return res.status(500).json({ message: "Unable to get posts" })
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


export const getComments = async (req, res) => {
    try {
        const { post_id } = req.params
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request()
                .input("post_id", post_id)
                .execute("uspGetComments")
            if (result.rowsAffected[0] == 0) {
                return res.status(200).json({ message: "no comments" })
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


export const createComments = async (req, res) => {
    try {
        const { message, image, post_id,level,parent_comment } = req.body
        const id = v4()
        const user_id = req.info.id
        console.log(req.body);
        const conn = await pool
        if (conn.connected) {
            const result = await conn.request()
                .input("id", id)
                .input("message", message)
                .input("image", image)
                .input("level", level)
                .input("parent_comment", parent_comment)
                .input("user_id", user_id)
                .input("post_id", post_id)
                .execute("uspCreateComments")
            if (result.rowsAffected[0] == 0) {
                return res.status(500).json({ message: "comment not created" })
            }
            else {
                return res.status(201).json({ data: result.recordset })
            }
        }
        else {
            return res.status(500).json({ error: "error connecting to db" })
        }

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}