import { pool } from "../Config/config.js"

export const search = async (req, res) => {
    try {
        const conn = await pool
        const {text}  = req.body
        if (conn.connected) {
            const result = await conn.request()
                .input("text", text)
                .execute("uspSearch")
            if (result.rowsAffected[0] == 0) {
                return res.status(404).json({ message: "saerch not found " })
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