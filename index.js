import express from 'express'
import path from 'path'
import cors from 'cors'
import nodeCron from 'node-cron'
import { userRouter } from './src/app/Routers/usersRouter.js';
import { postRouter } from './src/app/Routers/postsRouter.js';
import { VerifyUser } from './src/services/EmailService/resetPassword.js';
import { search } from './src/app/Controllers/searchController.js';


const app = express()
const PORT=3000;
app.use(express.json())
app.use(cors())

app.use(express.static(path.join(path.dirname('.'), "public")))
app.use("/users/", userRouter)
app.use("/posts/", postRouter)
app.use("/search", search)

nodeCron.schedule("*/3 * * * * *", async () => {
    await VerifyUser()
})

app.listen(PORT,()=>console.log(`Listening at http://localhost:${PORT}`))