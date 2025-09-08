import express from 'express'
import cors from "cors"
import config from './config/config'
import { inventoryRoutes } from './routes/inventory.route'

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (_, res)=>{
    res.status(200).json({
        message: "Api is healthy..."
    })
})

app.use("/inventory", inventoryRoutes)

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
})