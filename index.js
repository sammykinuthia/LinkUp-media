import express from 'express'
import path from 'path'
import cors from 'cors'


const app = express()
const PORT=3000;
app.use(express.json())
app.use(cors())

app.use(express.static(path.join(path.dirname('.'), "public")))

app.listen(PORT,()=>console.log(`Listening at http://localhost:${PORT}`))