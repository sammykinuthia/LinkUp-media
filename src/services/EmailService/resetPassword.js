import dotenv from 'dotenv'
import ejs from 'ejs'
import { sendMail } from '../Helpers/email.js'
dotenv.config()
import { pool as connectionPool } from '../../app/Config/config.js'

export const VerifyUser = async () => {
    const pool = await connectionPool
   
    if (pool.connected) {
        const users = await (await pool.request().execute("uspResetUserPwd")).recordset
        for (let user of users) {
            console.log(user);
            ejs.renderFile('./src/services/Templates/verificationEmail.ejs', { username: user.username, code: user.code }, async (error, html) => {
                if (error) {
                    console.log(error);
                    return;
                }
                const message = {
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: "Verification code",
                    html
                }
                try {
                    await sendMail(message)
                    await pool.request().input("code", user.code).execute("uspSetCodeSent")

                } catch (error) {
                    console.log(error);
                }
            })
        }
    }
    else {
        console.log("failed to connect to db");
    }
}


