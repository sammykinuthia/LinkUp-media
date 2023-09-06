import express from 'express'
import path from 'path'
import cors from 'cors'
import { userRouter } from './src/app/Routers/usersRouter.js';
import { postRouter } from './src/app/Routers/postsRouter.js';


const app = express()
const PORT=3000;
app.use(express.json())
app.use(cors())

app.use(express.static(path.join(path.dirname('.'), "public")))
app.use("/users/", userRouter)
app.use("/posts/", postRouter)

app.listen(PORT,()=>console.log(`Listening at http://localhost:${PORT}`))